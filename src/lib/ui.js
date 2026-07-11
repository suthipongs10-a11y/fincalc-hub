// @ts-check
/**
 * Shared client-side helpers for calculator islands: formatting, URL state,
 * schedule rendering, SVG balance charts, share/print wiring. Keeps every
 * tool's behavior consistent (quality rule: schedule + share + print on
 * every calculator).
 */

export const fmt0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const fmt2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** @param {HTMLInputElement} el */
export function num(el) {
  const v = parseFloat(el.value.replace(/[$,%\s,]/g, ''));
  return Number.isFinite(v) ? v : 0;
}

/** @param {string} id */
export const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
/** @param {string} id */
export const input = (id) => /** @type {HTMLInputElement} */ (document.getElementById(id));

/** "X yr Y mo" from a month count. @param {number} m */
export function yrMo(m) {
  const y = Math.floor(m / 12), mo = Math.round(m % 12);
  return [y ? `${y} yr` : '', mo ? `${mo} mo` : ''].filter(Boolean).join(' ') || '0 mo';
}

/** Calendar payoff label m months after (startYear, startMonth). */
export function payoffLabel(startYear, startMonth, m) {
  const t = startYear * 12 + (startMonth - 1) + (m - 1);
  return `${MONTHS[t % 12]} ${Math.floor(t / 12)}`;
}

/**
 * Render a yearly-collapsible amortization schedule into `container`.
 * @param {HTMLElement} container
 * @param {{n:number,year:number,month:number,interest:number,principal:number,balance:number}[]} rows
 */
export function renderYearSchedule(container, rows) {
  const byYear = new Map();
  for (const row of rows) {
    if (!byYear.has(row.year)) byYear.set(row.year, []);
    byYear.get(row.year).push(row);
  }
  const cell = 'px-2 py-1.5 text-right tabular-nums';
  let html = `<div class="grid grid-cols-[1fr_repeat(3,minmax(5.5rem,auto))] gap-x-2 border-b border-navy-200 px-2 pb-1 text-xs font-semibold tracking-wide text-navy-600 uppercase">
    <span>Year</span><span class="text-right">Principal</span><span class="text-right">Interest</span><span class="text-right">Balance</span></div>`;
  for (const [year, yr] of byYear) {
    const p = yr.reduce((s, x) => s + x.principal, 0);
    const it = yr.reduce((s, x) => s + x.interest, 0);
    const end = yr[yr.length - 1].balance;
    const monthRows = yr
      .map((m) => `<tr class="border-t border-navy-50">
        <td class="px-2 py-1.5 text-navy-700">${MONTHS[m.month - 1]} ${m.year}</td>
        <td class="${cell}">${fmt2.format(m.principal)}</td>
        <td class="${cell}">${fmt2.format(m.interest)}</td>
        <td class="${cell}">${fmt2.format(m.balance)}</td></tr>`)
      .join('');
    html += `<details class="rounded-md border border-navy-100">
      <summary class="grid cursor-pointer grid-cols-[1fr_repeat(3,minmax(5.5rem,auto))] gap-x-2 px-2 py-2 text-sm hover:bg-navy-50 [&::-webkit-details-marker]:hidden">
        <span class="font-semibold text-navy-900">${year}</span>
        <span class="text-right tabular-nums">${fmt0.format(p)}</span>
        <span class="text-right tabular-nums">${fmt0.format(it)}</span>
        <span class="text-right font-semibold tabular-nums">${fmt0.format(end)}</span>
      </summary>
      <table class="w-full text-sm"><tbody>${monthRows}</tbody></table>
    </details>`;
  }
  container.innerHTML = html;
}

/**
 * Draw a balance-over-time SVG line chart.
 * @param {HTMLElement} svg target <svg> (viewBox 0 0 640 240)
 * @param {{values:number[], dashed?:boolean}[]} series values[0] = starting balance
 * @param {number} [maxYOverride]
 */
