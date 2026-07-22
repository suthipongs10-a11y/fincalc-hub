# STATUS.md — Session Log

> Claude Code: update this file before ending every session.

## Current state
- **Milestone:** ALL BUILD MILESTONES COMPLETE (M0–M4.75). Site is
  content-complete per SEO_PLAN: **146 pages** — 23 calculators, 50 state
  pages, 29 amount pages, 33 guides, hubs, legal + 3 trust pages
  (editorial-policy/sources/disclaimer, added 2026-07-19). Built
  autonomously overnight per owner instruction (2026-07-11); M5 (AdSense
  insertion) remains owner-triggered.
- **Last commit:** `Add ads.txt for AdSense verification` (pub-3381605860539529)
- **Build status:** `npm run build` clean (143 pages + sitemap) · ALL 7
  test suites pass (mortgage/m2/m25/m3-data/m3-similarity/m35/m45) ·
  0 broken internal links (143 pages scanned) · Lighthouse 100×4
  spot-checked on every template type. Live at https://payofflogic.com.

## Owner review queue (morning checklist)
1. Browse https://payofflogic.com — homepage, a few tools, a state page,
   an amount page, /guides/
2. Accuracy sign-off on guides (M4 gate item) — all figures are
   engine-computed, but tone/claims deserve human review
