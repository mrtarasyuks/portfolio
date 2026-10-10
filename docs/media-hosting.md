# Media hosting (Cloudflare R2)

Case-study videos and posters live in a Cloudflare **R2** bucket, not in the Worker's static assets (Workers assets cap at 25 MB per file) and not in the repo.

- Bucket: `portfolio-media` (CORS `GET/HEAD` from any origin)
- Public base URL: `https://media.serhiitarasiuk.space` (R2 custom domain). Fallback `r2.dev` URL: `https://pub-f1190db53a6149d89c668f778854c200.r2.dev` (rate-limited, dev only)
- Site config: `NEXT_PUBLIC_MEDIA_BASE_URL` — **inlined at build time**, so it must be set (in `.env`) when running `npm run deploy`
- Key layout mirrors the old on-disk layout: `video-creator/<category>/<name>.mp4` + same-name `.jpg` poster. `src/lib/media.ts` `mediaUrl()` resolves `video-creator/...` paths against the base URL.

## Adding / replacing a video

1. Optimise it (H.264/AAC, `+faststart`), keep the original in `assets-source/video-creator-originals/`.
2. Put the optimised file + poster under `assets-source/video-creator-optimized/<category>/`.
3. Upload (from that folder; keys must start with `video-creator/`):
   ```
   npx wrangler r2 object put portfolio-media/video-creator/<category>/<name>.mp4 --file <name>.mp4 --content-type video/mp4 --cache-control "public, max-age=31536000, immutable" --remote
   ```
   (Windows: names containing `&` break `cmd.exe` — call `node node_modules/wrangler/bin/wrangler.js ...` directly.)
4. Reference it in `src/content/videos.ts`. No redeploy needed unless the entry list changed.

## History

Until 2026-10 videos were served by a Caddy container on a Hetzner server via Coolify/Traefik. That server was retired; the Windows installer download for YT Downloader was dropped with it.
