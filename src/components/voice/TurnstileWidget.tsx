"use client";

import { useEffect, useId } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/** Renders Cloudflare's own widget via its vanilla script (no `react-turnstile` dependency — one
 * integration point doesn't justify a new package, same reasoning the text chat used to skip the
 * Anthropic SDK). `onToken` fires once the visitor passes the challenge. */
export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const elementId = `turnstile-${rawId}`;

  useEffect(() => {
    let widgetId: string | undefined;
    let poll: number | undefined;

    function render() {
      if (!window.turnstile) return;
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (!siteKey) return;
      widgetId = window.turnstile.render(`#${elementId}`, {
        sitekey: siteKey,
        callback: onToken,
      });
    }

    if (window.turnstile) {
      render();
    } else {
      poll = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(poll);
          render();
        }
      }, 100);
    }

    return () => {
      if (poll) window.clearInterval(poll);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [elementId, onToken]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div id={elementId} />
    </>
  );
}
