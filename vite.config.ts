import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Tailwind via its Vite plugin; empty inline postcss config stops Vite from also loading
  // postcss.config.mjs (that file is for `next dev`/`next build` only).
  css: { postcss: {} },
  plugins: [
    tailwindcss(),
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
