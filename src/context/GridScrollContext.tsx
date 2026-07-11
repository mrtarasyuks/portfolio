"use client";

import { createContext, useContext, useMemo, useState } from "react";

type GridScrollValue = {
  on: boolean;
  speed: number;
  toggle: () => void;
  setSpeed: (value: number) => void;
};

const GridScrollContext = createContext<GridScrollValue | null>(null);

/** Replaces the old spotlight beam: toggling this scrolls the floor grid under the avatar's platform (Tron-style), the slider sets scroll speed instead of brightness. */
export function GridScrollProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const [speed, setSpeed] = useState(0.6);

  const value = useMemo(
    () => ({ on, speed, toggle: () => setOn((v) => !v), setSpeed }),
    [on, speed]
  );

  return <GridScrollContext.Provider value={value}>{children}</GridScrollContext.Provider>;
}

export function useGridScroll(): GridScrollValue {
  const ctx = useContext(GridScrollContext);
  if (!ctx) throw new Error("useGridScroll must be used within a GridScrollProvider");
  return ctx;
}
