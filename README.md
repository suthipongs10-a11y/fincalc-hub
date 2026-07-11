# Payoff Logic — payofflogic.com

Free US-market financial calculator site. Astro (static) + Tailwind CSS,
hosted on Cloudflare Pages. See `CLAUDE.md` for strategy, `BUILD_PLAN.md`
for milestones, and `STATUS.md` for current state.

## Local development

```sh
npm install
npm run dev       # dev server at localhost:4321
npm run build     # static build to ./dist
npm run preview   # serve the production build locally
```

## Deploying to Cloudflare Pages

The site is a fully static build — no functions, no bindings, no database.

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git** and select this GitHub repository.
2. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** set environment variable `NODE_VERSION=22`
3. **Production branch is currently `claude/m0-milestone-398sab`**
   (set in Settings → Builds & deployments) because milestone work is
   gated on owner review before merging to `main`. When a milestone is
   approved for public release, merge to `main` and switch the production
   branch back to `main`.
4. After the first deploy, enable **Cloudflare Web Analytics** for the Pages
   project (Dashboard → Analytics & Logs → Web Analytics) and add the
   auto-injected beacon — no code change or cookie banner required.
5. Custom domain: `payofflogic.com` (zone lives in the same Cloudflare
   account as the Pages project — required for apex domains). `site` in
   `astro.config.mjs` and `SITE.url` in `src/config.ts` already point at it.
