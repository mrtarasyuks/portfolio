import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  webServer: {
    // `filter` skips public/video-creator when copying — the local-only, gitignored 3.5GB+
    // portfolio video reel (see .gitignore) that tests never need to actually load, and copying
    // it here was slow enough to blow past the webServer startup timeout.
    command:
      "npm run build && node -e \"const fs=require('fs');fs.cpSync('public','.next/standalone/public',{recursive:true,filter:(s)=>!s.includes('video-creator')});fs.cpSync('.next/static','.next/standalone/.next/static',{recursive:true})\" && node .next/standalone/server.js",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { PORT: "3100" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
