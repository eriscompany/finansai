import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { daysUntil } from "./date.js";

describe("daysUntil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // UTC 12:00:00 — daysUntil("2026-03-31") hedef anla tam eş, fark=0
    vi.setSystemTime(new Date("2026-03-31T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("bugün için 0 döner", () => {
    expect(daysUntil("2026-03-31")).toBe(0);
  });

  it("yarın için 1 döner", () => {
    expect(daysUntil("2026-04-01")).toBe(1);
  });

  it("dün için negatif döner", () => {
    expect(daysUntil("2026-03-30")).toBeLessThan(0);
  });

  it("10 gün sonrası için 10 döner", () => {
    expect(daysUntil("2026-04-10")).toBe(10);
  });
});