export function drawBalanceChart(svg, series, maxYOverride) {
  const W = 640, H = 240, PL = 56, PB = 26, PT = 10, PR = 10;
  const months = Math.max(...series.map((s) => s.values.length - 1), 12);
  const maxY = maxYOverride || Math.max(...series.flatMap((s) => s.values), 1);
  const x = (m) => PL + (m / months) * (W - PL - PR);
  const y = (v) => PT + (1 - v / maxY) * (H - PT - PB);
  const path = (vals) => `M${x(0)},${y(vals[0])}` + vals.slice(1).map((v, i) => `L${x(i + 1)},${y(v)}`).join('');

  const step = months > 240 ? 60 : months > 120 ? 36 : months > 48 ? 24 : 12;
  let ticks = '';
  for (let m = 0; m <= months; m += step) {
    ticks += `<line x1="${x(m)}" y1="${H - PB}" x2="${x(m)}" y2="${H - PB + 4}" stroke="var(--color-navy-300)"/>
      <text x="${x(m)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--color-navy-600)">${Math.round(m / 12)}y</text>`;
  }
  const kFmt = (v) => (v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${Math.round(v / 1000)}k`);
  const grid = [0.25, 0.5, 0.75, 1]
    .map((f) => `<line x1="${PL}" y1="${y(maxY * f)}" x2="${W - PR}" y2="${y(maxY * f)}" stroke="var(--color-navy-100)"/>
      <text x="${PL - 6}" y="${y(maxY * f) + 4}" text-anchor="end" font-size="11" fill="var(--color-navy-600)">${kFmt(maxY * f)}</text>`)
    .join('');
  const lines = series
    .map((s) => `<path d="${path(s.values)}" fill="none" stroke="${s.dashed ? 'var(--color-navy-300)' : 'var(--color-navy-900)'}" stroke-width="${s.dashed ? 2 : 2.5}"${s.dashed ? ' stroke-dasharray="5 4"' : ''}/>`)
    .join('');
  svg.innerHTML = grid + ticks + `<line x1="${PL}" y1="${H - PB}" x2="${W - PR}" y2="${H - PB}" stroke="var(--color-navy-300)"/>` + lines;
}

/** rows[] → cumulative balance series (values[0] = starting principal). */
export function rowsToSeries(rows, startBalance) {
  return [startBalance, ...rows.map((r) => r.balance)];
}

/**
 * Mirror named inputs into the query string + load them back on init.
 * @param {string[]} ids input element ids (values stored verbatim, commas stripped)
 */
export function urlState(ids) {
  return {
    load() {
      const q = new URLSearchParams(location.search);
      for (const id of ids) {
        const v = q.get(id);
        if (v !== null && v !== '') {
          const el = input(id);
          if (el.type === 'checkbox') el.checked = v === '1';
          else el.value = v;
        }
      }
    },
    sync(extra = {}) {
      const q = new URLSearchParams();
      for (const id of ids) {
        const el = input(id);
        q.set(id, el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value.replace(/,/g, ''));
      }
      for (const [k, v] of Object.entries(extra)) q.set(k, String(v));
      history.replaceState(null, '', `${location.pathname}?${q}`);
    },
  };
}

/** Standard share + print + expand-all wiring (ids: share, print, expand-all). */
export function wireActions(scheduleSelector) {
  const share = byId('share');
  if (share) {
    share.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        share.textContent = 'Link copied ✓';
      } catch {
        share.textContent = 'Copy from address bar';
      }
      setTimeout(() => (share.textContent = 'Copy shareable link'), 2500);
    });
  }
  const print = byId('print');
  if (print) print.addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll(`${scheduleSelector} details`).forEach((d) => {
      d.dataset.wasOpen = String(d.open);
      d.open = true;
    });
  });
  window.addEventListener('afterprint', () => {
    document.querySelectorAll(`${scheduleSelector} details`).forEach((d) => (d.open = d.dataset.wasOpen === 'true'));
  });
  const ex = byId('expand-all');
  if (ex) {
    ex.addEventListener('click', () => {
      const details = document.querySelectorAll(`${scheduleSelector} details`);
      const anyClosed = Array.from(details).some((d) => !d.open);
      details.forEach((d) => (d.open = anyClosed));
      ex.textContent = anyClosed ? 'Collapse all years' : 'Expand all years';
    });
  }
}

/** Debounced recalc binding on a form. */
export function onInput(formId, fn, ms = 150) {
  let t;
  byId(formId).addEventListener('input', () => {
    clearTimeout(t);
    t = window.setTimeout(fn, ms);
  });
}
