"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks a `MediaStream`'s rough loudness (0–1) in a ref updated via `requestAnimationFrame`, not
 * React state — the same ref-mutated, no-restate pattern this project already uses for per-frame
 * visuals (drum carousel, lamp-fade lines), since re-rendering React on every animation frame would
 * be wasteful for a value only ever read inside another rAF loop (`VoiceVisualizer`).
 */
export function useAudioLevel(stream: MediaStream | null | undefined) {
  const levelRef = useRef(0);

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    let raf: number;
    function tick() {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) sum += data[i];
      levelRef.current = sum / data.length / 255;
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      source.disconnect();
      analyser.disconnect();
      void audioContext.close();
    };
  }, [stream]);

  return levelRef;
}
