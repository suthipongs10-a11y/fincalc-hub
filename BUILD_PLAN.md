# BUILD_PLAN.md — Milestones & Gates

Each milestone ends with: build passes → gate checklist ✅ → STATUS.md updated
→ git commit `M{n}: ...` → STOP for owner review.

---

## M0 — Scaffold (small)
- Init Astro + Tailwind, base layout (header/footer/nav), design tokens
  (trustworthy finance look: deep blue/slate + one accent; NOT a generic template)
- Pages: home shell, /about, /privacy, /terms, /contact (real content, EN)
- Deploy pipeline note for Cloudflare Pages in README.md

**Gate M0:** `npm run build` clean · Lighthouse ≥95 mobile on home ·
all legal pages exist · STATUS.md updated.

## M1 — Flagship: Mortgage Calculator
- `/mortgage-calculator/` — PITI breakdown (principal, interest, taxes, insurance,
  PMI, HOA), down-payment %/$ toggle, full amortization schedule (collapsible,
  yearly/monthly), payoff chart, extra-payment support
- Shareable URL state via query params; print-friendly results
- FAQ section (8+ real questions) + FAQPage & SoftwareApplication JSON-LD
- `<!-- AD_SLOT -->` markers: 1 above fold-right (desktop), 1 below results

**Gate M1:** results verified against 3 known-correct examples (document the
test cases in /tests/manual.md) · schema validates · Lighthouse ≥95 · commit.

> Keyword targets, on-page checklist, and internal-linking rules for every
> page from M1 onward: see SEO_PLAN.md (owner-approved 2026-07-11).

## M2 — Tool Suite (4 tools)
- /loan-payoff-calculator/ (extra payments, time saved, interest saved)
- /debt-snowball-calculator/ (snowball vs avalanche comparison — differentiator)
- /refinance-calculator/ (break-even month, lifetime savings)
- /auto-loan-calculator/ (trade-in, sales tax by state dropdown)
- Homepage becomes real tool directory; cross-linking between all tools

**Gate M2:** same math-verification standard as M1 for each tool · commit.

## M2.5 — Mortgage Variant Tools, wave 1 (approved 2026-07-11)
- 7 tools per SEO_PLAN.md T2–T8: house-affordability, extra-payments,
  biweekly, 15-year, FHA, VA, mortgage-payoff
- Each: own URL, shared calc engine where possible, full on-page checklist
  (SEO_PLAN.md §1.4), cross-links to hub + related tools

**Gate M2.5:** math verified per tool · Lighthouse ≥95 · commit.

## M3 — Programmatic State Pages (50 pages)
- Build `/src/data/states.json`: state name, avg property tax rate, avg home
  value, insurance avg, transfer-tax notes, 2-3 state-specific FAQ items,
  `sources: []` for every figure
- Template `/[state]/mortgage-calculator/` — calculator pre-filled with state
  defaults + unique intro paragraph rendered from data points (not spun text)
- XML sitemap, internal link hub page /mortgage-calculator/by-state/

**Gate M3:** spot-check 5 random states for data accuracy vs sources ·
no two pages >70% identical text · commit.

## M3.5 — Loan-Amount Pages (approved 2026-07-11)
- 29 pages `/mortgage-payment/{amount}/` + index hub, per SEO_PLAN.md §2.2:
  pre-filled calculator, rate×term payment matrix, income-needed section,
  adjacent-amount links

**Gate M3.5:** spot-check 5 pages' matrices against the verified engine ·
GSC indexation of M3 pages reviewed before shipping · commit.

## M4 — E-E-A-T Content Layer (10 guides)
- 10 supporting guides (1,200–2,000 words each) mapped to tools, e.g.
  "PMI explained", "Snowball vs avalanche: the real math", "How extra payments
  work" — each embeds the relevant calculator
- Author entity on About page; article schema; last-updated dates

**Gate M4:** guides pass owner review for accuracy · ready for AdSense
application → owner action item.

> M4 also ships video wave V-1 (12 videos, SEO_PLAN.md §5.3): facade embeds
> only, transcripts on-page, VideoObject schema.

## M4.5 — Remaining Tools (approved 2026-07-11)
- 11 tools per SEO_PLAN.md: T9–T12 (down-payment, PMI, points, rent-vs-buy),
  T15–T18 (credit-card payoff, consolidation, personal loan, student loan),
  T20 (cash-out refi), T22–T23 (car affordability, auto refi)

**Gate M4.5:** math verified per tool · commit.

## M4.75 — Remaining Guides (approved 2026-07-11)
- 23 guides per SEO_PLAN.md §2.6 + video waves V-2/V-3 as evidence allows

**Gate M4.75:** accuracy review · commit.

## M5 — Post-approval (owner-triggered only)
- Insert AdSense code at markers, consent management if needed, monitor CWV
