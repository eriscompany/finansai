// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initDashboardModule } from "./dashboard.js";

const CURRENT_MONTH = "2026-04"; // vitest fake timer ile sabitlenecek

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-04-01T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  delete window.allTx;
});

function makeDOM() {
  document.body.innerHTML = `
    <div id="page-dashboard">
      <div class="dash-hero">
        <div class="dash-hero-left">
          <div id="dash-net">₺0</div>
          <div id="dash-net-trend"></div>
        </div>
        <div class="dash-hero-right">
          <div class="dash-stats-row">
            <div class="dash-stat"><div id="dash-income">₺0</div></div>
            <div class="dash-stat"><div id="dash-expense">₺0</div></div>
            <div class="dash-stat"><div id="dash-savings-rate">—</div></div>
            <div class="dash-stat"><div id="dash-crypto-total">₺—</div></div>
          </div>
          <div class="dash-ratio-wrap">
            <div class="dash-ratio-bar">
              <div id="dash-ratio-income" style="width:50%"></div>
              <div id="dash-ratio-expense" style="width:50%"></div>
            </div>
            <div class="dash-ratio-labels">
              <span><span id="dash-ratio-income-pct"></span></span>
              <span><span id="dash-ratio-expense-pct"></span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

describe("initDashboardModule", () => {
  it("allTx yoksa kartlar ₺0 gösterir", () => {
    makeDOM();
    window.allTx = [];
    initDashboardModule();
    expect(document.querySelector("#dash-net").textContent).toBe("₺0");
    expect(document.querySelector("#dash-income").textContent).toBe("₺0");
    expect(document.querySelector("#dash-expense").textContent).toBe("₺0");
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
    expect(document.querySelector("#dash-income").textContent).toBe("₺21.700"); // gelir
    expect(document.querySelector("#dash-expense").textContent).toBe("₺1.920");  // gider
    expect(document.querySelector("#dash-net").textContent).toBe("₺19.780");    // net
  });

  it("geçen ayın işlemlerini saymaz", () => {
    makeDOM();
    window.allTx = [
      { amount: 10000, date: "2026-03-15" }, // geçen ay — sayılmaz
      { amount: 5000,  date: "2026-04-01" }, // bu ay
    ];
    initDashboardModule();
    expect(document.querySelector("#dash-income").textContent).toBe("₺5.000");
  });

  it("gelecek ayın işlemlerini saymaz", () => {
    makeDOM();
    window.allTx = [
      { amount: 10000, date: "2026-05-01" }, // gelecek ay — sayılmaz
      { amount: 3000,  date: "2026-04-20" }, // bu ay
    ];
    initDashboardModule();
    expect(document.querySelector("#dash-income").textContent).toBe("₺3.000");
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
    expect(document.querySelector("#dash-net").textContent).toBe("₺7.000");
  });

  it("tasarruf oranı hesaplanır", () => {
    makeDOM();
    window.allTx = [
      { amount: 10000, date: "2026-04-01" },
      { amount: -3000, date: "2026-04-05" },
    ];
    initDashboardModule();
    // net = 7000, income = 10000 → oran = %70.0
    expect(document.querySelector("#dash-savings-rate").textContent).toBe("%70.0");
  });

  it("gelir yoksa tasarruf oranı — gösterir", () => {
    makeDOM();
    window.allTx = [];
    initDashboardModule();
    expect(document.querySelector("#dash-savings-rate").textContent).toBe("—");
  });

  it("ratio bar gelir > gider ise income > 50%", () => {
    makeDOM();
    window.allTx = [
      { amount: 8000, date: "2026-04-01" },
      { amount: -2000, date: "2026-04-05" },
    ];
    initDashboardModule();
    const incomeBar = document.querySelector("#dash-ratio-income");
    const pct = parseInt(incomeBar.style.width);
    expect(pct).toBeGreaterThan(50);
  });
});
