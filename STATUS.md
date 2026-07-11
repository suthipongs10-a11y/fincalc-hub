# STATUS.md — Session Log

> Claude Code: update this file before ending every session.

## Current state
- **Milestone:** M0 complete (reviewed ✅). SEO/keyword research done →
  SEO_PLAN.md added — awaiting owner review of the plan before M1.
- **Last commit:** `Plan: long-tail keyword map + SEO architecture (SEO_PLAN.md)`
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
1. Owner: review SEO_PLAN.md (keyword map ≈610 keywords, ≈145 pages, 4
   clusters, phasing proposal M2.5/M3.5/M4.5/M4.75)
2. After approval → start M1: /mortgage-calculator/ per BUILD_PLAN.md,
   using SEO_PLAN.md §1.4 on-page checklist + T1 keyword targets

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
- [ ] Approve SEO_PLAN.md phasing additions (M2.5 variant tools, M3.5
      loan-amount pages, M4.5/M4.75 remaining tools+guides) → if approved,
      fold into BUILD_PLAN.md.
- [ ] Schema policy change vs CLAUDE.md §4.5: Google removed FAQPage rich
      results entirely on 2026-05-07. Proposal: keep on-page FAQ content,
      make FAQPage markup optional, use WebApplication (verified correct
      type) + BreadcrumbList + Article/Person instead. Needs owner OK since
      CLAUDE.md mandates FAQPage JSON-LD.
- [ ] Author entity is now blocking for M4 (guides need a named author with
      credentials + Person schema per 2026 YMYL practice) — decide by M4.

## Session history
- 2026-07-11 — Project docs created (CLAUDE.md, BUILD_PLAN.md, STATUS.md).
  No code yet.
- 2026-07-11 — M0 built: Astro+Tailwind scaffold, design tokens, base layout,
  home shell + about/privacy/terms/contact, README deploy notes. Build clean,
  Lighthouse mobile home = 100 across all categories. Stopped for owner review.
- 2026-07-11 — M0 approved by owner. Deep keyword/architecture research run
  (multi-source, adversarial verification partially cut by usage limit) →
  SEO_PLAN.md: 4 clusters, ≈145-page / ≈610-keyword map, hub-and-spoke +
  internal-linking rules, 2026 schema corrections (FAQPage rich results dead
  since 2026-05-07; WebApplication verified as correct tool type). Stopped
  for owner review of the plan.

## Known issues / notes
- Lighthouse was run locally (headless Chromium, simulated throttling);
  re-verify on the live Cloudflare Pages URL after first deploy.
- Legal pages show "Last updated: July 11, 2026" — hardcoded strings; update
  when content materially changes.
