# SEO_PLAN.md — Long-Tail Keyword Map & Site Architecture (2026)

> Research-backed plan for on-page SEO, long-tail keyword coverage, and
> internal linking. Companion to BUILD_PLAN.md — this file says WHAT pages
> and keywords; BUILD_PLAN.md says WHEN. Sources at the bottom; claims that
> could not be independently re-verified are marked (unverified).
> Researched 2026-07-11 via multi-source web research.

---

## 0. Executive summary — the numbers

| Item | Count |
|---|---|
| Topic clusters (categories) | **4** — Mortgage, Debt Payoff, Refinance, Auto |
| Calculator (tool) pages at full build-out | **23** (5 already planned + 18 variant tools) |
| Programmatic pages | **81** — 50 state + 1 state hub + 29 loan-amount + 1 amount hub |
| Guide pages (question long-tails) | **33** (10 in M4, +23 in a later wave) |
| Hub/index pages | **3** (home already exists; /guides/, by-state hub, amount hub) |
| Core/legal pages (done in M0) | 5 |
| **Total pages at full build-out** | **≈ 145** |
| Primary keywords (1 per page) | ≈ 140 |
| Secondary + PAA question keywords mapped | ≈ 470 |
| **Total keyword universe targeted** | **≈ 610** |

Strategic core, from the research:

1. **Interactive calculators are the most AI-Overview-resistant content class**
   — interactive tools show the lowest AI Overview disruption (reported <3%)
   because an AI summary can't run your numbers [S6] (unverified single
   source, but directionally corroborated by [S7], [S8]).
   Informational question queries are the most exposed: organic CTR on
   AIO queries fell ~61% (1.76% → 0.61%, Seer Interactive, Sep 2025) and
   even non-AIO queries fell ~41% [S8] (unverified — page 403-blocked,
   figures recovered via press coverage).
   → **Calculator-intent keywords are the backbone; question keywords are
   the supporting layer, written to be *cited* by AI Overviews** (cited
   pages earn 2–5× the CTR of non-cited ones [S8], unverified).
2. **Head terms are out of reach; modifier long-tails are not.** "mortgage
   calculator" is locked by Bankrate/NerdWallet/Zillow, but variant terms
   (FHA/VA/biweekly/extra-payments/15-year, state-level) are reported
   rankable for newer sites in ~6–12 months [S4] (unverified). Empirically,
   low-authority sites ranked page-1 for the majority of tracked keywords
   when keyword difficulty was chosen well [S9] (unverified). Target KD < 30.
3. **One flagship anchors the cluster.** Bankrate's single mortgage
   calculator page drives ~26% of its /mortgages/ subfolder traffic;
   NerdWallet's top calculator drives ~34% of its /calculators/ subfolder
   [S2] (unverified). Hub-and-spoke around /mortgage-calculator/ is the
   correct shape — which is already our M1 plan.
4. **Competitors validate one-URL-per-variant.** MortgageCalculator.org
   ships separate ranking pages for extra-payment, biweekly, and
   "what if I pay more" calculators [S5]. SmartAsset's per-state mortgage
   pages wrap real state tax/insurance data around the same calculator [S3].
5. **Schema correction (verified 3-0):** Google supports **WebApplication**
   for browser tools — that's our correct type, not bare SoftwareApplication
   [S1 — Google Search Central, verified]. **FAQPage rich results were
   removed from Google Search entirely on May 7, 2026** [S10]; FAQ *content*
   stays (users + AI citability), FAQPage *markup* is optional and earns no
   Google SERP feature. This supersedes CLAUDE.md §4.5 — flagged in
   STATUS.md for owner sign-off. Software-app rich results also require
   `aggregateRating`/`review` which we legitimately don't have — so we add
   valid WebApplication markup for entity clarity, without expecting a rich
   result [S1] (partially verified).

---

## 1. Site architecture (2026-correct)

### 1.1 URL structure

Flat, kebab-case, one folder level max, trailing slash (already configured).

```
/                                      home = site-wide directory
/mortgage-calculator/                  CLUSTER HUB (flagship tool = hub page)
/{variant}-calculator/                 variant tools, root level, exact-match slug
/mortgage-calculator/by-state/         programmatic index (state hub)
/{state}/mortgage-calculator/          50 state pages (per BUILD_PLAN M3)
/mortgage-payment/                     programmatic index (amount hub)
/mortgage-payment/{amount}/            29 loan-amount pages, e.g. /mortgage-payment/300000/
/guides/                               guides index
/guides/{slug}/                        question long-tail articles
```

