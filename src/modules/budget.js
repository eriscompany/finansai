/**
 * Bütçe listesinden aşımda olan kategorileri döner.
 * @param {Array<{cat: string, spent: number, limit: number}>} budgets
 * @returns {Array<{cat: string, spent: number, limit: number, overBy: number, pct: number}>}
 */
export function getOverflowingBudgets(budgets) {
  return budgets
    .filter((b) => b.spent > b.limit)
    .map((b) => ({
      cat: b.cat,
      spent: b.spent,
      limit: b.limit,
      overBy: b.spent - b.limit,
      pct: Math.round((b.spent / b.limit) * 100)
    }));
}

/**
 * Harcama oranını 0-100 arasında döner (100'ü aşabilir).
 * @param {number} spent
 * @param {number} limit
 * @returns {number}
 */
export function spendingPercent(spent, limit) {
  if (!limit) return 0;
  return Math.round((spent / limit) * 100);
}

/**
 * Dashboard'daki bütçe aşımı uyarısını günceller.
 * app.js'deki window.budgets değişkenini okur.
 */
export function initBudgetModule() {
  const budgets = window.budgets;
  if (!Array.isArray(budgets) || !budgets.length) return;

  const overflowing = getOverflowingBudgets(budgets);
  const badge = document.getElementById("budget-overflow-badge");
  if (!badge) return;

  if (overflowing.length > 0) {
    badge.textContent = overflowing.length;
    badge.style.display = "inline-flex";
    badge.title = overflowing.map((b) => `${b.cat}: %${b.pct}`).join(", ");
  } else {
    badge.style.display = "none";
  }
}
