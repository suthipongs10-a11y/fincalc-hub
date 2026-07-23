// Computes the exact figures used in each tool page's "Worked example"
// section, straight from the production engines. Run: node scripts/worked-examples.mjs
// The numbers this prints are pasted (rounded per each page) into the pages,
// so the examples can never drift from the calculators.
import { computeMortgage, monthlyPI, amortize } from '../src/lib/mortgage.js';
import { pmt, monthsToPayoff, amortizeLoan, amortizeBiweekly } from '../src/lib/loan.js';
import { compare } from '../src/lib/snowball.js';
import { computeRefinance } from '../src/lib/refinance.js';
import { computeAuto } from '../src/lib/auto.js';
import { computeFHA, computeVA } from '../src/lib/gov-loans.js';
import { computeAffordability } from '../src/lib/affordability.js';
import { pointsBreakEven, cashOutRefi, carAffordability, consolidationCompare, rentVsBuy } from '../src/lib/tools-extra.js';

const d0 = (n) => '$' + Math.round(n).toLocaleString('en-US');
const d2 = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const yrMo = (m) => `${Math.floor(m / 12)} yr ${m % 12} mo (${m} months)`;
const out = {};

// 1. mortgage-calculator
{
  const base = { homePrice: 400000, downPayment: 80000, annualRate: 6.5, termYears: 30, taxRate: 1.1, insuranceAnnual: 1800, pmiRate: 0.5, hoaMonthly: 0, extraMonthly: 0, startYear: 2026, startMonth: 1 };
  const r = computeMortgage(base);
  out['mortgage-calculator'] = { loan: d0(r.loan), pi: d2(r.monthlyPI), tax: d2(r.monthlyTax), ins: d2(r.monthlyIns), piti: d2(r.monthlyPI + r.monthlyTax + r.monthlyIns), totalInterest: d0(amortize(base).totalInterest) };
}
// 2. loan-payoff-calculator
{
  const b = amortizeLoan({ principal: 20000, annualRate: 6.5, payment: 400 });
  const e = amortizeLoan({ principal: 20000, annualRate: 6.5, payment: 450 });
  out['loan-payoff-calculator'] = { months: b.months, span: yrMo(b.months), interest: d0(b.totalInterest), monthsExtra: e.months, interestExtra: d0(e.totalInterest), intSaved: d0(b.totalInterest - e.totalInterest), moSaved: b.months - e.months };
}
// 3. debt-snowball-calculator (orders deliberately differ: smallest balance is NOT highest APR)
{
  const debts = [
    { name: 'Medical bill', balance: 2000, rate: 0, minPayment: 50 },
    { name: 'Credit card', balance: 6000, rate: 24.99, minPayment: 150 },
    { name: 'Car loan', balance: 9000, rate: 7, minPayment: 300 },
  ];
  const c = compare(debts, 300);
  out['debt-snowball-calculator'] = { snowMonths: c.snowball.months, snowInt: d0(c.snowball.totalInterest), avaMonths: c.avalanche.months, avaInt: d0(c.avalanche.totalInterest), intDiff: d0(Math.abs(c.interestDiff)), snowFirst: c.snowball.payoffOrder[0].name, snowFirstMonth: c.snowball.payoffOrder[0].month, avaFirst: c.avalanche.payoffOrder[0].name };
}
// 4. refinance-calculator
{
  const r = computeRefinance({ balance: 300000, currentRate: 7.5, remainingYears: 28, newRate: 6.25, newTermYears: 30, closingCosts: 4500, financeClosingCosts: false });
  out['refinance-calculator'] = { curPay: d2(r.currentPayment), newPay: d2(r.newPayment), moSave: d2(r.monthlySavings), be: r.breakEvenMonths, life: d0(r.lifetimeSavings) };
}
// 5. auto-loan-calculator
{
  const r = computeAuto({ price: 35000, down: 5000, tradeIn: 8000, owedOnTrade: 0, taxRate: 6, tradeInReducesTax: true, fees: 600, financeTaxFees: true, annualRate: 7, termMonths: 60 });
  out['auto-loan-calculator'] = { taxable: d0(r.taxable), tax: d0(r.salesTax), loan: d0(r.loan), pay: d2(r.payment), interest: d0(r.totalInterest) };
}
// 6. house-affordability-calculator
{
  const r = computeAffordability({ annualIncome: 120000, monthlyDebts: 500, down: 60000, annualRate: 6.5, termYears: 30, taxRate: 1.1, insAnnual: 1800, pmiRate: 0.5, hoaMonthly: 0, frontPct: 28, backPct: 36 });
  out['house-affordability-calculator'] = { front: d0(r.frontBudget), back: d0(r.backBudget), budget: d0(r.budget), binding: r.binding, maxPrice: d0(r.maxPrice), pi: d0(r.breakdown.pi), tax: d0(r.breakdown.tax), ins: d0(r.breakdown.ins), pmi: d0(r.breakdown.pmi) };
}
// 7. extra-payment-mortgage-calculator
{
  const base = { homePrice: 400000, downPayment: 80000, annualRate: 6.5, termYears: 30, taxRate: 0, insuranceAnnual: 0, pmiRate: 0, hoaMonthly: 0, extraMonthly: 0, startYear: 2026, startMonth: 1 };
  const b = amortize(base), e = amortize({ ...base, extraMonthly: 200 });
  out['extra-payment-mortgage-calculator'] = { loan: d0(b.loan), pi: d2(b.basePI), baseInt: d0(b.totalInterest), extraInt: d0(e.totalInterest), intSaved: d0(b.totalInterest - e.totalInterest), moSaved: b.months - e.months, spanSaved: yrMo(b.months - e.months) };
}
// 8. biweekly-mortgage-calculator
{
  const loan = 320000, rate = 6.5;
  const monthly = monthlyPI(loan, rate, 30);
  const mSched = amortizeLoan({ principal: loan, annualRate: rate, payment: monthly });
  const bi = amortizeBiweekly(loan, rate, 30);
  out['biweekly-mortgage-calculator'] = { loan: d0(loan), monthly: d2(monthly), half: d2(bi.halfPayment), monthlyInt: d0(mSched.totalInterest), biInt: d0(bi.totalInterest), intSaved: d0(mSched.totalInterest - bi.totalInterest), biYears: bi.years.toFixed(1), moSaved: Math.round((30 - bi.years) * 12) };
}
// 9. 15-year-mortgage-calculator
{
  const loan = 320000;
  const p30 = monthlyPI(loan, 6.5, 30), p15 = monthlyPI(loan, 5.75, 15);
  const i30 = amortizeLoan({ principal: loan, annualRate: 6.5, payment: p30 }).totalInterest;
  const i15 = amortizeLoan({ principal: loan, annualRate: 5.75, payment: p15 }).totalInterest;
  out['15-year-mortgage-calculator'] = { loan: d0(loan), p30: d2(p30), p15: d2(p15), diff: d2(p15 - p30), i30: d0(i30), i15: d0(i15), intSaved: d0(i30 - i15) };
}
// 10. fha-loan-calculator
{
  const r = computeFHA({ price: 300000, down: 10500, annualRate: 6.5, termYears: 30 });
  out['fha-loan-calculator'] = { base: d0(r.baseLoan), ufmip: d0(r.ufmip), totalLoan: d0(r.totalLoan), mipRate: r.mipRate, firstMIP: d2(r.firstMIP), pay: d2(r.payment), pitiWithMip: d2(r.payment + r.firstMIP), mipLife: r.mipMonths === Infinity ? 'the life of the loan' : (r.mipMonths / 12) + ' years' };
}
// 11. va-loan-calculator
{
  const r = computeVA({ price: 350000, down: 0, annualRate: 6.5, termYears: 30, subsequentUse: false, exempt: false, financeFee: true });
  out['va-loan-calculator'] = { base: d0(r.baseLoan), feePct: r.feePct, fee: d0(r.feeAmount), totalLoan: d0(r.totalLoan), pay: d2(r.payment), interest: d0(r.totalInterest) };
}
// 12. mortgage-payoff-calculator
{
  const bal = 250000, rate = 6.5;
  const pay = monthlyPI(bal, rate, 30);
  const b = amortizeLoan({ principal: bal, annualRate: rate, payment: pay });
  const e = amortizeLoan({ principal: bal, annualRate: rate, payment: pay + 300 });
  out['mortgage-payoff-calculator'] = { bal: d0(bal), pay: d2(pay), baseMonths: b.months, baseSpan: yrMo(b.months), extraMonths: e.months, extraSpan: yrMo(e.months), moSaved: b.months - e.months, intSaved: d0(b.totalInterest - e.totalInterest) };
}
// 13. credit-card-payoff-calculator
{
  const bal = 8000, apr = 22.99;
  const a = amortizeLoan({ principal: bal, annualRate: apr, payment: 250 });
  const a2 = amortizeLoan({ principal: bal, annualRate: apr, payment: 350 });
  out['credit-card-payoff-calculator'] = { bal: d0(bal), apr, pay: d0(250), months: a.months, span: yrMo(a.months), interest: d0(a.totalInterest), pay2: d0(350), months2: a2.months, interest2: d0(a2.totalInterest), intSaved: d0(a.totalInterest - a2.totalInterest), firstInt: d2(bal * apr / 100 / 12) };
}
// 14. rent-vs-buy-calculator
{
  const r = rentVsBuy({ price: 400000, down: 80000, rate: 6.5, termYears: 30, taxRate: 1.1, insAnnual: 1800, maintPct: 1, rent: 2200, rentGrowthPct: 3, appreciationPct: 3, horizonYears: 10 });
  const y5 = r.years[4], y10 = r.years[9];
  out['rent-vs-buy-calculator'] = { pay: d2(r.payment), crossover: r.crossover, y5rent: d0(y5.rentCost), y5own: d0(y5.ownCost), y10rent: d0(y10.rentCost), y10own: d0(y10.ownCost) };
}
// 15. down-payment-calculator
{
  const price = 400000, rate = 6.5;
  const tiers = [3, 5, 10, 20].map((p) => {
    const loan = price * (1 - p / 100);
    const pi = monthlyPI(loan, rate, 30);
    const pmi = p < 20 ? (loan * 0.5) / 100 / 12 : 0;
    return { p, down: d0(price * p / 100), loan: d0(loan), pi: d2(pi), pmi: d2(pmi), total: d2(pi + pmi) };
  });
  out['down-payment-calculator'] = { price: d0(price), tiers };
}
// 16. pmi-calculator
{
  const price = 400000, down = 30000, rate = 6.5;
  const base = { homePrice: price, downPayment: down, annualRate: rate, termYears: 30, taxRate: 0, insuranceAnnual: 0, pmiRate: 0.5, hoaMonthly: 0, extraMonthly: 0, startYear: 2026, startMonth: 1 };
  const s = amortize(base);
  const loan = price - down;
  const cancelRow = s.rows.find((row) => row.pmi === 0);
  const pmiMonthly = loan * 0.5 / 100 / 12;
  let totalPmi = s.totalPMI;
  out['pmi-calculator'] = { price: d0(price), down: d0(down), downPct: (down / price * 100).toFixed(1), loan: d0(loan), pmiMonthly: d2(pmiMonthly), cancelMonth: cancelRow ? cancelRow.n : 'n/a', cancelSpan: cancelRow ? yrMo(cancelRow.n - 1) : 'n/a', totalPmi: d0(totalPmi) };
}
// 17. personal-loan-calculator
{
  const p = 15000, rate = 11, n = 48;
  const pay = pmt(p, rate, n);
  const i = amortizeLoan({ principal: p, annualRate: rate, payment: pay }).totalInterest;
  out['personal-loan-calculator'] = { p: d0(p), rate, n, pay: d2(pay), interest: d0(i), total: d0(p + i) };
}
// 18. student-loan-payoff-calculator
{
  const p = 30000, rate = 5.5, n = 120;
  const pay = pmt(p, rate, n);
  const b = amortizeLoan({ principal: p, annualRate: rate, payment: pay });
  const e = amortizeLoan({ principal: p, annualRate: rate, payment: pay + 100 });
  out['student-loan-payoff-calculator'] = { p: d0(p), rate, pay: d2(pay), baseInt: d0(b.totalInterest), extraMonths: e.months, extraSpan: yrMo(e.months), intSaved: d0(b.totalInterest - e.totalInterest), moSaved: b.months - e.months };
}
// 19. car-affordability-calculator
{
  const r = carAffordability({ budget: 500, down: 3000, tradeIn: 0, annualRate: 7, termMonths: 60, taxRate: 6, tradeInReducesTax: true, feesUpfront: true });
  const r48 = carAffordability({ budget: 500, down: 3000, tradeIn: 0, annualRate: 7, termMonths: 48, taxRate: 6, tradeInReducesTax: true, feesUpfront: true });
  out['car-affordability-calculator'] = { budget: d0(500), maxPrice60: d0(r.maxPrice), loan60: d0(r.loan), maxPrice48: d0(r48.maxPrice) };
}
// 20. mortgage-points-calculator
{
  const r = pointsBreakEven({ loan: 320000, termYears: 30, baseRate: 6.75, points: 2, reducedRate: 6.25 });
  out['mortgage-points-calculator'] = { cost: d0(r.cost), payBase: d2(r.payBase), payReduced: d2(r.payReduced), moSave: d2(r.monthlySavings), be: r.breakEvenMonths, beSpan: yrMo(r.breakEvenMonths), life: d0(r.lifetimeSavings) };
}
// 21. debt-consolidation-calculator
{
  const debts = [
    { name: 'Card A', balance: 6000, rate: 22.99, minPayment: 150 },
    { name: 'Card B', balance: 4500, rate: 19.99, minPayment: 115 },
    { name: 'Card C', balance: 3500, rate: 24.99, minPayment: 90 },
  ];
  const r = consolidationCompare({ debts, extraBudget: 0, newRate: 12, newTermMonths: 36, fee: 3 });
  out['debt-consolidation-calculator'] = { principal: d0(r.principal), fee: d0(r.feeAmount), curInt: d0(r.current.totalInterest), curMonths: r.current.months, newPay: d2(r.newPayment), newInt: d0(r.newInterest), newMonths: r.newMonths, intSaved: d0(r.current.totalInterest - r.newInterest) };
}
// 22. cash-out-refinance-calculator
{
  const r = cashOutRefi({ balance: 250000, currentRate: 6.5, remainingYears: 26, cash: 40000, newRate: 7, newTermYears: 30, closingCosts: 5000, financeCosts: true });
  out['cash-out-refinance-calculator'] = { curPay: d2(r.currentPayment), newPrincipal: d0(r.newPrincipal), newPay: d2(r.newPayment), payDiff: d2(r.newPayment - r.currentPayment), costOfCash: d0(r.totalCostOfCash) };
}
// 23. auto-refinance-calculator
{
  const bal = 28000, curRate = 9.0, months = 48, newRate = 6.5;
  const curPay = pmt(bal, curRate, months);
  const newPay = pmt(bal, newRate, months);
  const curInt = amortizeLoan({ principal: bal, annualRate: curRate, payment: curPay }).totalInterest;
  const newInt = amortizeLoan({ principal: bal, annualRate: newRate, payment: newPay }).totalInterest;
  out['auto-refinance-calculator'] = { bal: d0(bal), curRate, newRate, curPay: d2(curPay), newPay: d2(newPay), moSave: d2(curPay - newPay), intSaved: d0(curInt - newInt), months };
}

console.log(JSON.stringify(out, null, 2));