Rationale: root-level exact-match slugs for tools (competitor-proven),
subfolders only where a set is genuinely hierarchical (states, amounts,
guides). Clean subfolder structure + breadcrumbs is itself a topical
signal [S11].

### 1.2 Hub-and-spoke topology (4 clusters)

Each cluster = 1 hub (the flagship calculator page, which carries the most
authority) + spokes (variant tools, programmatic pages, guides). Modeled on
Bankrate's documented pillar structure [S2] (unverified).

```
MORTGAGE cluster        hub: /mortgage-calculator/
 ├─ variant tools:      affordability, extra-payments, biweekly, 15-year,
 │                      FHA, VA, payoff, down-payment, PMI, points, rent-vs-buy
 ├─ programmatic:       50 state pages, 29 amount pages (+2 index hubs)
 └─ guides:             ~15 question articles

DEBT PAYOFF cluster     hub: /debt-snowball-calculator/ (differentiator tool)
 ├─ variant tools:      loan-payoff, credit-card-payoff, debt-consolidation,
 │                      personal-loan, student-loan-payoff
 └─ guides:             ~8 question articles

REFINANCE cluster       hub: /refinance-calculator/
 ├─ variant tools:      cash-out-refinance
 └─ guides:             ~5 question articles

AUTO cluster            hub: /auto-loan-calculator/
 ├─ variant tools:      car-affordability, auto-refinance
 └─ guides:             ~5 question articles
```

### 1.3 Internal linking rules (mechanical, enforced by templates)

Every rule below is implementable in Astro from `src/config.ts` data — no
hand-maintained links, no orphan pages.

