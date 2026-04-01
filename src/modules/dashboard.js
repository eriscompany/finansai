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

export function initDashboardModule() {
  const cards = document.querySelectorAll("#page-dashboard .met");
  if (!cards.length) return;

  const { income, expense } = computeMonthlyTotals();
  const net = income - expense;

  const netCard = cards[0]?.querySelector(".mv");
  const incomeCard = cards[1]?.querySelector(".mv");
  const expenseCard = cards[2]?.querySelector(".mv");

  if (netCard) netCard.textContent = `₺${Math.round(net).toLocaleString("tr-TR")}`;
  if (incomeCard) incomeCard.textContent = `₺${Math.round(income).toLocaleString("tr-TR")}`;
  if (expenseCard) expenseCard.textContent = `₺${Math.round(expense).toLocaleString("tr-TR")}`;
}
