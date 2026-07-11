import type { LocalizedString } from "./types";

export type FigurineStats = {
  filamentGrams: number;
  printHours: number;
  material: string;
  printer: string;
  scale?: string;
};

export type Figurine = {
  slug: string;
  name: LocalizedString;
  /** A short, seamless 360° turntable loop — muted/looping, same hosting pipeline as the Video
   * Creator reel (resolved via `mediaUrl()`). */
  loopSrc: string;
  stats: FigurineStats;
  note?: LocalizedString;
};

/** Ships empty — do not fabricate placeholder entries. The 3D print gallery stays hidden until
 * real figurines land here (see `FigurineGallery.tsx`). */
export const figurines: Figurine[] = [];
