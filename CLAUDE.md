# CLAUDE.md — FinCalc Hub (working name)

> Single source of truth. Read this file + STATUS.md at the start of EVERY session.
> Follow milestone gates in BUILD_PLAN.md. Never skip ahead without owner approval.

## 1. What we are building

A **free financial calculator tool site** targeting the **US market (English)**,
monetized with display ads (AdSense first, premium networks later) + affiliate.

Strategy = Tool Site × High-CPC Niche:
- Tools survive AI Overviews (users must click to *use* a calculator).
- Finance/loan/mortgage context attracts the highest-paying ad categories
  (insurance, loans, mortgage advertisers).
- Long-tail + programmatic state pages avoid competing with big brands head-on.

**Success metric (12 mo):** 50k+ organic visits/mo from Tier-1 countries, AdSense approved,
RPM-positive, zero manual content maintenance.

## 2. Tech stack (do not change without owner approval)

- **Astro.js (latest, static output)** + Tailwind CSS
- Calculators = vanilla TS island components (`client:visible`), no React needed
- Hosting: **Cloudflare Pages** (free tier), repo on GitHub
- No database. All programmatic data lives in `/src/data/*.json`
- Charts: lightweight (Chart.js via CDN or pure SVG) — keep JS bundle minimal
- Analytics: Cloudflare Web Analytics (no cookie banner needed initially)

## 3. Site architecture

```
/                          → homepage (tool directory, categories)
/mortgage-calculator/      → flagship tool (rich: PITI, taxes, PMI, amortization)
/loan-payoff-calculator/
/debt-snowball-calculator/
/refinance-calculator/
/auto-loan-calculator/
/[state]/mortgage-calculator/   → 50 programmatic state pages (Milestone 3)
/guides/[slug]/            → supporting E-E-A-T articles (Milestone 4)
/about/ /privacy/ /terms/ /contact/  → required for AdSense approval
```

## 4. Non-negotiable quality rules

1. **Every calculator must be genuinely better-or-equal to top-3 SERP results.**
   Check competitors before building. Include amortization tables, shareable
   result URLs (query params), and printable results.
2. **Programmatic state pages must contain REAL differentiating data:**
   state property-tax rate, average home price, homestead notes — sourced into
   `/src/data/states.json` with a `sources` field. No pure find-and-replace pages.
3. **YMYL compliance:** every page gets a visible disclaimer
   ("educational purposes, not financial advice"), an About page with a named
   author entity, and cited data sources. AdSense is strict on finance niches.
4. **Performance:** Lighthouse ≥ 95 on mobile for every template. Ads come later;
   don't pre-optimize ad slots, but leave `<!-- AD_SLOT -->` comment markers.
5. **SEO per page:** unique title/meta, WebApplication + BreadcrumbList schema
   (JSON-LD; Article+Person on guides), breadcrumbs, internal links between
   related tools per SEO_PLAN.md. FAQ content on-page is mandatory; FAQPage
   markup optional (Google removed FAQ rich results 2026-05-07 — owner
   approved this change 2026-07-11, supersedes the old FAQPage rule).
6. All UI copy in **US English**. Currency USD. Date format MM/DD/YYYY.

## 5. Workflow rules (owner's standard pattern)

- Milestone-gated. At the end of each milestone: run build, self-audit vs the
  gate checklist in BUILD_PLAN.md, update STATUS.md, then **git commit + stop**
  and wait for owner review.
- Update STATUS.md before ending ANY session (even mid-milestone).
- Commit messages: `M{n}: short description` e.g. `M1: mortgage calculator core`.
- If a decision isn't covered here → write the question in STATUS.md
  under "Pending decisions" and choose the most conservative option.

## 6. Monetization roadmap (context only — no ad code until owner says)

1. Build 5 tools + 10 guides + required pages → apply AdSense
2. AdSense approved → add slots (below fold near results, in-content on guides)
3. 10k sessions/mo → evaluate Ezoic/Monumetric; 50k → Mediavine-class
4. Affiliate layer: relevant finance offers on results pages (owner selects programs)

## 7. Out of scope (do NOT build)

- User accounts, saved data, backend/API of any kind
- Live mortgage-rate feeds (requires paid API — Phase 2 discussion)
- Non-US localization
