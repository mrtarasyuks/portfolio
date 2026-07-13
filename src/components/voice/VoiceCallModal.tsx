"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TurnstileWidget } from "@/components/voice/TurnstileWidget";
import { VoiceVisualizer } from "@/components/voice/VoiceVisualizer";
import { CallTimer } from "@/components/voice/CallTimer";
import { useAudioLevel } from "@/hooks/useAudioLevel";
import { startVoiceCall, type VoiceCallSession, type VoiceCallState as LibCallState } from "@/lib/voice/webrtcClient";
import { isValidEmail } from "@/lib/voice/email";
import { BIO_CARD_PORTRAIT_SRC } from "@/content/assetPaths";
import type { Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const CALL_DURATION_S = 120;
const WRAP_UP_AT_REMAINING_S = 10;
const SOFT_CUTOFF_AT_ELAPSED_S = CALL_DURATION_S - 10;
const TURNSTILE_TIMEOUT_MS = 8000;

type CallPhase = "email" | "verifying" | "connecting" | LibCallState | "finished" | "error";

/**
 * The whole call lifecycle in one modal: Turnstile → mint an ephemeral OpenAI session → WebRTC
 * handshake → live call → hard hangup at `CALL_DURATION_S`. Every exit path (hang-up button,
 * Escape, the X, an error, unmount) funnels through `endCall`, which is guarded to run its teardown
 * exactly once — this project has learned the hard way (see CLAUDE.md) that "clean up on close,
 * resize, and error too" is the part that's easy to half-do.
 */
export function VoiceCallModal({
  onClose,
  locale,
  t,
  hasPortrait,
}: {
  onClose: () => void;
  locale: Locale;
  t: CopyDict;
  /** Server-checked once in the root layout (`publicAssetExists`), same pattern as the homepage
   * bio cube's photo slots — falls back to a plain glyph if the portrait file isn't there yet. */
  hasPortrait: boolean;
}) {
  const tv = t.aiAgent.voiceCall;
  const [phase, setPhase] = useState<CallPhase>("email");
  const [errorMessage, setErrorMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(CALL_DURATION_S);
  const [streams, setStreams] = useState<{ remote: MediaStream; local: MediaStream } | null>(null);
  const [email, setEmail] = useState("");

  const sessionRef = useRef<VoiceCallSession | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const softCutoffFiredRef = useRef(false);
  const endedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const deferredEndTimeoutRef = useRef<number | null>(null);

  const remoteLevelRef = useAudioLevel(streams?.remote);
  const localLevelRef = useAudioLevel(streams?.local);

  const endCall = useCallback((finalPhase: "finished" | "error", message?: string) => {
    if (endedRef.current) return;
    endedRef.current = true;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    sessionRef.current?.disconnect();
    setPhase(finalPhase);
    if (message) setErrorMessage(message);
  }, []);

  const handleClose = useCallback(() => {
    endCall("finished");
    onClose();
  }, [endCall, onClose]);

  // Mount/unmount only (empty deps, deliberately not `[endCall, handleClose]`) — `handleClose`
  // depends on the `onClose` prop, which the parent passes as a fresh inline function on every one
  // of its own re-renders. If this effect depended on it, its cleanup (which tears down the live
  // call) would re-fire on any unrelated parent re-render, silently hanging up an active call —
  // caught via a runtime smoke test, not a guess.
  //
  // The teardown itself is deferred by a tick rather than called straight from the cleanup: React
  // Strict Mode's dev-only double-invoke runs mount → cleanup → mount synchronously on first mount
  // to catch exactly this class of non-idempotent-cleanup bug. Deferring lets the immediate
  // remount cancel the pending teardown before it ever runs, while a genuine unmount (nothing left
  // to cancel it) still ends the call for real.
  useEffect(() => {
    if (deferredEndTimeoutRef.current) {
      window.clearTimeout(deferredEndTimeoutRef.current);
      deferredEndTimeoutRef.current = null;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      deferredEndTimeoutRef.current = window.setTimeout(() => endCall("finished"), 0);
    };
  }, [endCall]);

  // Escape-to-close: safe to depend on `handleClose` since re-adding this listener on every
  // identity change is idempotent — no teardown side effect beyond removing/re-adding a listener.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // If Turnstile never resolves (misconfigured site key, blocked script, etc.) don't leave the
  // visitor staring at a silent challenge forever.
  useEffect(() => {
    if (phase !== "verifying") return;
    const timeout = window.setTimeout(() => {
      if (!endedRef.current) endCall("error", tv.notConfigured);
    }, TURNSTILE_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [phase, endCall, tv.notConfigured]);

  const tick = useCallback(() => {
    if (!startTimeRef.current || endedRef.current) return;
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const remaining = CALL_DURATION_S - elapsed;
    setRemainingSeconds(remaining);

    if (elapsed >= SOFT_CUTOFF_AT_ELAPSED_S && !softCutoffFiredRef.current) {
      softCutoffFiredRef.current = true;
      sessionRef.current?.cancelResponse();
    }
    if (remaining <= 0) endCall("finished");
  }, [endCall]);

  // Stable across re-renders (matters for the same reason `handleClose` needed to be: this is
  // passed to `TurnstileWidget`, whose own effect depends on it — an unstable callback there would
  // destroy and recreate the real Cloudflare widget on every unrelated render).
  const handleTurnstileToken = useCallback(
    async (token: string) => {
      setPhase("connecting");
      try {
        const res = await fetch("/api/voice/session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ turnstileToken: token, visitorEmail: email }),
        });
        const data = await res.json();
        if (!res.ok || !data.clientSecret) {
          if (res.status === 403) return endCall("error", tv.verificationError);
          if (res.status === 429) return endCall("error", tv.rateLimitedError);
          if (res.status === 500) return endCall("error", tv.notConfigured);
          return endCall("error", tv.connectionError);
        }

        const session = await startVoiceCall(data.clientSecret, locale, email, {
          onStateChange: (state) => {
            if (endedRef.current) return;
            setPhase(state);
            if (!startTimeRef.current) {
              startTimeRef.current = Date.now();
              intervalRef.current = window.setInterval(tick, 1000);
            }
          },
          onError: () => endCall("error", tv.connectionError),
        });

        if (endedRef.current) {
          session.disconnect();
          return;
        }

        sessionRef.current = session;
        setStreams({ remote: session.remoteStream, local: session.localStream });
        if (audioRef.current) {
          audioRef.current.srcObject = session.remoteStream;
          audioRef.current.play().catch(() => {});
        }
      } catch (err) {
        const isMicDenied = err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
        endCall("error", isMicDenied ? tv.micDenied : tv.connectionError);
      }
    },
    [email, locale, tv, endCall, tick]
  );

  const isLive = phase === "listening" || phase === "speaking";
  const showStatusLabel = phase === "connecting" || isLive;
  const statusLabel =
    phase === "verifying"
      ? tv.verifying
      : phase === "connecting"
        ? tv.connecting
        : phase === "listening"
          ? tv.listening
          : phase === "speaking"
            ? tv.speaking
            : phase === "finished"
              ? tv.finished
              : errorMessage;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={tv.modalTitle}
    >
      <audio ref={audioRef} autoPlay className="hidden" />

      <button
        type="button"
        onClick={handleClose}
        aria-label={tv.close}
        className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
      >
        <CloseGlyph />
      </button>

      <div
        className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-tint-strong)] p-8 text-center shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="font-display text-lg font-bold text-white">{tv.modalTitle}</p>
          {(phase === "email" || phase === "verifying") && <p className="mt-1 text-sm text-white/60">{tv.modalSubtitle}</p>}
        </div>

        {/* Visible for the whole lifetime of the call window, not just once actually connected —
            the level ref just sits at 0 (a static baseline glow) until there's a real audio stream. */}
        <VoiceVisualizer levelRef={phase === "speaking" ? remoteLevelRef : localLevelRef} color="var(--signal, #ffcc33)">
          <Avatar hasPortrait={hasPortrait} />
        </VoiceVisualizer>

        {phase === "email" && (
          <EmailStep tv={tv} onSubmit={(value) => { setEmail(value); setPhase("verifying"); }} />
        )}

        {phase === "verifying" && <TurnstileWidget onToken={handleTurnstileToken} />}

        {showStatusLabel && <p className="font-mono text-sm uppercase tracking-wide text-white/70">{statusLabel}</p>}

        {isLive && (
          <>
            <CallTimer remainingSeconds={remainingSeconds} />
            {remainingSeconds <= WRAP_UP_AT_REMAINING_S && <p className="text-xs text-white/50">{tv.wrappingUp}</p>}
            <button
              type="button"
              onClick={() => endCall("finished")}
              className="rounded-full bg-red-500/90 px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-white transition-transform hover:scale-105 active:scale-95"
            >
              {tv.hangUp}
            </button>
          </>
        )}

        {(phase === "finished" || phase === "error") && (
          <>
            <p className={phase === "error" ? "text-sm text-red-300" : "text-sm text-white/70"}>{statusLabel}</p>
            <div className="flex gap-3">
              {phase === "error" && (
                <button
                  type="button"
                  onClick={() => {
                    endedRef.current = false;
                    softCutoffFiredRef.current = false;
                    startTimeRef.current = null;
                    setRemainingSeconds(CALL_DURATION_S);
                    setStreams(null);
                    setPhase("verifying");
                  }}
                  className="rounded-full bg-signal px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-signal-ink transition-transform hover:scale-105 active:scale-95"
                >
                  {tv.tryAgain}
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-white/20 px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-white transition-transform hover:scale-105 active:scale-95"
              >
                {tv.close}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Gates the call behind an email — required so Serhii can see whose call generated a given
 * Telegram notification (both the "call started" push and any unanswered-question push carry it). */
function EmailStep({ tv, onSubmit }: { tv: CopyDict["aiAgent"]["voiceCall"]; onSubmit: (email: string) => void }) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = isValidEmail(value);

  return (
    <form
      className="flex w-full flex-col items-center gap-3"
      // noValidate: without it, the browser's own native email-format check intercepts submit
      // before this handler runs at all for some invalid values, so our own (localized, styled)
      // error message never gets a chance to show — one validation path, not two disagreeing ones.
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (valid) onSubmit(value.trim());
      }}
    >
      <p className="text-sm text-white/70">{tv.emailPrompt}</p>
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tv.emailPlaceholder}
        // text-base (16px): the same iOS Safari auto-zoom-on-focus fix already applied to the text
        // chat's input — any input under 16px triggers it.
        className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-center text-base text-white outline-none placeholder:text-white/40"
      />
      {touched && !valid && <p className="text-xs text-red-300">{tv.emailInvalid}</p>}
      <button
        type="submit"
        className="rounded-full bg-signal px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-signal-ink transition-transform hover:scale-105 active:scale-95"
      >
        {tv.emailContinue}
      </button>
    </form>
  );
}

function Avatar({ hasPortrait }: { hasPortrait: boolean }) {
  if (!hasPortrait) {
    return (
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl">
        🎙
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BIO_CARD_PORTRAIT_SRC}
      alt=""
      className="relative h-24 w-24 rounded-full border border-white/15 object-cover"
    />
  );
}

function CloseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
