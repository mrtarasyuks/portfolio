"use client";

import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";
import type { CopyDict } from "@/content/copy";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Fullscreen custom video player — opened as a modal over the whole viewport when a video card is
 * clicked. Native `<video controls>` looks different per-browser and isn't stylable, so this rolls
 * its own play/pause, seek, volume, and fullscreen controls instead. Volume/mute are driven by
 * directly mutating the `<video>` element via a ref rather than "controlled" React props — `<video>`
 * doesn't reliably reflect `volume`/`muted` as controlled attributes the way form inputs do, and
 * this matches the project's established pattern of imperative ref mutation for continuous values.
 */
export function VideoLightbox({ src, label, onClose, t }: { src: string; label?: string; onClose: () => void; t: CopyDict }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        const v = videoRef.current;
        if (v) {
          if (v.paused) v.play();
          else v.pause();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [onClose]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function handleVolumeChange(value: number) {
    const v = videoRef.current;
    if (!v) return;
    v.volume = value;
    v.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
  }

  function handleSeek(value: number) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setCurrent(value);
  }

  function handleFullscreen() {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else v.requestFullscreen?.().catch(() => {});
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t.videoPlayer.close}
        className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
      >
        <CloseGlyph />
      </button>

      <div className="relative flex max-h-[90vh] max-w-[94vw] flex-col items-center gap-3">
        {label && <p className="font-mono text-xs uppercase tracking-wide text-white/60">{label}</p>}

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <video
            ref={videoRef}
            src={mediaUrl(src)}
            autoPlay
            playsInline
            className="max-h-[78vh] max-w-[94vw] rounded-xl bg-black shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
            onClick={togglePlay}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 rounded-b-xl bg-gradient-to-t from-black/85 to-transparent px-4 pb-3 pt-10">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="Seek"
              className="h-1 w-full cursor-pointer accent-white"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? t.videoPlayer.pause : t.videoPlayer.play}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-transform hover:scale-105 active:scale-95"
              >
                {playing ? <PauseGlyph /> : <PlayGlyph />}
              </button>
              <span className="font-mono text-[11px] tabular-nums text-white/70">
                {formatTime(current)} / {formatTime(duration)}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? t.videoPlayer.unmute : t.videoPlayer.mute}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:text-white"
                >
                  {muted || volume === 0 ? <MutedGlyph /> : <VolumeGlyph />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  aria-label={t.videoPlayer.volume}
                  className="h-1 w-20 cursor-pointer accent-white"
                />
                <button
                  type="button"
                  onClick={handleFullscreen}
                  aria-label={t.videoPlayer.fullscreen}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:text-white"
                >
                  <FullscreenGlyph />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 4.5v15l14-7.5-14-7.5z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  );
}

function VolumeGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M17.5 8.5a5 5 0 0 1 0 7" />
      <path d="M20 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

function MutedGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M17 9l5 6M22 9l-5 6" />
    </svg>
  );
}

function FullscreenGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
