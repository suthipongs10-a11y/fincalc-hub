/**
 * Site-wide constants. Brand: Payoff Logic (payofflogic.com, live since
 * 2026-07-11). Contact email + author entity still pending owner decision
 * (see STATUS.md) — swap values here once decided.
 */
export const SITE = {
  name: 'Payoff Logic',
  tagline: 'Free financial calculators you can actually trust',
  url: 'https://payofflogic.com',
  contactEmail: 'tanakonp99@gmail.com',
  /** Placeholder author entity until owner picks a real/pen name. */
  author: 'Payoff Logic Editorial Team',
  launchedYear: 2026,
} as const;

/**
 * All tools, grouped into topic clusters (SEO_PLAN.md hub-and-spoke).
 * `core` tools appear in the footer (kept small on purpose); the homepage
 * directory shows everything grouped by cluster.
 */
export const CLUSTERS = {
  mortgage: 'Mortgage',
  debt: 'Debt Payoff',
  refinance: 'Refinance',
  auto: 'Auto',
} as const;

export interface Tool {
  slug: string;
  name: string;
  description: string;
  status: 'live' | 'coming-soon';
  cluster: keyof typeof CLUSTERS;
  core?: boolean;
}

export const TOOLS: Tool[] = [
  {
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description:
      'Estimate your full monthly payment — principal, interest, property taxes, insurance, PMI, and HOA — with a complete amortization schedule.',
    status: 'live',
    cluster: 'mortgage',
    core: true,
  },
  {
    slug: 'house-affordability-calculator',
    name: 'Home Affordability Calculator',
    description:
      'How much house can you afford? Income, debts, and the 28/36 rule turned into a real price range.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'extra-payment-mortgage-calculator',
    name: 'Extra Payment Mortgage Calculator',
    description:
      'What paying more each month (or one lump sum) does to your mortgage payoff date and interest.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'biweekly-mortgage-calculator',
    name: 'Biweekly Mortgage Calculator',
    description:
      'Half your payment every two weeks equals 13 payments a year — see the years and interest it removes.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: '15-year-mortgage-calculator',
    name: '15-Year Mortgage Calculator',
    description:
      '15 vs. 30 years side by side: payment difference, interest difference, and equity build.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'fha-loan-calculator',
    name: 'FHA Loan Calculator',
    description:
      'FHA payment with both MIP charges included — upfront 1.75% and the annual premium, with the 11-year rule.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'va-loan-calculator',
    name: 'VA Loan Calculator',
    description:
      'VA payment with the correct funding fee for your down payment and usage — and no PMI.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'mortgage-payoff-calculator',
    name: 'Mortgage Payoff Calculator',
    description:
      'Pay off your existing mortgage early: extra monthly payments, lump sums, and your new payoff date.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'down-payment-calculator',
    name: 'Down Payment Calculator',
    description:
      'Every tier from 3.5% to 20% compared: cash needed, payment, PMI — and what your savings cover.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'pmi-calculator',
    name: 'PMI Calculator',
    description:
      'Your monthly PMI, the exact month it cancels at 78% LTV, and how extra payments remove it sooner.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'mortgage-points-calculator',
    name: 'Mortgage Points Calculator',
    description:
      'Price the rate buy-down: points cost, monthly savings, break-even month, lifetime value.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'rent-vs-buy-calculator',
    name: 'Rent vs. Buy Calculator',
    description:
      'Year-by-year net cost of each path — equity, appreciation, and transaction costs included — with your crossover year.',
    status: 'live',
    cluster: 'mortgage',
  },
  {
    slug: 'loan-payoff-calculator',
    name: 'Loan Payoff Calculator',
    description:
      'See how extra payments shorten your loan and how much interest you save.',
    status: 'live',
    cluster: 'debt',
    core: true,
  },
  {
    slug: 'credit-card-payoff-calculator',
    name: 'Credit Card Payoff Calculator',
    description:
      'How long your payment takes — or the payment that hits your target date — with a +$50/+$100 ladder.',
    status: 'live',
    cluster: 'debt',
  },
  {
    slug: 'debt-consolidation-calculator',
    name: 'Debt Consolidation Calculator',
    description:
      'Your debts vs. a real loan offer at the same monthly budget — fees counted, longer-term tricks exposed.',
    status: 'live',
    cluster: 'debt',
  },
  {
    slug: 'personal-loan-calculator',
    name: 'Personal Loan Calculator',
    description:
      'Payment, total interest, and full schedule for any personal loan — plus early-payoff savings.',
    status: 'live',
    cluster: 'debt',
  },
  {
    slug: 'student-loan-payoff-calculator',
    name: 'Student Loan Payoff Calculator',
    description:
      'Fixed-plan student loan math with extra-payment savings — and when NOT to prepay (IDR/forgiveness).',
    status: 'live',
    cluster: 'debt',
  },
  {
    slug: 'debt-snowball-calculator',
    name: 'Debt Snowball Calculator',
    description:
      'Compare the snowball and avalanche payoff methods side by side across all your debts.',
    status: 'live',
    cluster: 'debt',
    core: true,
  },
  {
    slug: 'refinance-calculator',
    name: 'Refinance Calculator',
    description:
      'Find your break-even month and lifetime savings before you refinance.',
    status: 'live',
    cluster: 'refinance',
    core: true,
  },
  {
    slug: 'cash-out-refinance-calculator',
    name: 'Cash-Out Refinance Calculator',
    description:
      'What the cash really costs per dollar borrowed — plus the 80% LTV check and your new payment.',
    status: 'live',
    cluster: 'refinance',
  },
  {
    slug: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    description:
      'Estimate car payments including trade-in value and state sales tax.',
    status: 'live',
    cluster: 'auto',
    core: true,
  },
  {
    slug: 'car-affordability-calculator',
    name: 'Car Affordability Calculator',
    description:
      'Turn a monthly budget into a maximum sticker price — tax-aware, with down payment and trade-in.',
    status: 'live',
    cluster: 'auto',
  },
  {
    slug: 'auto-refinance-calculator',
    name: 'Auto Refinance Calculator',
    description:
      'Check the refi math on your car loan in 30 seconds — fees included, longer-term trap flagged.',
    status: 'live',
    cluster: 'auto',
  },
];
