# tests/manual.md — Math Verification (Gates M1 & M2)

> How to re-run: `npm test` (mortgage engine) and `node tests/m2-check.mjs`
> (loan/snowball/refinance/auto engines). Both exit non-zero on failure.
> All engines are plain JS so the exact code the browser runs is what Node
> verifies — no reimplementation drift.

## Mortgage calculator — verified reference cases

### Case A — $200,000 · 30 yr · 6.00%
- **Expected P&I: $1,199.10 / month** — the standard textbook example,
  published identically by Investopedia's amortization explainer and
  reproducible on Bankrate/calculator.net with the same inputs.
- Also asserted: 360 payments · total interest ≈ $231,676.38
  (= 360 × 1,199.10 − 200,000) · principal column sums to exactly the
  loan amount · payoff lands 30 years after first payment (Jul 2056 for an
  Aug 2026 start).

### Case B — $300,000 · 30 yr · 7.00%
- **Expected P&I: $1,995.91 / month** — widely published example
  (Bankrate "$300,000 mortgage" pages and SoFi's example tables use this
  figure at 7%).

### Case C — $100,000 · 15 yr · 5.00%
- **Expected P&I: $790.79 / month** — standard published 15-year example.

### PMI behavior — $250,000 price, 5% down ($12,500), PMI 0.5%/yr
- Loan $237,500 → **PMI $98.96/month** (237,500 × 0.5% ÷ 12).
- PMI charged only while balance > 78% of original value ($195,000);
  verified the schedule crosses the threshold on exactly the payment where
  PMI stops, cancels once, and never returns (Homeowners Protection Act
  auto-termination model; documented on-page).

### Extra payments — Case A + $100/month extra
- Closed-form check (not a copied number): with M = $1,299.10,
  n = −ln(1 − rP∕M) ∕ ln(1+r) = 294.46 → **payoff at payment 295**,
  i.e. **65 months (5 yr 5 mo) early**, **interest saved ≈ $49,138**.
  Engine matches to the dollar; principal column still sums to the loan.

### Edge cases
- 0% interest → payment = loan ÷ months (no division by zero).
- Final payment clamps so balance ends at exactly $0 (no negative balance).
- Down payment ≥ price, rate > 25%, negative inputs → blocked by UI
  validation with a visible error message.

## UI verification (manual, 2026-07-11)
- Desktop + mobile screenshots reviewed; %/$ down-payment toggle converts
  values both directions; hint line shows the complementary unit.
- Share URL: loading
  `/mortgage-calculator/?price=250000&down=12500&rate=6&term=30&tax=1.2&ins=1800&pmi=0.5&hoa=0&extra=100&start=2026-08&downType=dollar`
  reproduces the exact scenario (verified via headless-browser screenshot:
  P&I $1,423.93, PMI shown, savings banner "4 yr 9 mo early").
- Amortization schedule: yearly rows expand to monthly; expand/collapse-all
  works; print opens all years (beforeprint) and restores after.

## M2 engines — verified reference cases (tests/m2-check.mjs, 36 checks)

### loan.js (generic fixed-rate engine — loan payoff page)
- **$20,000 · 60 mo · 6%** → $386.66 (published example) ·
  **$25,000 · 60 mo · 5%** → $471.78 (published example) ·
  **$200,000 · 360 mo · 6%** → $1,199.10 (cross-checks against the verified
  M1 mortgage engine).
- `monthsToPayoff` inverts `pmt` exactly (60.000 months); returns ∞ when the
  payment doesn't cover interest, and `amortizeLoan` flags the same case
  as `unpayable` (UI shows an explanatory error instead of looping).
- Extra $100/mo on 20k/6%/$386.66: closed-form n = −ln(1−rP∕M)∕ln(1+r)
  = 46.55 → **47 payments**; engine matches. Principal always sums to the
  loan to the cent.

### snowball.js (debt snowball page)
- **Degeneracy check:** a single debt must equal plain amortization —
  months and interest match loan.js exactly.
- **Hand-checkable case:** $500 @ 0%, $300/mo total → 2 months, $0 interest.
- **Method ordering:** snowball targets smallest balance, avalanche targets
  highest APR (verified on a divergent 3-debt mix where they differ);
  avalanche interest is strictly lower there — the mathematical guarantee.
- **Conservation:** total paid = total principal + total interest to the
  cent, both methods. Unpayable minimums are flagged, not looped.

### refinance.js
- Current/new payments are `pmt` identities (engine shares the verified
  formula). Break-even = ⌈closing costs ÷ monthly savings⌉ — e.g. $4,000
  costs ÷ ($1,413.56 − $1,135.58) = 14.4 → month 15.
- Lifetime savings equals (old payments to payoff) − (new payments to
  payoff + upfront costs) exactly; financed costs raise the new principal
  ($200k + $4k = $204k). Rate increases produce negative savings and the
  UI says so instead of showing a bogus break-even.

### auto.js
- Worked example: $35,000 price, $5,000 down, $8,000 trade (owing $2,000),
  6% tax **after trade-in credit**, $500 fees financed, 7% APR / 60 mo →
  taxable $27,000 · tax $1,620 · **amount financed $26,120** ·
  payment = pmt(26,120, 7%, 60) = $517.21. All arithmetic is exact.
- No-credit state (CA-style): taxable = full $35,000; upfront tax+fees mode
  keeps them out of the loan and in "due at signing".
- State tax data: base rates + trade-in-credit flags compiled 2026-07 from
  state DOR publications (see src/data/auto-sales-tax.json `meta.sources`);
  the rate field stays user-editable and every page carries a
  verify-with-your-DMV caveat.

## UI verification (manual, 2026-07-11, headless-browser screenshots)
- All four M2 calculators render and compute on load; results match the
  engines (spot-checked: refinance $1,782.61 = pmt(250k, 7.25%, 312);
  auto $663.34 = pmt(33,500, 7%, 60)).
- Share-URL round-trip, print (schedules auto-expand), expand/collapse all,
  add/remove debt rows, state dropdown prefill + trade-in credit toggle.
- Lighthouse mobile, all four pages: **100/100/100/100** (snowball page
  fixed from CLS 0.189 → 0.003 by server-rendering default debt rows;
  heading-order + empty-th issues fixed on loan-payoff/refinance).

## Gate M2 status
- [x] Math verified per tool (36 checks, `node tests/m2-check.mjs`)
- [x] Homepage is a real directory (all 5 tools live + cross-linked;
      footer + Related Calculators sections link every tool)
- [x] Schema on every page: WebApplication + BreadcrumbList + FAQPage
- [x] Lighthouse ≥95 mobile on all four new templates (all 100×4)

## Gate M1 status
- [x] 3 known-correct examples verified (A, B, C) + PMI + extra-payment cases
- [x] Schema present and parseable: WebApplication, BreadcrumbList,
  FAQPage (9 Q), WebSite — single JSON-LD block, JSON.parse-validated
  against the built HTML
- [x] Lighthouse mobile /mortgage-calculator/: 100 / 100 / 100 / 100
- [x] 2 × AD_SLOT markers (above-fold right, below results)
