# STATUS.md — Session Log

> Claude Code: update this file before ending every session.

## Current state
- **Milestone:** M1 complete — awaiting owner review before M2.
- **Last commit:** `M1: mortgage calculator (flagship) — PITI, amortization,
  extra payments, share/print`
- **Build status:** `npm run build` clean (6 pages) · `npm test` all math
  checks pass · Lighthouse mobile /mortgage-calculator/: 100/100/100/100.

## M1 gate checklist (self-audit)
- [x] PITI breakdown incl. PMI (auto-applies <20% down, auto-cancels at 78%
      LTV) + HOA, with stacked-bar + line-item breakdown
- [x] Down-payment %/$ toggle (converts both directions, live hint)
- [x] Full amortization schedule — yearly rows expandable to monthly,
      expand/collapse all
- [x] Payoff chart (pure SVG, no chart lib) with with/without-extra overlay
- [x] Extra-payment support + interest/time-saved banner
- [x] Shareable URL state (query params, replaceState) + copy button
- [x] Print-friendly (print styles; schedule auto-expands on print)
- [x] 9-question FAQ + WebApplication/BreadcrumbList/FAQPage JSON-LD
      (parse-validated in built HTML) — per approved schema policy
- [x] 2 AD_SLOT markers (above-fold right, below results)
- [x] Math verified vs published references: `tests/mortgage-check.mjs`
      (Case A/B/C + PMI threshold + extra-payment closed-form) — see
      tests/manual.md
- [x] Lighthouse mobile 100 across all categories
- [x] Homepage/footer now link the live tool (config-driven status: 'live')

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
1. Owner: review M1 (/mortgage-calculator/) — math, UX, copy
2. After approval → M2: loan-payoff, debt-snowball, refinance, auto-loan
   (T13/T14/T19/T21 keyword targets in SEO_PLAN.md) + homepage as directory
3. Owner action anytime: deploy to Cloudflare Pages (README steps) so GSC
   can start collecting data early — recommended before M2 finishes

## Pending decisions (owner)
- [ ] Domain name — DECIDE BEFORE M2 (recommended 2026-07-11).
      ⚠ Finding: fincalchub.com is TAKEN by an active financial-calculator
      site (brand collision — working name must change at rebrand).
      Registry lookups (RDAP/DoH) are blocked from this environment; owner
      must verify availability at the registrar (Cloudflare Registrar
      recommended — at-cost pricing, integrates with Pages).
      Shortlist (Claude's order): 1) payoffmath.com 2) truemonthly.com
      3) payoffcalc.com (likely parked/premium) 4) calcpiti.com (owner's;
      mortgage-jargon, boxes out debt/auto clusters — not recommended)
      Avoid: single-vertical names (mortgagemath.*) since site spans 4
      clusters; avoid .io for YMYL trust.
      After registering: update `site` in astro.config.mjs, SITE.url +
      SITE.name in src/config.ts, rerun build.
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
- 2026-07-11 — Owner approved SEO_PLAN (phasing + schema policy). Folded
  into BUILD_PLAN.md (M2.5/M3.5/M4.5/M4.75) and CLAUDE.md §4.5. Built M1:
  flagship /mortgage-calculator/ — engine in src/lib/mortgage.js (plain JS,
  Node-verifiable), vanilla-TS island UI, SVG chart, URL-state sharing,
  print support, 1,900+ words supporting content, FAQ×9, schema per new
  policy. All math checks pass (`npm test`); Lighthouse 100×4. Fixed: $
  prefix overlapping input text (scoped-style specificity), dt/dd a11y.
  Stopped for owner review.
- 2026-07-11 — Competitor/opportunity analysis (COMPETITOR_ANALYSIS.md):
  live SERP sampling shows variant-calculator keywords have page-1 slots
  held by white-label bank widgets → HIGH opportunity tier confirmed.
  Video strategy added to SEO_PLAN.md §5: facade embeds only (Lighthouse),
  below-tool placement, transcripts, VideoObject schema, no video rich
  results expected (watch-page rule), 12 videos in wave V-1 with M4.
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
