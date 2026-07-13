"use client";

/**
 * The chat panel's top banner — deliberately loud (bright green, full-width, gently bouncing) so
 * it's the first thing a visitor notices on opening the chat, per direct request. Green is a fixed
 * exception to the site's `--signal` accent system here, same reasoning `--signal` itself already
 * gets: a "call" affordance reads as green everywhere, and this is a one-off deliberate choice, not
 * a new general-purpose token.
 */
export function VoiceCallButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="animate-cta-bounce flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-white shadow-[0_10px_30px_-8px_rgba(34,197,94,0.7)] transition-transform hover:scale-[1.02] active:scale-95"
    >
      <PhoneGlyph />
      {label}
    </button>
  );
}

function PhoneGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
