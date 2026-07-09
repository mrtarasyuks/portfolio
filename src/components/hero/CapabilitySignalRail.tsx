"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type RailNode = { id: string; label: string; proof: string };

export function CapabilitySignalRail({ nodes, label }: { nodes: RailNode[]; label: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reducedMotion.current || paused) return;
    const id = setInterval(() => {
      setActive((v) => (v + 1) % nodes.length);
    }, 2800);
    return () => clearInterval(id);
  }, [paused, nodes.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-wide text-text-dim">{label}</p>
      <ol className="relative flex flex-col gap-0 border-l border-line pl-6">
        {nodes.map((node, i) => {
          const isActive = i === active;
          return (
            <li key={node.id} className="relative py-3">
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[27px] top-[18px] h-2 w-2 -translate-y-1/2 rounded-full transition-colors duration-500",
                  isActive ? "bg-signal" : "bg-line-strong"
                )}
              />
              <button
                type="button"
                onClick={() => setActive(i)}
                className="flex w-full flex-col items-start gap-1 text-left"
              >
                <span
                  className={cn(
                    "font-mono text-sm tracking-wide transition-colors duration-300",
                    isActive ? "text-signal" : "text-text-muted"
                  )}
                >
                  {node.label}
                </span>
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.span
                      key={node.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="font-mono text-xs text-text-dim"
                    >
                      {node.proof}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
