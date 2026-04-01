import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { classifyBills, countUpcomingBills } from "./bills.js";

describe("classifyBills", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-31T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const bills = [
    { name: "Doğalgaz", amount: 420, due: "2026-03-31" },   // bugün → 0 gün → urgent
    { name: "Su", amount: 185, due: "2026-04-03" },          // 3 gün → urgent
    { name: "Telefon", amount: 399, due: "2026-04-07" },     // 7 gün → soon
    { name: "Sigorta", amount: 3667, due: "2026-04-15" }     // 15 gün → ok
  ];

  it("urgency durumlarını doğru hesaplar", () => {
    const result = classifyBills(bills);
    expect(result[0].status).toBe("urgent");
    expect(result[1].status).toBe("urgent");
    expect(result[2].status).toBe("soon");
    expect(result[3].status).toBe("ok");
  });

  it("gün sayısını doğru hesaplar", () => {
    const result = classifyBills(bills);
    expect(result[0].days).toBe(0);
    expect(result[1].days).toBe(3);
    expect(result[2].days).toBe(7);
    expect(result[3].days).toBe(15);
  });

  it("orijinal fatura nesnesini döner", () => {
    const result = classifyBills(bills);
    expect(result[0].bill).toBe(bills[0]);
  });
});

describe("countUpcomingBills", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-31T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("urgent + soon faturaları sayar", () => {
    const bills = [
      { due: "2026-03-31" }, // urgent
      { due: "2026-04-03" }, // urgent
      { due: "2026-04-07" }, // soon
      { due: "2026-04-15" }  // ok → sayılmaz
    ];
    expect(countUpcomingBills(bills)).toBe(3);
  });

  it("boş listede 0 döner", () => {
    expect(countUpcomingBills([])).toBe(0);
  });

  it("hepsi ok olursa 0 döner", () => {
    const bills = [{ due: "2026-05-01" }, { due: "2026-06-01" }];
    expect(countUpcomingBills(bills)).toBe(0);
  });
});
