function computeMonthlyTotals() {
  const rows = document.querySelectorAll("#tx-list .tx-item .tx-amt");
  let income = 0;
  let expense = 0;

  rows.forEach((row) => {
    const raw = row.textContent.replace(/[₺,.\s]/g, "").trim();
    const sign = row.classList.contains("pos") ? 1 : -1;
    const value = Math.abs(Number(raw) || 0);
    if (sign > 0) income += value;
    else expense += value;
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