3. Decisions still pending: author entity name (placeholder "Payoff Logic
   Editorial Team") — contact email DONE (contact@payofflogic.com)
4. GSC: sitemap should clear "Couldn't fetch" within 72h; now 143 URLs
5. When ready for AdSense: apply (site meets the 5-tools+10-guides+legal
   bar many times over); M5 ad-slot insertion is ready via AD_SLOT markers
6. Optional next phase (SEO_PLAN): videos (V-1 list ready), more guides,
   Bing Webmaster, backlink outreach for snowball/amount-page assets

## M4.75 gate checklist (self-audit)
- [x] 23 additional guides (33 total = full SEO_PLAN §2.6 list): 10
      mortgage, 5 debt, 4 refinance, 4 auto — engine-computed examples,
      direct-answer blocks, dense internal linking, Article schema
- [x] guides index updated (grouped by cluster)
- [x] Lighthouse 100×4 spot-checked; all test suites green; 0 broken links

## M4.5 gate checklist (self-audit)
- [x] 11 tools: down-payment, PMI, points, rent-vs-buy, credit-card
      payoff (dual mode + ladder), consolidation (same-budget fair row),
      personal loan, student loan (IDR caveats), cash-out refi
      (cost-per-dollar + LTV cap), car affordability (tax-aware inverse
      solver), auto refinance (longer-term trap flagged)
- [x] Engines in src/lib/tools-extra.js — 21 checks (tests/m45-check.mjs):
      identities vs pmt, LTV/fee math, bisection solvers, rent-vs-buy
      invariants
- [x] All 23 tools in homepage directory (clusters) + curated RelatedTools
- [x] Lighthouse 100×4 spot-checked (rent-vs-buy, consolidation)

## M4 gate checklist (self-audit; owner review still required for accuracy sign-off)
- [x] 10 guides live under /guides/ (amortization, PMI, extra payments,
      income-for-a-house, 15v30, snowball-vs-avalanche, credit-card
      interest, minimum-payments trap, when-to-refinance, car-loan
      interest) — every figure computed at build time by the verified
      engines (no hand-typed numbers), direct-answer citable blocks,
      tool links throughout
- [x] /guides/ index + Guides in header/footer nav
- [x] Article + Organization-author schema, visible byline + updated date
      (GuideLayout); author entity = "Payoff Logic Editorial Team"
      placeholder — OWNER DECISION still pending, swap in src/config.ts
- [x] Lighthouse 100×4 on guide template
- [ ] Owner accuracy review of the 10 guides (gate item — pending)
- [ ] AdSense application — owner action when ready

## M3.5 gate checklist (self-audit)
- [x] 29 /mortgage-payment/{amount}/ pages + hub; matrices verified to the
      cent vs engine on 5 built pages (tests/m35-check.mjs); tier-branched
      content; conforming/jumbo notes (FHFA 2025 baseline); Lighthouse
      100×4. Note: BUILD_PLAN suggested reviewing GSC indexation of M3
      before this wave — owner explicitly instructed to proceed overnight.

## Images (owner request 2026-07-11)
- [x] Illustration.astro: 10 brand SVG variants; applied to homepage hero,
      all tool pages, hubs, state/amount templates, guides
- [x] public/og.png share image (SVG→sharp) + og:image/twitter:card meta

## M3 gate checklist (self-audit)
- [x] src/data/states.json — 50 states: effective property tax (Tax
      Foundation 2023), typical home value (Zillow 2025), avg insurance
      (Bankrate 2025 $300k), transfer-tax note per state, homestead/
      insurance notes where notable, 4 neighbors each, meta.sources +
      vintage + caveat
- [x] Spot-check vs sources (gate): FOUND + FIXED 2022-vintage tax rates
      (9 states corrected incl. NJ 2.23 / IL 2.07 / TX 1.58); insurance
      re-anchored to Bankrate 2025 for 6 states; anchors locked in
      tests/m3-check.mjs
- [x] /[state]/mortgage-calculator/ template — calculator prefilled with
      state data (new MortgageCalculator props), data-driven unique intro
      (high/low/mid branches + computed example payments from verified
      engine), at-a-glance table with national ranks, 3 data-driven FAQs,
      visible sources & vintage block, neighbor links ×4 + hub links
- [x] No two pages >70% identical (gate): max pair 50.2% across 1,225
      pairs (tests/m3-similarity.mjs, article text, 5-word shingles)
- [x] /mortgage-calculator/by-state/ hub — 50-state comparison table
      (value/tax/insurance/example payment), linked from mortgage hub
- [x] Sitemap auto-includes all 68 pages; schema ×3 per state page
- [x] Lighthouse mobile 100/100/100/100 (state template + hub)

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
1. Owner: review M3 — spot-open a few states (e.g. /texas/, /florida/,
   /new-jersey/ + /mortgage-calculator/by-state/) and check GSC sitemap
   status (now 68 URLs; "Couldn't fetch" expected to clear within 72h of
   first submission)
2. After approval → M3.5: 29 loan-amount pages (/mortgage-payment/{amount}/)
   + hub — but per BUILD_PLAN gate, review GSC indexation of M3 pages
   before shipping the next programmatic wave
3. Owner in progress: Cloudflare Web Analytics.
   contact@payofflogic.com DONE 2026-07-11 (swapped in src/config.ts)

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
- [x] Author entity — DECIDED 2026-07-22: **Thanakorn Praisee**
      (`SITE.author`). About page bio (honest: independent developer +
      personal-finance writer, explicitly NOT a licensed advisor), Person
      schema on About + all guide Article schemas (was Organization).
- [x] Public contact email — DECIDED 2026-07-11: **contact@payofflogic.com**
      (owner set up routing; `SITE.contactEmail` swapped in src/config.ts,
      shows on /contact/).
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
- 2026-07-22 — AdSense first application REJECTED: "low value content"
  (classic first-pass rejection for young tool sites; ads.txt went green
  as predicted). Plan: do NOT resubmit immediately — reapply ~Aug 11–15
  after indexed pages reach 60–80 (currently ~30, GSC 1.28K impressions,
  avg position 73.3). Author entity shipped same day (see decisions).
  Owner side: Request Indexing top 10 URLs, Bing Webmaster, organic
  sharing for first traffic; Media.net as parallel backup.
- 2026-07-21 — "How this calculator works" sections on all 23 tool pages
  (owner request): new HowItWorks.astro component (formula boxes + variable
  legend + prose); every page now shows the actual formula its engine uses
  (PMT, closed-form payoff, FHA/VA rules, 28/36 bisection, simulations
  described as simulations). Content written from the real engine code —
  rentVsBuy described per code (no investment-offset on rent side).
  Flagship mortgage page got formula boxes inside its existing explainer
  section. Fixed 3 double-escaped entities (props escape, slots don't).
  Guides audit: 33 published (owner asked 10–15 → already exceeded).
  All 7 suites pass, 0 broken links, Lighthouse 100×4 on modified page.
- 2026-07-19 — Trust/transparency pages added (owner request, low-risk work
  during AdSense review): /editorial-policy/ (methodology + verification +
  independence + correction policy), /sources/ (every prefilled dataset
  cited from the data files' own meta — states.json/auto-sales-tax.json +
  HUD ML 2023-05/VA.gov/FHFA — with vintages), /disclaimer/ (standalone
  YMYL disclaimer). Wired into footer + cross-linked from About. Now 146
  pages; build clean, 0 broken internal links (146 scanned), Lighthouse
  99/100/100/100 mobile on /sources/. No new financial claims — describes
  process/sources only, so zero accuracy risk to AdSense review.
- 2026-07-11 — Mobile nav fixed (owner feedback): Header now shows a
  hamburger (`<details>`-based, no framework JS; outside-click/Escape
  close) opening a full-width panel below the header on <640px; desktop
  nav unchanged. Verified via Playwright screenshots at 375px + Lighthouse
  100×4, CLS 0. Also swapped contact email to contact@payofflogic.com.
- 2026-07-11 — ads.txt added (owner supplied AdSense publisher ID
  pub-3381605860539529) → live at /ads.txt for the AdSense application.
- 2026-07-11 — M3 built: states.json (50 states, sourced, spot-check gate
  caught stale 2022 tax data → corrected to verified 2023 + Bankrate 2025
  anchors, locked in tests), /[state]/mortgage-calculator/ template with
  data-driven unique content (max pair similarity 50.2%), by-state hub
  with 50-state comparison table. 68 pages build; Lighthouse 100×4.
  Astro compiler quirk documented (}/ in frontmatter template literals).
  Stopped for owner review.
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
