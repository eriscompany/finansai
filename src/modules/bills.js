import { daysUntil } from "../utils/date.js";

/**
 * Fatura listesini alıp urgency durumlarını döner.
 * 'urgent': 3 gün veya daha az
 * 'soon'  : 4-10 gün arası
 * 'ok'    : 10 günden fazla
 * @param {Array<{due: string, amount: number, name: string}>} bills
 * @returns {Array<{bill: object, days: number, status: 'urgent'|'soon'|'ok'}>}
 */
export function classifyBills(bills) {
  return bills.map((bill) => {
    const days = daysUntil(bill.due);
    const status = days <= 3 ? "urgent" : days <= 10 ? "soon" : "ok";
    return { bill, days, status };
  });
}

/**
 * Yaklaşan (urgent + soon) fatura sayısını döner.
 * @param {Array} bills
 * @returns {number}
 */
export function countUpcomingBills(bills) {
  return classifyBills(bills).filter((b) => b.status !== "ok").length;
}

/**
 * Dashboard'daki fatura badge'ini günceller.
 * app.js'deki window.bills değişkenini okur.
 */
export function initBillsModule() {
  const bills = window.bills;
  if (!Array.isArray(bills) || !bills.length) return;

  const count = countUpcomingBills(bills);
  const badge = document.getElementById("bills-badge");
  if (!badge) return;

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "inline-flex";
  } else {
    badge.style.display = "none";
  }
}
