// @ts-check
/**
 * Debt snowball / avalanche simulation.
 * Each month: accrue interest on every debt, pay each debt's minimum, then
 * pour the extra budget PLUS every paid-off debt's freed-up minimum
 * (the "snowball") into one target debt:
 *   - snowball: lowest current balance first
 *   - avalanche: highest APR first (tie → lower balance)
 * Payments cap at what's owed; leftover target budget rolls to the next
 * target within the same month.
 */

/**
 * @typedef {{name:string, balance:number, rate:number, minPayment:number}} Debt
 * @typedef {{months:number, totalInterest:number, totalPaid:number,
 *            payoffOrder:{name:string, month:number}[],
 *            timeline:number[], unpayable:boolean}} SimResult
 */

/**
 * @param {Debt[]} debts
 * @param {number} extraBudget dollars/month on top of all minimums
 * @param {'snowball'|'avalanche'} method
 * @returns {SimResult}
 */
export function simulate(debts, extraBudget, method) {
  const state = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d }));
  const payoffOrder = [];
  const timeline = [state.reduce((s, d) => s + d.balance, 0)];
  let totalInterest = 0;
  let totalPaid = 0;
  const CAP = 1200;

  for (let m = 1; state.some((d) => d.balance > 0.005); m++) {
    if (m > CAP) return { months: 0, totalInterest: 0, totalPaid: 0, payoffOrder: [], timeline: [], unpayable: true };

    // 1) accrue interest
    for (const d of state) {
      if (d.balance > 0.005) {
        const i = (d.balance * d.rate) / 100 / 12;
        d.balance += i;
        totalInterest += i;
      }
    }
    // 2) minimums (freed-up minimums of paid debts join the pool)
    let pool = extraBudget;
    for (const d of state) {
      if (d.balance > 0.005) {
        const pay = Math.min(d.minPayment, d.balance);
        d.balance -= pay;
        totalPaid += pay;
        pool += d.minPayment - pay; // overshoot rolls into pool
      } else {
        pool += d.minPayment;
      }
    }
    // 3) pool → targets in method order
    while (pool > 0.005) {
      const open = state.filter((d) => d.balance > 0.005);
      if (!open.length) break;
      open.sort((a, b) =>
        method === 'avalanche'
          ? b.rate - a.rate || a.balance - b.balance
          : a.balance - b.balance || b.rate - a.rate
      );
      const t = open[0];
      const pay = Math.min(pool, t.balance);
      t.balance -= pay;
      totalPaid += pay;
      pool -= pay;
    }
    // 4) record payoffs + timeline
    for (const d of state) {
      if (d.balance <= 0.005 && !payoffOrder.some((p) => p.name === d.name)) {
        d.balance = 0;
        payoffOrder.push({ name: d.name, month: m });
      }
    }
    timeline.push(state.reduce((s, d) => s + d.balance, 0));
  }
  return { months: timeline.length - 1, totalInterest, totalPaid, payoffOrder, timeline, unpayable: false };
}

/**
 * Run both methods for the comparison view.
 * @param {Debt[]} debts @param {number} extraBudget
 */
export function compare(debts, extraBudget) {
  const snowball = simulate(debts, extraBudget, 'snowball');
  const avalanche = simulate(debts, extraBudget, 'avalanche');
  return {
    snowball,
    avalanche,
    interestDiff: snowball.totalInterest - avalanche.totalInterest,
    monthsDiff: snowball.months - avalanche.months,
  };
}
