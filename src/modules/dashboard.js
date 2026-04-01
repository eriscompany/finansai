/**
 * Dashboard metrik kartlarını günceller.
 * Veriyi DOM'dan değil, window.allTx'ten okur.
 */

/**
 * window.allTx dizisinden bu ayın gelir/gider toplamını hesaplar.
 * @returns {{ income: number, expense: number }}
 */
function computeMonthlyTotals() {
  const txs = window.allTx;
  if (!Array.isArray(txs) || !txs.length) return { income: 0, expense: 0 };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  let income = 0;
  let expense = 0;

  txs.forEach((tx) => {
    const txDate = new Date(`${tx.date}T12:00:00`);
    if (
      txDate.getFullYear() !== currentYear ||
      txDate.getMonth() !== currentMonth
    ) return;

    if (tx.amount > 0) income += tx.amount;
    else expense += Math.abs(tx.amount);
  });

  return { income, expense };
}

function fmt(n) {
  return `₺${Math.round(n).toLocaleString("tr-TR")}`;
}

export function initDashboardModule() {
  const page = document.querySelector("#page-dashboard");
  if (!page) return;

  const { income, expense } = computeMonthlyTotals();
  const net = income - expense;
  const savingsRate = income > 0 ? ((net / income) * 100).toFixed(1) : null;

  const set = (id, val) => {
    const el = page.querySelector(id);
    if (el) el.textContent = val;
  };

  set("#dash-net", fmt(net));
  set("#dash-income", fmt(income));
  set("#dash-expense", fmt(expense));
  set("#dash-savings-rate", savingsRate !== null ? `%${savingsRate}` : "—");

  // Gelir/Gider oranı çubuğu
  const total = income + expense;
  if (total > 0) {
    const incomePct = Math.round((income / total) * 100);
    const expensePct = 100 - incomePct;

    const incomeBar = page.querySelector("#dash-ratio-income");
    const expenseBar = page.querySelector("#dash-ratio-expense");
    if (incomeBar) incomeBar.style.width = `${incomePct}%`;
    if (expenseBar) expenseBar.style.width = `${expensePct}%`;

    set("#dash-ratio-income-pct", `%${incomePct}`);
    set("#dash-ratio-expense-pct", `%${expensePct}`);
  }
}
