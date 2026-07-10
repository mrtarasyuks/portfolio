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
    fog: "#0b1615",
  },
};

export function getWorldTheme(world: ProjectWorld): WorldTheme {
  return worldThemes[world];
}