1. **Spoke → hub:** every page in a cluster links to its hub in body copy,
   descriptive keyword anchor ("full mortgage calculator with taxes and
   PMI"), not "click here". Clusters linking back to the pillar with its
   target keyword is the standard topic-cluster convention [S11].
2. **Hub → every spoke:** hub pages carry a "Related calculators" +
   "Guides" section listing all cluster children. Nothing is >1 click from
   its hub, nothing >3 clicks from home [S12].
3. **Tool → 3 related tools** (cross-cluster allowed, defined in config):
   e.g. mortgage → affordability, refinance, loan-payoff.
4. **Guide → its tool (embedded) + 2 sibling guides.** Every guide embeds
   the relevant calculator island near the top — the guide answers the
   question, the tool personalizes the answer (AIO-resilience pattern [S6]).
5. **State page → by-state hub + 4 neighboring states + flagship.**
   Amount page → adjacent amounts (±$25k) + flagship + affordability tool.
6. **Breadcrumbs on every page** (+ BreadcrumbList schema): Home › Cluster
   hub › Page.
7. **Footer:** the 5 core tools + legal only (footer stays small; deep
   pages get equity through contextual links, not sitewide boilerplate).
8. **Anchor discipline:** vary anchors naturally; never the identical
   exact-match string sitewide.

### 1.4 Per-page on-page checklist (template-enforced)

- Unique `<title>` ≤60 chars, keyword-leading; unique meta description
  ≤155 chars with the primary keyword + a click reason ("free, no signup").
- One `<h1>` = primary keyword phrasing. H2s = secondary/PAA questions,
  phrased as the actual question (AIO/PAA citability).
- Under each question-H2: a 40–60-word direct answer paragraph first,
  then depth (the "citable block" pattern [S8]).
- 1,500–3,000 words of genuinely useful supporting content on tool pages —
  competitor calculator pages that rank carry this weight [S4] (unverified);
  programmatic pages need ≥400 words of non-generic, data-driven copy [S13].
- Schema: `WebApplication` (tools) [S1, verified], `Article` + `Person`
  author (guides), `BreadcrumbList` (all). FAQ content on-page; FAQPage
  markup optional post-deprecation [S10].
- Visible: author/reviewer line, last-updated date, data sources, YMYL
  disclaimer (already sitewide), cited state data (CLAUDE.md rule).
- E-E-A-T entity: named author with credentials bio on /about/, `Person`
  schema with `sameAs` to at least 1–2 external profiles [S14] (unverified;
  conservative and cheap regardless). **Owner decision on author name is
  now blocking for M4 — flagged in STATUS.md.**

---

## 2. Keyword map — full enumeration

Legend: **P** = primary keyword (gets its own page). Indented items =
secondary keywords + PAA questions the same page targets in H2s/FAQ.
No reliable public volume/KD numbers were available in this research pass —
before building each wave, spot-check difficulty manually (SERP scan: if
the page-1 results are all DR80+ brands with dedicated pages, skip/defer).

### 2.1 MORTGAGE cluster — tools (12 pages)

| # | Page (P keyword) | Secondary & PAA targets (sample) |
|---|---|---|
| T1 | mortgage calculator *(M1 flagship — hub)* | mortgage payment calculator · mortgage calculator with taxes and insurance · mortgage calculator with PMI · PITI calculator · how is a mortgage payment calculated · what is included in a mortgage payment |
| T2 | how much house can I afford (affordability calculator) | house affordability calculator · home affordability calculator · how much house can I afford on 60k/80k/100k salary · how much income do I need for a 300k/400k/500k house · 28/36 rule calculator |
| T3 | mortgage calculator with extra payments | extra payment mortgage calculator · extra principal payment calculator · does paying extra principal reduce monthly payment · what happens if I pay an extra $100/$200/$500 a month on my mortgage · one extra mortgage payment a year |
| T4 | biweekly mortgage calculator | biweekly mortgage payment calculator · biweekly vs monthly mortgage payments · how many years does biweekly payments take off a mortgage · do biweekly payments save money |
| T5 | 15-year mortgage calculator | 15 vs 30 year mortgage calculator · 15 year vs 30 year mortgage · is a 15 year mortgage worth it · 20 year mortgage calculator |
| T6 | FHA loan calculator | FHA mortgage calculator with MIP · FHA loan payment calculator · how much is FHA mortgage insurance · FHA vs conventional calculator |
| T7 | VA loan calculator | VA mortgage calculator · VA loan payment calculator with funding fee · what is the VA funding fee · VA loan with no down payment |
| T8 | mortgage payoff calculator | early mortgage payoff calculator · pay off mortgage early calculator · should I pay off my mortgage early · lump sum mortgage payoff calculator |
| T9 | down payment calculator | how much down payment for a house · 20 percent down payment calculator · minimum down payment by loan type · down payment on a 300k/400k house |
| T10 | PMI calculator | PMI cost calculator · how much is PMI · when does PMI go away · how to get rid of PMI · LTV calculator |
| T11 | mortgage points calculator | discount points calculator · are mortgage points worth it · mortgage points break even |
| T12 | rent vs buy calculator | rent vs buy a home · is it cheaper to rent or buy · price to rent ratio |

### 2.2 MORTGAGE cluster — programmatic (81 pages)

**State pages (50 + hub)** — pattern: `[state] mortgage calculator`
- Secondary per page: `[state] mortgage calculator with taxes` ·
  `property tax in [state]` (contextual) · `average mortgage payment in
  [state]` · 2–3 state-specific FAQs (per BUILD_PLAN M3 data rules).
- SmartAsset's per-state template (state property-tax data, county table,
  insurance figures around the calculator) is the proven reference [S3];
  NerdWallet ranks with the same pattern [S15].

**Loan-amount pages (29 + hub)** — pattern: `$X mortgage payment`
- Amounts: 100k–500k step 25k (17 pages), 550k–1M step 50k (10),
  plus 1.5M and 2M (2). URL: `/mortgage-payment/300000/`.
- Primary: `$300,000 mortgage payment` / `300k mortgage payment`.
  Secondary: `how much is a 300k mortgage per month` · `monthly payment on
  a 300k house` · `income needed for a 300k mortgage` · `$300k mortgage
  payment 15 year` · rate-scenario table (payment at 5%–8%).
- Each page = pre-filled calculator + payment matrix (rate × term) +
  income-needed section + link to adjacent amounts. Real numbers differ per
  page by construction → passes the no-thin-pages bar [S13].

### 2.3 DEBT PAYOFF cluster — tools (6 pages)

| # | Page (P keyword) | Secondary & PAA targets (sample) |
|---|---|---|
| T13 | debt snowball calculator *(M2 — hub)* | debt snowball vs avalanche calculator · debt avalanche calculator · snowball method calculator · which debt should I pay off first |
| T14 | loan payoff calculator *(M2)* | early loan payoff calculator · loan payoff calculator with extra payments · how long to pay off loan · pay off loan early calculator |
| T15 | credit card payoff calculator | credit card interest calculator · how long to pay off credit card · minimum payment calculator · pay off $5,000/$10,000 credit card |
| T16 | debt consolidation calculator | should I consolidate my debt · debt consolidation savings calculator |
| T17 | personal loan calculator | personal loan payment calculator · $10,000/$20,000 personal loan payment · personal loan interest calculator |
| T18 | student loan payoff calculator | pay off student loans early calculator · student loan extra payment calculator |

