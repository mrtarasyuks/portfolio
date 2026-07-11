export type ToolLogo = {
  name: string;
  src: string;
};

/** Every file already dropped in public/img/logos/ — transparent PNG/WebP, split into two rows for
 * the homepage marquee (one scrolling left→right, one right→left). */
export const toolLogosRowA: ToolLogo[] = [
  { name: "Claude", src: "/img/logos/claude-logo.png" },
  { name: "ChatGPT", src: "/img/logos/chatgpt-logo.png" },
  { name: "Gemini", src: "/img/logos/Gemini_model_logo.png" },
  { name: "ElevenLabs", src: "/img/logos/eleven-labs-logo.png" },
  { name: "Figma", src: "/img/logos/figma-logo.png" },
  { name: "Blender", src: "/img/logos/Logo_Blender.svg.webp" },
];

export const toolLogosRowB: ToolLogo[] = [
  { name: "CapCut", src: "/img/logos/Capcut-Logo.png" },
  { name: "Premiere Pro", src: "/img/logos/premier-pro-logo.png" },
  { name: "Photoshop", src: "/img/logos/photoshop-logo.png" },
  { name: "Canva", src: "/img/logos/canva-logo.png" },
  { name: "Google Workspace", src: "/img/logos/google-workspace-logo.png" },
];
