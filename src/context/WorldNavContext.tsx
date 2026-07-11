"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { worlds, type ProjectWorld } from "@/content/types";

type WorldNavValue = {
  world: ProjectWorld;
  setWorld: (world: ProjectWorld) => void;
  next: () => void;
  prev: () => void;
};

const WorldNavContext = createContext<WorldNavValue | null>(null);

function step(current: ProjectWorld, delta: 1 | -1): ProjectWorld {
  const count = worlds.length;
  const index = worlds.indexOf(current);
  return worlds[(index + delta + count) % count];
}

export function WorldNavProvider({ children }: { children: React.ReactNode }) {
  const [world, setWorld] = useState<ProjectWorld>("developers");

  const next = useCallback(() => setWorld((w) => step(w, 1)), []);
  const prev = useCallback(() => setWorld((w) => step(w, -1)), []);

  const value = useMemo(() => ({ world, setWorld, next, prev }), [world, next, prev]);

  return <WorldNavContext.Provider value={value}>{children}</WorldNavContext.Provider>;
}

/** Safe to call from components rendered outside the homepage (e.g. the header on other routes) — returns null there. */
export function useWorldNavOptional(): WorldNavValue | null {
  return useContext(WorldNavContext);
}

export function useWorldNav(): WorldNavValue {
  const ctx = useContext(WorldNavContext);
  if (!ctx) throw new Error("useWorldNav must be used within a WorldNavProvider");
  return ctx;
}
