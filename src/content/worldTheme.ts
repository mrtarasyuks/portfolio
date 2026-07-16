import type { ProjectWorld } from "./types";

export type WorldTheme = {
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceSoft: string;
  text: string;
  textMuted: string;
  textDim: string;
  signal: string;
  signalSoft: string;
  signalInk: string;
  /** var() reference to this world's light-theme-safe text accent (globals.css) — use for literal
   * foreground TEXT color instead of `signal` (which stays a fixed, theme-invariant hex tuned for
   * glow/border/background washes, not plain text on a light-theme near-white surface). */
  signalTextVar: string;
  fog: string;
};

export const worldThemes: Record<ProjectWorld, WorldTheme> = {
  developers: {
    bg: "#0a0a0b",
    bgElevated: "#111113",
    surface: "#151518",
    surfaceSoft: "#1b1b1f",
    text: "#f5f3ed",
    textMuted: "#a6a5a1",
    textDim: "#737373",
    signal: "#ffd21f",
    signalSoft: "#e9c524",
    signalInk: "#151300",
    signalTextVar: "var(--developers-signal-text)",
    fog: "#0a0a0b",
  },
  "3d": {
    bg: "#15110c",
    bgElevated: "#1c1611",
    surface: "#201911",
    surfaceSoft: "#291f15",
    text: "#f4ece0",
    textMuted: "#ab9c89",
    textDim: "#7d6f5e",
    signal: "#ff6a2c",
    signalSoft: "#e6591e",
    signalInk: "#200d02",
    signalTextVar: "var(--world-3d-signal-text)",
    fog: "#1c1611",
  },
  video: {
    bg: "#07100f",
    bgElevated: "#0b1615",
    surface: "#0d1c1a",
    surfaceSoft: "#123230",
    text: "#eef4f1",
    textMuted: "#93a8a3",
    textDim: "#64756f",
    signal: "#2de0c2",
    signalSoft: "#24bfa6",
    signalInk: "#03150f",
    signalTextVar: "var(--video-signal-text)",
    fog: "#0b1615",
  },
};

export function getWorldTheme(world: ProjectWorld): WorldTheme {
  return worldThemes[world];
}

/** Accent colors for the two /work-page-only extra blocks (Games, AI Creator) — these aren't
 * `ProjectWorld` entries (no 3D backdrop/camera station/avatar rotation math), just static routes,
 * so they don't need a full `WorldTheme`, just a signal-style accent hex for the shared glass-block
 * visual language (`ExtraWorkBlockLink`, `WorldTitleCube`). */
export const extraWorkAccents = {
  games: "#8b5cf6",
  aiCreator: "#f472b6",
  tools: "#22d3ee",
} as const;
