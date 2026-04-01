import { describe, it, expect } from "vitest";
import { getOverflowingBudgets, spendingPercent } from "./budget.js";

const budgets = [
  { cat: "Fatura", spent: 5469, limit: 6000 },    // %91 → ok
  { cat: "Market", spent: 1860, limit: 2500 },     // %74 → ok
  { cat: "Eğlence", spent: 890, limit: 800 },      // %111 → aşım
];

describe("getOverflowingBudgets", () => {
  it("aşımda olan kategorileri döner", () => {
    const result = getOverflowingBudgets(budgets);
    expect(result).toHaveLength(1);
    expect(result[0].cat).toBe("Eğlence");
  });

  it("overBy doğru hesaplanır", () => {
    const result = getOverflowingBudgets(budgets);
    expect(result[0].overBy).toBe(90);
  });

  it("pct doğru hesaplanır", () => {
    const result = getOverflowingBudgets(budgets);
    expect(result[0].pct).toBe(111);
  });

  it("hiç aşım yoksa boş dizi döner", () => {
    const safe = [
      { cat: "A", spent: 100, limit: 500 },
      { cat: "B", spent: 300, limit: 300 }
    ];
    expect(getOverflowingBudgets(safe)).toHaveLength(0);
  });

  it("boş listede boş dizi döner", () => {
    expect(getOverflowingBudgets([])).toHaveLength(0);
  });
});

describe("spendingPercent", () => {
  it("normal harcama yüzdesini hesaplar", () => {
    expect(spendingPercent(750, 1000)).toBe(75);
  });

  it("aşım durumunda 100'ü aşar", () => {
    expect(spendingPercent(1200, 1000)).toBe(120);
  });

  it("limit 0 ise 0 döner", () => {
    expect(spendingPercent(500, 0)).toBe(0);
  });

  it("harcama 0 ise 0 döner", () => {
    expect(spendingPercent(0, 1000)).toBe(0);
  });
});
