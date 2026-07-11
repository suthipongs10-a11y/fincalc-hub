# tests/manual.md — Math Verification (Gate M1)

> How to re-run: `node tests/mortgage-check.mjs` (exits non-zero on failure).
> The engine (`src/lib/mortgage.js`) is plain JS so the exact code the
> browser runs is what Node verifies — no reimplementation drift.

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

## Gate M1 status
- [x] 3 known-correct examples verified (A, B, C) + PMI + extra-payment cases
- [x] Schema present and parseable: WebApplication, BreadcrumbList,
  FAQPage (9 Q), WebSite — single JSON-LD block, JSON.parse-validated
  against the built HTML
- [x] Lighthouse mobile /mortgage-calculator/: 100 / 100 / 100 / 100
- [x] 2 × AD_SLOT markers (above-fold right, below results)
