// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initDashboardModule } from "./dashboard.js";

// computeMonthlyTotals window.allTx'i okuduğu için stub gerekiyor
const CURRENT_MONTH = "2026-04"; // vitest fake timer ile sabitlenecek

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-04-01T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  delete window.allTx;
});

function makeDOM(netVal = "₺0", incomeVal = "₺0", expenseVal = "₺0") {
  document.body.innerHTML = `
    <div id="page-dashboard">
      <div class="met"><div class="mv">${netVal}</div></div>
      <div class="met"><div class="mv">${incomeVal}</div></div>
      <div class="met"><div class="mv">${expenseVal}</div></div>
    </div>
  `;
}

describe("initDashboardModule", () => {
  it("allTx yoksa kartlar ₺0 gösterir", () => {
    makeDOM();
    window.allTx = [];
    initDashboardModule();
    const cards = document.querySelectorAll("#page-dashboard .met .mv");
    expect(cards[0].textContent).toBe("₺0");
    expect(cards[1].textContent).toBe("₺0");
    expect(cards[2].textContent).toBe("₺0");
  });

  it("bu ayın gelir ve giderini hesaplar", () => {
    makeDOM();
    window.allTx = [
      { amount: 18500, date: "2026-04-01" }, // gelir
      { amount: 3200,  date: "2026-04-05" }, // gelir
      { amount: -1240, date: "2026-04-10" }, // gider
      { amount: -680,  date: "2026-04-12" }, // gider
    ];
    initDashboardModule();
    const cards = document.querySelectorAll("#page-dashboard .met .mv");
    expect(cards[1].textContent).toBe("₺21.700"); // gelir
    expect(cards[2].textContent).toBe("₺1.920");  // gider
    expect(cards[0].textContent).toBe("₺19.780"); // net
  });

  it("geçen ayın işlemlerini saymaz", () => {
    makeDOM();
    window.allTx = [
      { amount: 10000, date: "2026-03-15" }, // geçen ay — sayılmaz
      { amount: 5000,  date: "2026-04-01" }, // bu ay
    ];
    initDashboardModule();
    const cards = document.querySelectorAll("#page-dashboard .met .mv");
    expect(cards[1].textContent).toBe("₺5.000");
  });

  it("gelecek ayın işlemlerini saymaz", () => {
    makeDOM();
    window.allTx = [
      { amount: 10000, date: "2026-05-01" }, // gelecek ay — sayılmaz
      { amount: 3000,  date: "2026-04-20" }, // bu ay
    ];
    initDashboardModule();
    const cards = document.querySelectorAll("#page-dashboard .met .mv");
    expect(cards[1].textContent).toBe("₺3.000");
  });

  it("sayfa yoksa sessizce çıkar", () => {
    document.body.innerHTML = "";
    window.allTx = [{ amount: 1000, date: "2026-04-01" }];
    expect(() => initDashboardModule()).not.toThrow();
  });

  it("net = gelir - gider", () => {
    makeDOM();
    window.allTx = [
      { amount: 10000, date: "2026-04-01" },
      { amount: -3000, date: "2026-04-05" },
    ];
    initDashboardModule();
    const cards = document.querySelectorAll("#page-dashboard .met .mv");
    expect(cards[0].textContent).toBe("₺7.000");
  });
});
