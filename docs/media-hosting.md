# Case-study video hosting

Self-hosted on the existing Hetzner server via Coolify — a small dedicated static-file service, not part of the Next.js app. Recommended over Cloudflare R2/Stream since the infrastructure already exists (same pattern as `promo-video-platform`), and over shipping videos in `public/` since that would bloat the Docker image and force a redeploy per new clip.

## 1. Create the Coolify app

1. In Coolify, create a **new resource → Docker Compose / Dockerfile** app (separate from the portfolio app).
2. Point it at a tiny repo (or a "raw Dockerfile" deployment if Coolify supports it) containing:

   `Dockerfile`
   ```dockerfile
   FROM caddy:2-alpine
   COPY Caddyfile /etc/caddy/Caddyfile
   ```

   `Caddyfile`
   ```
   media.serhiitarasiuk.space {
     root * /srv/media
     file_server
     header Access-Control-Allow-Origin "https://serhiitarasiuk.space"
   }
   ```
3. Mount a **persistent volume** at `/srv/media` in Coolify's storage settings — this is where video files live, independent of deploys.
4. Point DNS: add an `A`/`CNAME` record for `media.serhiitarasiuk.space` at your registrar, targeting the same Hetzner server Coolify already uses. Coolify/Caddy handles HTTPS automatically once the domain resolves.

## 2. Upload videos

Use Coolify's file manager on the volume, or `scp`/`rsync` directly to the mounted path on the server, e.g.:

```
rsync -avz ./foody-demo.mp4 user@your-server:/path/to/coolify/volume/foody-lab/
```

Keep a simple folder-per-project structure, e.g. `3d-lab/print-loop.mp4`, `foody/receipt-import.mp4` — this matches how `ProjectMedia.src` is referenced in content (relative paths only, never full URLs).

## 3. Wire it into the site

Set in the portfolio's deployment env (Coolify → the portfolio app → environment variables):

```
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.serhiitarasiuk.space
```

Then in `src/content/projects.ts`, add a video entry to a project's `media` array:

```ts
media: [
  { kind: "video", label: "Print loop, real time", src: "3d-lab/print-loop.mp4" },
],
```

`src/lib/media.ts`'s `mediaUrl()` resolves that relative path against `NEXT_PUBLIC_MEDIA_BASE_URL` automatically — no other code changes needed. The case-study page (`src/app/[locale]/work/[slug]/page.tsx`) already renders any `kind: "video"` media entries via `ProjectVideo`.

## Why this shape

- **Separate Coolify app** — video files don't belong in the Next.js Docker image; keeping them on their own service means adding a video never triggers a portfolio rebuild/redeploy.
- **Caddy over nginx** — automatic HTTPS with zero cert management, and correct HTTP range-request support out of the box (required for `<video>` scrubbing/seeking).
- **A subdomain, not a path on the main domain** — keeps the CORS story simple and means the media service can be redeployed/resized independently.
