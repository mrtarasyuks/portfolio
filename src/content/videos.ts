export type VideoCategory = "events" | "interview" | "promo" | "realisticCinematic" | "viralVideo";

export type VideoItem = {
  label: string;
  src: string;
  category: VideoCategory;
};

/**
 * The Video Creator world's portfolio reel — real client/personal-project clips, grouped by genre
 * rather than tied to a single "project" (there's no single case study these belong to). Labels are
 * hand-written, not derived mechanically from the filenames, since a few filenames had real typos
 * ("engeneer" → Engineer, "Horizont" → Horizon, "Pirat"/"triller" → Pirate/Thriller) — fixed here in
 * the display label only, the actual files on disk are untouched. `src` is a relative path resolved
 * via `mediaUrl()` against `NEXT_PUBLIC_MEDIA_BASE_URL` (falls back to /public locally).
 */
export const videos: VideoItem[] = [
  // Viral Video
  { label: "Funny Kids: Messi, Ronaldo, Mbappe", src: "video-creator/viral-video/Funny-Kids-Messi-Ronaldo-Mbappe.mp4", category: "viralVideo" },
  { label: "Funny: Messi & Ronaldo — Big Builders", src: "video-creator/viral-video/Funny-Messi&Ronaldo-Big-Builders.mp4", category: "viralVideo" },
  { label: "Mbappe & Neymar — Story 03", src: "video-creator/viral-video/Mbappe&Neymar-story03.mov", category: "viralVideo" },
  { label: "Messi & Ronaldo — Crazy Frog", src: "video-creator/viral-video/Messi&Ronaldo-Crazy-Frog.mp4", category: "viralVideo" },
  { label: "Messi & Ronaldo — Gladiators, Story 06", src: "video-creator/viral-video/Messi&Ronaldo-gladiators-story06.mp4", category: "viralVideo" },
  { label: "Messi & Ronaldo — Matrix Scene", src: "video-creator/viral-video/Messi&Ronaldo-matrix-scene.mp4", category: "viralVideo" },
  { label: "Messi & Ronaldo — Story 01", src: "video-creator/viral-video/Messi&Ronaldo-story01.mp4", category: "viralVideo" },
  { label: "Messi & Ronaldo — Story 02", src: "video-creator/viral-video/Messi&Ronaldo-story02.mp4", category: "viralVideo" },
  {
    label: "Messi & Ronaldo vs Mbappe & Neymar — Story 04",
    src: "video-creator/viral-video/Messi&Ronaldo-vs-Mbappe&Neymar-story04.mp4",
    category: "viralVideo",
  },
  { label: "Ronaldo Arrest: Messi Superman", src: "video-creator/viral-video/Ronaldo-Arrest-Messi-Superman.mp4", category: "viralVideo" },
  { label: "Ronaldo Pirate — Thriller, Where's Messi", src: "video-creator/viral-video/RonaldoPirat-triller-where-Messi.mp4", category: "viralVideo" },
  { label: "Scared Prank: Ronaldo", src: "video-creator/viral-video/Scared-Prank-Ronaldo.mp4", category: "viralVideo" },
  {
    label: "Kids: Messi & Ronaldo vs Mbappe & Neymar — Story 05",
    src: "video-creator/viral-video/child-Messi&Ronaldo-vs-Mbappe&Neymar-story05.mp4",
    category: "viralVideo",
  },
  { label: "Football Legends: Last Dance", src: "video-creator/viral-video/football_legends_last_dance.mp4", category: "viralVideo" },
  { label: "Promo: Lego Figure", src: "video-creator/viral-video/like_promo_Lego-figure.mp4", category: "viralVideo" },
  { label: "Prank: Messi vs Ronaldo", src: "video-creator/viral-video/prank-MessivsRonaldo.mp4", category: "viralVideo" },

  // Promo
  { label: "AI Assistant", src: "video-creator/promo/AI_Assistant.mp4", category: "promo" },
  { label: "Digital Horizon", src: "video-creator/promo/Digital-Horizont.mp4", category: "promo" },
  { label: "Faja — Video 01", src: "video-creator/promo/Faja-Video01.mp4", category: "promo" },
  { label: "Faja — Video 02", src: "video-creator/promo/Faja-Video02.mp4", category: "promo" },
  { label: "Faja — Video 03", src: "video-creator/promo/Faja-Video03.mp4", category: "promo" },
  { label: "Faja — Video 04", src: "video-creator/promo/Faja-Video04.mp4", category: "promo" },
  { label: "Faja — Video 05", src: "video-creator/promo/Faja-Video05.mp4", category: "promo" },
  { label: "Ford — Modern Lights", src: "video-creator/promo/Ford_modern-lights.mp4", category: "promo" },
  { label: "Lamp 3D Print", src: "video-creator/promo/Lamp-3Dprint.mp4", category: "promo" },
  { label: "Nyma Assistant", src: "video-creator/promo/NymaAssistant.mp4", category: "promo" },
  { label: "VPN", src: "video-creator/promo/VPN.mp4", category: "promo" },
  { label: "Korean Cosmetics", src: "video-creator/promo/korean_cosmetics.mp4", category: "promo" },

  // Events
  { label: "Buildathon", src: "video-creator/events/Buildathon.mp4", category: "events" },
  { label: "GYM — April Rewards", src: "video-creator/events/GYM-April-Rewards.mp4", category: "events" },
  { label: "GYM — Mystery Shopping", src: "video-creator/events/GYM-mystery-shopping.mp4", category: "events" },
  { label: "Cricket & Pickball", src: "video-creator/events/cricket_and_pickball.mp4", category: "events" },

  // Interview
  { label: "Mario — Canada Engineer", src: "video-creator/interview/Mario-canada-engeneer.mp4", category: "interview" },
  { label: "Spotlight: Students", src: "video-creator/interview/Spotlight-Students.mp4", category: "interview" },

  // Realistic Cinematic
  { label: "Elvis & Ann", src: "video-creator/realistic-cinematic/elvis_and_ann.mp4", category: "realisticCinematic" },
];
