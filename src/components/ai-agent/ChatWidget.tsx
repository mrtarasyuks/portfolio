"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/cn";
import { VoiceCallButton } from "@/components/voice/VoiceCallButton";
import { VoiceCallModal } from "@/components/voice/VoiceCallModal";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Floating "ask about Serhii" chat widget, mounted once globally (root layout) — a round toggle
 * button bottom-right that expands a small panel in normal document flow (accordion-style height
 * transition, same idiom `GridScrollControl`'s width transition uses) rather than as a modal
 * overlay, since the rest of the page stays usable behind it. Conversation state is plain
 * component state, not persisted. Every text reply is grounded server-side (`/api/chat`) in the
 * site's real profile/project content, not freeform. The bright green banner right under the panel
 * header opens `VoiceCallModal` — a live voice call (OpenAI Realtime API over WebRTC) grounded in
 * the exact same content via `buildVoiceAgentInstructions()`, so the two agents can't drift apart.
 */
export function ChatWidget({ locale, hasPortrait }: { locale: Locale; hasPortrait: boolean }) {
  const t = getCopy(locale);
  const [open, setOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  // Stable identity — VoiceCallModal's mount/unmount effect depends on this closing over `endCall`;
  // a fresh inline arrow on every ChatWidget render would make that dependency unstable too.
  const closeCall = useCallback(() => setCallOpen(false), []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  // Keep the page behind the panel still while it's open — otherwise a background scroll (or the
  // viewport shift a mobile keyboard causes) fights with the panel's own internal scroll.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || pending) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setPending(true);
    setError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error("chat request failed");
      setMessages([...next, { role: "assistant", content: data.reply as string }]);
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      <div
        role="region"
        aria-label={t.aiAgent.title}
        aria-hidden={!open}
        className={cn(
          // A solid-ish `bg-surface/95` here, not the translucent `--glass-tint` this codebase's
          // other glass surfaces use — this widget is `fixed` above arbitrary page content
          // (the hero scene, ambient blobs, plain light-theme background), so its text needs
          // guaranteed contrast rather than contrast that depends on whatever happens to render
          // behind it. `backdrop-blur-xl` stays for a touch of frost at the 5% that's still see-through.
          "w-[min(340px,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-surface/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300",
          open ? "scale-100 opacity-100" : "pointer-events-none h-0 scale-95 opacity-0"
        )}
      >
        <div className="flex flex-col gap-3 border-b border-[var(--glass-border)] px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-sm font-bold text-text">{t.aiAgent.title}</p>
            <p className="text-xs font-medium text-text">{t.aiAgent.subtitle}</p>
          </div>
          <VoiceCallButton label={t.aiAgent.voiceCall.bannerLabel} onClick={() => setCallOpen(true)} />
        </div>

        <div ref={listRef} className="flex max-h-[50dvh] min-h-[160px] flex-col gap-2 overflow-y-auto px-4 py-3">
          <Bubble role="assistant">{t.aiAgent.greeting}</Bubble>
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>
              {m.content}
            </Bubble>
          ))}
          {pending && <Bubble role="assistant">{t.aiAgent.thinking}</Bubble>}
          {error && <Bubble role="assistant">{t.aiAgent.errorMessage}</Bubble>}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[var(--glass-border)] p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.aiAgent.placeholder}
            tabIndex={open ? 0 : -1}
            // text-base (16px), not text-sm: iOS Safari auto-zooms the whole page on focus for any
            // input under 16px, which is the "page zooms in and needs a manual pinch back out" bug.
            className="min-w-0 flex-1 rounded-full border border-[var(--glass-border)] bg-[var(--glass-tint)] px-4 py-2 text-base text-text outline-none placeholder:text-text-dim"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            tabIndex={open ? 0 : -1}
            className="shrink-0 rounded-full bg-signal px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-signal-ink transition-transform active:scale-95 disabled:opacity-50"
          >
            {t.aiAgent.send}
          </button>
        </form>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.aiAgent.closeLabel : t.aiAgent.openLabel}
        title={open ? t.aiAgent.closeLabel : t.aiAgent.openLabel}
        className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-tint-strong)] text-text shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform hover:scale-105 active:scale-95"
      >
        <ChatGlyph open={open} />
      </button>

      {callOpen && <VoiceCallModal locale={locale} t={t} onClose={closeCall} hasPortrait={hasPortrait} />}
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: string }) {
  return (
    <p
      className={cn(
        // font-medium (not the plain default weight) + a solid `bg-surface-soft` (not the
        // translucent `--glass-tint`) for the same "guaranteed contrast against any backdrop"
        // reasoning as the panel's own background above.
        "max-w-[85%] rounded-2xl px-3 py-2 text-sm font-medium leading-snug",
        role === "user"
          ? "self-end rounded-br-sm bg-signal text-signal-ink"
          : "self-start rounded-bl-sm border border-[var(--glass-border)] bg-surface-soft text-text"
      )}
    >
      {renderFormattedText(children)}
    </p>
  );
}

/**
 * The chat bubble is plain text, not a markdown renderer — but the model is allowed to wrap
 * emphasis in `**double asterisks**`. Turn matched pairs into real <strong>, and strip any leftover
 * literal asterisks (a stray/unmatched `*` from the model, or a visitor typing one) so raw stars
 * never show up in the UI.
 */
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part.replaceAll("*", "")}</span>;
  });
}

function ChatGlyph({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