### 2.4 REFINANCE cluster — tools (2 pages)

| # | Page (P keyword) | Secondary & PAA targets (sample) |
|---|---|---|
| T19 | refinance calculator *(M2 — hub)* | mortgage refinance calculator · refinance break even calculator · should I refinance my mortgage · when is it worth it to refinance · refinance closing costs |
| T20 | cash-out refinance calculator | cash out refi calculator · how much cash can I get from a cash out refinance · cash out refinance vs HELOC |

### 2.5 AUTO cluster — tools (3 pages)

| # | Page (P keyword) | Secondary & PAA targets (sample) |
|---|---|---|
| T21 | auto loan calculator *(M2 — hub)* | car payment calculator · car loan calculator with trade in · auto loan calculator with sales tax · car payment on a $30,000/$40,000 car |
| T22 | how much car can I afford (car affordability) | car affordability calculator · 20/4/10 rule calculator · what car can I afford on 50k salary |
| T23 | auto refinance calculator | refinance car loan calculator · should I refinance my car loan |

### 2.6 Guides — question long-tails (33 pages)

Guides answer the informational queries that AI Overviews eat — so each is
written citation-first (direct-answer blocks) and exists primarily to
(a) get cited, (b) feed authority + links to its cluster hub, (c) convert
readers into tool users via the embedded calculator. The M4 first wave of
10 is marked ★.

**Mortgage (15):**
1. ★ How amortization works (embed: T1) — "what is amortization",
   "amortization schedule explained"
2. ★ PMI explained: cost, rules, removal (T10) — "how much is PMI on a
   conventional loan", "when can I stop paying PMI"
3. ★ How extra payments really work (T3) — "is it better to pay extra on
   principal", "biweekly vs extra monthly payment"
4. ★ How much income you need for a $X house (T2) — "how much do I need to
   make to buy a 400k house" (table across price points → internal links
   into amount pages)
5. ★ 15 vs 30-year mortgage: the real math (T5)
6. Property taxes in a mortgage payment: escrow explained (T1)
7. Homeowners insurance in your payment (T1)
8. FHA loans: MIP vs PMI (T6)
9. VA loan funding fee explained (T7)
10. How much down payment do you really need (T9)
11. Mortgage points: when they're worth it (T11)
12. First-time homebuyer costs checklist (T2)
13. HOA fees and your mortgage budget (T1)
14. What credit score you need for each loan type (T2)
15. Closing costs: what's in them, state differences (T19, links state pages)

**Debt payoff (8):**
16. ★ Snowball vs avalanche: the real math (T13)
17. ★ How credit card interest is calculated (T15)
18. Why minimum payments keep you in debt (T15)
19. How to pay off $10k credit card debt (T15)
20. Debt consolidation: when it helps, when it hurts (T16)
21. How loan interest works: simple vs amortized (T14)
22. Snowflaking: micro extra payments (T14)
23. Debt-to-income ratio explained (T2, T13)

**Refinance (5):**
24. ★ When refinancing is worth it: break-even math (T19)
25. Refinance closing costs breakdown (T19)
26. Cash-out refinance vs HELOC vs home equity loan (T20)
27. Streamline refinance (FHA/VA) explained (T19)
28. Does refinancing hurt your credit (T19)

**Auto (5):**
29. ★ How car loan interest works (T21)
30. New vs used car loan math (T21)
31. Upside down on a car loan: options (T23)
32. How trade-ins and sales tax affect your loan (T21)
33. 20/4/10 rule for car buying (T22)

### 2.7 Explicitly NOT targeting (and why)

- **"mortgage rates today" / any live-rate keyword** — requires paid rate
  feeds (out of scope per CLAUDE.md §7) and is brand-locked.
- **"best mortgage lenders / best credit cards"** — pure YMYL
  commercial-review SERPs, dominated by DR90 affiliates; unwinnable and
  off-strategy.
- **Head terms as primaries** ("mortgage calculator" is T1's keyword but
  success metric there is long-tail pickup: taxes/PMI/PITI modifiers).
- **Broad informational one-liners** ("what is a mortgage") — 100% AIO
  absorption, no click left to win [S8].

---

## 3. Build phasing (proposal → owner approves before BUILD_PLAN.md changes)

