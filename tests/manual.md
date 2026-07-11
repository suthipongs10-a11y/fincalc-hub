# tests/manual.md — Math Verification (Gates M1, M2 & M2.5)

> How to re-run: `npm test` (mortgage engine), `node tests/m2-check.mjs`
> (loan/snowball/refinance/auto), `node tests/m25-check.mjs`
> (biweekly/FHA/VA/affordability). All exit non-zero on failure.
> All engines are plain JS so the exact code the browser runs is what Node
> verifies — no reimplementation drift.

## M3 — programmatic state pages (tests/m3-check.mjs + m3-similarity.mjs)

### Data verification (gate: spot-check 5 states vs sources)
- states.json validated: 50 states, unique slugs/codes, sane ranges
  (tax 0.2–2.5%, home $150k–$900k, ins $500–$7,000), transfer note per
  state, exactly 4 valid neighbors each.
- **Spot-check found and FIXED discrepancies** (the gate working as
  intended): initial tax rates were the 2022 Tax Foundation series —
  corrected to verified 2023 values for NJ (2.23), IL (2.07), TX (1.58),
  HI (0.27), AL, NV, CO, SC, CT. Insurance anchored to Bankrate 2025
  ($300k dwelling): NE $6,425 · LA $6,274 · FL $5,735 · HI $850 ·
  AL $3,539 (OK approximated from its published top-3 ranking). Home
  values NJ/HI aligned to Zillow. Anchors are locked in tests/m3-check.mjs
  so future edits can't silently regress them.
- Remaining values are from the same published series (vintage + caveat
  shown on every page); every figure prefills an editable field.

### Uniqueness (gate: no two pages >70% identical text)
- tests/m3-similarity.mjs: 5-word-shingle Jaccard similarity over the
  header+article text of all 50 built pages (1,225 pairs).
  **Max pair: 50.2%** (minnesota vs montana) — comfortably under 70%.
  Content varies by data-driven branches (high/low/mid tax + insurance
  stances), per-state notes, and build-time computed examples from the
  verified engine.

### Template verification
- Texas page spot-check on screen: prefill $300,000 / 20% down / 1.58% /
  $4,400 → P&I $1,516.96 = pmt(240k, 6.5%, 360) ✓, tax $395/mo ✓.
- Lighthouse mobile: 100/100/100/100 on /texas/mortgage-calculator/ and
  /mortgage-calculator/by-state/.
- Engineering note: Astro compiler cannot parse `}/` sequences inside
  frontmatter template literals (lexes `/` after `}` as regex start) —
  state page uses ` per ` phrasing and string-concat URLs instead.

## M2.5 engines — verified reference cases (tests/m25-check.mjs, 34 checks)

### Biweekly (loan.js amortizeBiweekly)
- Bankrate's published example ($250,000 · 30 yr · 5%): monthly P&I
  $1,342.05 ✓; biweekly half-payment $671.03 ✓; total biweekly interest
  within $500 of Bankrate's $189,734 (accrual-method difference documented
  on-page); payoff ≈ 25.27 yr (≈4 yr 9 mo early, matching the published
  example). Principal-conservation invariant holds.

### FHA (gov-loans.js, rates per HUD ML 2023-05)
- $300k / 3.5% down: base $289,500 · UFMIP $5,066.25 · financed total
  $294,566.25 · LTV 96.5% → MIP 0.55% for life; first-month MIP $135.01;
  payment = pmt(total) exactly; schedule sums to the total loan.
- 10% down → 0.50% and exactly 132 months (row 133 has MIP = 0);
  15-yr low-LTV tier 0.15% verified.

### VA (gov-loans.js, VA.gov permanent schedule)
- All six fee tiers verified (2.15/1.5/1.25 first use; 3.3/1.5/1.25
  subsequent). $350k zero-down first use: fee $7,525 → financed loan
  $357,525, payment = pmt identity. Exemption zeroes the fee; upfront mode
  keeps it out of the loan.

### Affordability (affordability.js, 28/36 rule)
- $120k income / $500 debts: front budget $2,800, back $3,100, front binds;
  bisection solver's housing cost at max price equals the budget to ±$0.05.
- Closed-form identity with taxes/ins/PMI zeroed:
  maxPrice = down + budget ÷ pmt-per-dollar (exact to $1).
- Heavier debts flip the binding constraint to back-end (verified).

### M2.5 UI verification (headless screenshots, 2026-07-11)
- All 7 pages render + compute on load; FHA breakdown matches test values
  on screen ($2,373.70 total; $135.01 MIP); VA $2,672.18 / fee $7,525.
- Fixed during QA: FHA 3.5%-minimum validation rejected exactly-3.5% down
  (floating-point epsilon).
- Lighthouse mobile: **100/100/100/100 on all seven pages**.

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
