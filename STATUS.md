# STATUS.md — Session Log

> Claude Code: update this file before ending every session.

## Current state
- **Milestone:** M2.5 complete — awaiting owner review before M3.
- **Last commit:** `M2.5: mortgage variant tools wave 1 (7 calculators)`
- **Build status:** `npm run build` clean (17 pages + sitemap) · all three
  test suites pass (mortgage / m2 / m25) · Lighthouse mobile 100×4 on all
  7 new pages. Live at https://payofflogic.com.

## M2.5 gate checklist (self-audit)
- [x] T2 /house-affordability-calculator/ — 28/36 rule, binding-constraint
      explanation, PITI breakdown at max price, 3-scenario comfort ladder
- [x] T3 /extra-payment-mortgage-calculator/ — monthly extra + one-time
      lump, before/after, chart, schedule
- [x] T4 /biweekly-mortgage-calculator/ — rate/26 accrual model, monthly vs
      biweekly comparison, honest DIY-alternative copy
- [x] T5 /15-year-mortgage-calculator/ — separate rates per term, lifetime
      table incl. 5-yr equity build, verdict line
- [x] T6 /fha-loan-calculator/ — UFMIP 1.75% financed + annual MIP with
      11-yr/life duration rule (HUD ML 2023-05), full PITI+MIP payment
- [x] T7 /va-loan-calculator/ — funding-fee table by down/usage, disability
      exemption, financed-vs-upfront toggle, no-PMI comparison
- [x] T8 /mortgage-payoff-calculator/ — existing-loan payoff w/ extra +
      lump sum, unpayable-payment guard
- [x] Shared engines verified: 34 checks (tests/m25-check.mjs) incl.
      Bankrate biweekly reference, HUD/VA fee tables, affordability
      closed-form identity — documented in tests/manual.md
- [x] Hub-and-spoke links: mortgage hub lists all 8 mortgage-cluster
      spokes; each spoke → hub + curated related; homepage directory
      grouped by cluster; footer kept to 5 core tools per SEO_PLAN §1.3
- [x] Schema ×3 per page, FAQ 7 questions/page, AD_SLOT ×2/page
- [x] Lighthouse mobile: 100/100/100/100 on all seven new pages
- [x] Bonus shipped early: XML sitemap + robots.txt (owner submitting to GSC)

## M2 gate checklist (self-audit)
- [x] /loan-payoff-calculator/ — extra payments → time saved + interest
      saved, before/after cards, 2-series chart, schedule, share/print
- [x] /debt-snowball-calculator/ — dynamic debt list, snowball vs avalanche
      side-by-side table + verdict + payoff order/dates (differentiator),
      timeline chart, URL-encoded debts for sharing
- [x] /refinance-calculator/ — break-even month, lifetime comparison table
      (incl. term-reset honesty), roll-costs-into-loan option, new-loan
      schedule
- [x] /auto-loan-calculator/ — trade-in + payoff-on-trade (negative-equity
      warning), sales tax by state dropdown (50 states + DC, sourced data
      in src/data/auto-sales-tax.json, editable rate), finance-vs-upfront
      tax toggle, loan-build breakdown table
- [x] Homepage = real tool directory (all 5 live); cross-links: footer,
      Related Calculators on every tool page, contextual in-copy links
- [x] Math verified per tool — 36 checks vs published references +
      closed-form identities (tests/m2-check.mjs, documented in
      tests/manual.md)
- [x] Schema per page (WebApplication/BreadcrumbList/FAQPage via shared
      src/lib/seo.ts) · FAQ 8 questions per page · AD_SLOT markers ×2/page
- [x] Lighthouse mobile all four new templates: 100/100/100/100
      (fixed: snowball CLS via server-rendered default rows; heading-order;
      empty-th)

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
1. Owner: review M2 + M2.5 (11 new tools total) on https://payofflogic.com
2. After approval → M3: 50 programmatic state pages + /src/data/states.json
   (real sourced data per state) + by-state hub
3. Owner in progress: GSC + sitemap (https://payofflogic.com/sitemap-index.xml),
   Cloudflare Web Analytics, contact@payofflogic.com (then swap
   SITE.contactEmail in src/config.ts)

## Pending decisions (owner)
- [x] Domain name — DECIDED & LIVE 2026-07-11: **payofflogic.com**
      (Cloudflare Registrar; Pages project lives in the same account as the
      zone — apex-domain requirement. Production branch temporarily set to
      claude/m0-milestone-398sab, see README §Deploying). Brand: Payoff
      Logic. Rebrand applied across src/, config, README, CLAUDE.md.
      Avoid: single-vertical names (mortgagemath.*) since site spans 4
      clusters; avoid .io for YMYL trust.
      After registering: update `site` in astro.config.mjs, SITE.url +
      SITE.name in src/config.ts, rerun build.
- [ ] Author entity name for About page (real name or pen name).
      Placeholder in use: "FinCalc Hub Editorial Team" (`SITE.author` in src/config.ts).
- [ ] Public contact email: currently the owner's Gmail is published on
      /contact/ (`SITE.contactEmail`). Domain now exists → recommended:
      set up contact@payofflogic.com (Cloudflare Email Routing, free,
      forwards to Gmail) and swap in src/config.ts.
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
- 2026-07-11 — M2.5 built: 7 mortgage variant tools (T2–T8) on new engines
  (loan.js amortizeBiweekly, gov-loans.js FHA/VA per HUD ML 2023-05 +
  VA.gov schedule, affordability.js bisection solver). 34 checks pass;
  Lighthouse 100×4 ×7 pages; hub-and-spoke linking wired; homepage grouped
  by cluster. Sitemap + robots.txt shipped early for GSC. Fixed FHA 3.5%
  floating-point validation bug. Stopped for owner review.
- 2026-07-11 — M2 built: 4 tools (loan-payoff, debt-snowball w/ avalanche
  comparison, refinance w/ break-even, auto-loan w/ 50-state tax data) on
  shared engines (src/lib/loan|snowball|refinance|auto.js) + shared UI kit
  (src/lib/ui.js, fc-* styles) + shared schema builder (src/lib/seo.ts).
  36 math checks pass; Lighthouse 100×4 on all four pages; homepage now a
  real directory. Stopped for owner review.
- 2026-07-11 — Domain payofflogic.com registered & live on Cloudflare Pages
  (new Pages project in the domain's account; production branch set to the
  working branch after initial deploy failed building empty `main`).
  Rebranded FinCalc Hub → Payoff Logic across src/, config, README,
  CLAUDE.md. Canonicals/JSON-LD now point at https://payofflogic.com.
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