| Phase | Content | Pages | Cumulative |
|---|---|---|---|
| M1 (unchanged) | Flagship mortgage calculator (T1) | 1 | 6 |
| M2 (unchanged) | T13, T14, T19, T21 + homepage becomes directory | 4 | 10 |
| **M2.5 (new)** | Mortgage variant wave: T2–T8 (affordability, extra, biweekly, 15-yr, FHA, VA, payoff) | 7 | 17 |
| M3 (unchanged) | 50 state pages + by-state hub | 51 | 68 |
| **M3.5 (new)** | 29 amount pages + /mortgage-payment/ hub | 30 | 98 |
| M4 (unchanged) | 10 ★ guides + /guides/ index + author entity | 11 | 109 |
| **M4.5 (new)** | Remaining tools: T9–T12, T15–T18, T20, T22, T23 | 11 | 120 |
| **M4.75 (new)** | Remaining 23 guides | 23 | 143 |
| M5 (unchanged) | AdSense integration at markers | 0 | 143 |

Phased rollout (≤50–100 programmatic pages per wave, watch GSC indexation
before the next wave) follows current pSEO risk guidance [S13]. Expect the
top ~20% of programmatic pages to drive ~80% of that tier's traffic [S13];
after 6–9 months, prune or improve zero-impression pages.

## 4. Measurement & guardrails

- **Search Console from day 1** (submit sitemap at M1). KPI per tier:
  indexation rate, impressions, position for primary keyword, CTR.
- **Difficulty gate before each wave:** manual SERP scan per primary
  keyword; if page 1 = all major brands with dedicated pages, defer that
  page (list is a menu, not a quota).
- **Quality bar stays absolute:** every new tool must beat top-3 SERP
  results (CLAUDE.md §4.1); every programmatic page must have real
  differentiating data. A 145-page site that's thin is worse than a
  40-page site that's excellent — counts above are ceilings, not targets.
- **Traffic expectations, honestly:** clicking is down everywhere
  (−41% CTR even without AIO [S8], unverified). The 12-month 50k-visit
  goal remains possible mainly via calculator-intent + programmatic
  long-tails, not via guides.

## 5. Video layer (added 2026-07-11, research-based)

Owner goal: a topic-explainer video embedded on each page for SEO. The
evidence says video helps — but not the way most guides claim, and one
mistake would break our Lighthouse gate. Rules:

### 5.1 What video actually does for us (and doesn't)

- **Not a direct ranking factor.** Google has never confirmed embedded
  video as a ranking signal; popular stats ("53× more likely to rank") are
  correlation marketing [V1]. Real, documented benefits: engagement/dwell
  (~2.6× time-on-page per Wistia data [V1]), a second discovery channel
  (YouTube search + suggested), E-E-A-T experience signal (a real human
  explaining the math), and AI-search citability.
- **No video rich results for us — by design.** Since the 2023–2024 video
  indexing changes, Google shows video thumbnails/Video-mode results ONLY
  for "watch pages" where the video is the main content [V2]. Our pages'
  main content is the calculator/guide, so GSC will report
  "video is not the main content of the page" — that is EXPECTED and fine.
  We embed for users and engagement, not for video SERP features.
