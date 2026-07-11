# STATUS.md — Session Log

> Claude Code: update this file before ending every session.

## Current state
- **Milestone:** M0 complete — awaiting owner review before starting M1
- **Last commit:** `M0: scaffold Astro + Tailwind, base layout, legal pages`
- **Build status:** `npm run build` clean (5 pages). Lighthouse (mobile, home):
  Performance 100 / Accessibility 100 / Best Practices 100 / SEO 100.

## M0 gate checklist (self-audit)
- [x] `npm run build` clean — 5 static pages generated
- [x] Lighthouse ≥95 mobile on home — 100/100/100/100 (headless Chromium,
      simulated mobile throttling)
- [x] All legal pages exist with real EN content: /about/ /privacy/ /terms/ /contact/
- [x] Base layout (header/footer/nav) + design tokens (deep navy + emerald
      accent, system font stack — zero webfonts/JS on M0 pages)
- [x] Cloudflare Pages deploy instructions in README.md
- [x] STATUS.md updated

## Implementation notes (M0)
- Astro 5.18 (static, `trailingSlash: 'always'`) + Tailwind 4.3 via `@tailwindcss/vite`
- Design tokens live in `src/styles/global.css` (`@theme`: navy scale + accent scale)
- Site-wide constants in `src/config.ts` (SITE name/url/email/author + TOOLS
  list driving homepage directory & footer) — single place to swap when
  domain/author decided
- `BaseLayout.astro` handles: unique title/meta, canonical, OG tags, WebSite
  JSON-LD + per-page `schema` prop for FAQPage/SoftwareApplication later
- YMYL disclaimer in footer of every page; expanded disclaimers in /terms/
- Homepage has `<!-- AD_SLOT -->` marker below tool directory
- Privacy policy already covers Cloudflare Web Analytics + future AdSense
  cookies (so no rewrite needed at ad launch)

## Next actions
1. Owner: review M0 (design direction, legal copy, placeholder decisions below)
2. After approval → start M1: /mortgage-calculator/ per BUILD_PLAN.md

## Pending decisions (owner)
- [ ] Domain name — candidates to check availability:
      calcpiti.com / mortgagemath.io / payoffcalc.com / (owner's ideas)
      Working name "FinCalc Hub" until decided. Placeholder URL
      `https://fincalc-hub.pages.dev` used in `astro.config.mjs` + `src/config.ts`.
- [ ] Author entity name for About page (real name or pen name).
      Placeholder in use: "FinCalc Hub Editorial Team" (`SITE.author` in src/config.ts).
- [ ] Public contact email: currently the owner's Gmail is published on
      /contact/ (`SITE.contactEmail`). Conservative alternative once domain
      exists: a domain address (e.g. contact@<domain>). Swap in src/config.ts.

## Session history
- 2026-07-11 — Project docs created (CLAUDE.md, BUILD_PLAN.md, STATUS.md).
  No code yet.
- 2026-07-11 — M0 built: Astro+Tailwind scaffold, design tokens, base layout,
  home shell + about/privacy/terms/contact, README deploy notes. Build clean,
  Lighthouse mobile home = 100 across all categories. Stopped for owner review.

## Known issues / notes
- Lighthouse was run locally (headless Chromium, simulated throttling);
  re-verify on the live Cloudflare Pages URL after first deploy.
- Legal pages show "Last updated: July 11, 2026" — hardcoded strings; update
  when content materially changes.
