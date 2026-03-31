import { describe, it, expect } from "vitest";
import { formatTry, formatDateTR } from "./formatters.js";

describe("formatTry", () => {
  it("pozitif sayıyı ₺ ile formatlar", () => {
    expect(formatTry(1000)).toBe("₺1.000");
  });

  it("negatif sayının mutlak değerini alır", () => {
    expect(formatTry(-1240)).toBe("₺1.240");
  });

  it("sıfırı formatlar", () => {
    expect(formatTry(0)).toBe("₺0");
  });

  it("büyük sayıyı doğru formatlar", () => {
    expect(formatTry(28750)).toBe("₺28.750");
  });

  it("NaN gelirse 0 döner", () => {
    expect(formatTry(NaN)).toBe("₺0");
  });
});

describe("formatDateTR", () => {
  it("tarih stringini Türkçe format ile döner", () => {
    const result = formatDateTR("2026-03-15");
    expect(result).toMatch(/15/);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(3);
  });

  it("farklı aylar için farklı sonuç döner", () => {
    const mar = formatDateTR("2026-03-15");
    const apr = formatDateTR("2026-04-15");
    expect(mar).not.toBe(apr);
  });
});