- **YouTube search is the second win.** Question long-tails ("debt
  snowball vs avalanche", "how does PMI work") have real YouTube demand;
  ranking there is far easier than Google page 1 and every video funnels
  viewers to the exact page (link + pinned comment).

### 5.2 Non-negotiable implementation rules

1. **Facade embed only.** A standard YouTube iframe loads 1.3–2.6 MB of
   third-party JS across 20+ requests — instant Lighthouse-gate failure.
   Use the `lite-youtube-embed` facade (thumbnail + click-to-load;
   ~800 ms average LCP improvement vs direct embeds) [V3]. Build once as
   an Astro component (`<VideoEmbed id="..." title="..." />`).
2. **Placement: below the tool / mid-guide.** The calculator stays the
   main above-fold content (that's our AIO moat and our "not a watch page"
   choice is deliberate). Video sits in the explainer section.
3. **Transcript on the page.** Every video gets a collapsible transcript
   under it: free long-tail text, accessibility, AI-citable. The
   transcript may not duplicate the page copy — it's the spoken-style
   complement.
4. **`VideoObject` schema** on pages with video (name, description,
   thumbnailUrl, uploadDate, duration, embedUrl) — valid and helps Google
   understand the asset; do not expect a rich result (see above).
5. **YouTube channel = brand entity.** Channel name = site name; every
   description links to the exact matching page; video title = the page's
   question-form keyword, not clickbait.

### 5.3 Production order (effort-ranked, ~56 possible; start with 12)

| Wave | Videos | Why first |
|---|---|---|
| V-1 (with M4) | 10 ★ guides' topics + snowball-vs-avalanche + how-amortization-works | Question topics = real YouTube search demand; guides face the worst AIO click loss, video+citability is their compensation |
| V-2 | 5 cluster-hub tool pages (walkthrough: "how to use / what the results mean") | Dwell time on money pages |
| V-3 | Remaining guides, then variant tools if V-1/V-2 show YouTube traction | Scale only on evidence |

State/amount programmatic pages get NO per-page videos (one generic
"how we calculate" video reused via the component if desired) — 81
near-duplicate videos would be spam on both platforms.

## 6. Sources

| # | Source | Status |
|---|---|---|
| S1 | Google Search Central — Software App (SoftwareApplication/WebApplication) structured data. developers.google.com/search/docs/appearance/structured-data/software-app | **Verified 3-0** (WebApplication support); rich-result property requirements partially verified |
| S2 | Foundation Inc — Bankrate SEO case study ($76.3M moat; 4.4M mortgage sessions/mo; pillar structure). foundationinc.co/lab/bankrate-seo-case-study | Unverified (verification agents hit usage limit) |
| S3 | SmartAsset per-state mortgage calculator template (live example: smartasset.com/mortgage/north-carolina-mortgage-calculator) + Semrush/SmartAsset case study (~1.1M keywords) | Live page observed; case-study figures unverified |
| S4 | LoanSites "Best Mortgage Keywords 2026" + LeadGen Economy mortgage-calculator keyword strategy (variant terms rankable 6–12 mo; 1,500–3,000 words on ranking calculator pages) | Unverified, marketing-blog tier |
| S5 | MortgageCalculator.org — live variant-page inventory (extra-payment, biweekly, what-if-I-pay-more) | Live pages observed |
| S6 | WordStream — interactive tools <3% AI Overview disruption | Unverified single source |
| S7 | Semrush AI Overviews study — AIO triggers lowest on interactive/transactional intents | Unverified |
| S8 | Seer Interactive Sep-2025 CTR update (−61% AIO organic CTR; −41% non-AIO; cited-in-AIO = 2–5× CTR) + Ahrefs Dec-2025 (−58% position-1 CTR) | Unverified (403-blocked; via press coverage) |
| S9 | ImproveMySearchRanking 20k-keyword study (DA barely mattered for well-chosen keywords) | Unverified, self-published |
| S10 | Google Search Central FAQPage doc + Search Engine Journal — FAQ rich results removed May 7, 2026 | Strong (primary doc + trade press), not formally 3-vote verified |
| S11 | Search Engine Land — topic clusters & pillar pages guide | Reference guidance |
| S12 | Visible Factors — internal linking architecture 2026 (3-click rule, hub equity) | Reference guidance |
| S13 | GetPassionfruit pSEO rollout guide + Omnius pSEO examples (phased ≤50–100 pages; ≥400 words non-generic; 20/80 traffic skew) + Backlinko pSEO 2026 | Reference guidance |
| S14 | LeadGen Economy — E-E-A-T author-entity signals 2026 (Person schema, sameAs) | Unverified; adopted as cheap conservative practice |
| S15 | NoGood — programmatic SEO guide (NerdWallet [state] mortgage calculator pattern) | Unverified |
| V1 | ContentPowered "Are Video Embeds an SEO Ranking Factor?" + Wistia engagement data via draft.dev / keywordkick 2026 stats roundups | Directional; ranking-factor myth debunk is well-corroborated |
| V2 | Search Engine Land + Search Engine Roundtable — Google video-mode/watch-page requirement expansion; Google Search Console video indexing docs (support.google.com/webmasters/answer/9495631) | Strong (trade press + primary docs) |
| V3 | lite-youtube-embed (Paul Irish) facade pattern; corewebvitals.io facade LCP data; accreditly.io CWV embed guides | Strong for mechanism; LCP delta figure unverified |

> Verification caveat: the adversarial-verification phase of the research
> run was cut short by a session usage limit — only the schema claims (S1)
> completed formal 3-vote verification. Figures marked (unverified) are
> single-source; treat them as directional. None of the *decisions* in this
> plan depend on an exact number being right.
