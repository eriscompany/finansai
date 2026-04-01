import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isFresh,
  getCached,
  getStaleIds,
  refreshPrices,
  getSnapshot,
  clearCache,
  DEFAULT_TTL_MS
} from "./cryptoPriceCache.js";

beforeEach(() => {
  clearCache();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-04-01T10:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

// ── isFresh ──────────────────────────────────────────────
describe("isFresh", () => {
  it("cache boşken false döner", () => {
    expect(isFresh("bitcoin")).toBe(false);
  });

  it("yeni eklenen entry fresh'tir", () => {
    // refreshPrices yerine doğrudan cache'e yazmak için mock fetch kullanıyoruz
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      json: async () => ({ lastPrice: "87000", priceChangePercent: "1.5" })
    }));
    return refreshPrices(["bitcoin"], 38.5).then(() => {
      expect(isFresh("bitcoin")).toBe(true);
    });
  });

  it("TTL dolunca stale olur", () => {
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      json: async () => ({ lastPrice: "87000", priceChangePercent: "1.5" })
    }));
    return refreshPrices(["bitcoin"], 38.5).then(() => {
      vi.advanceTimersByTime(DEFAULT_TTL_MS + 1);
      expect(isFresh("bitcoin")).toBe(false);
    });
  });

  it("özel TTL desteklenir", () => {
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      json: async () => ({ lastPrice: "87000", priceChangePercent: "1.5" })
    }));
    return refreshPrices(["bitcoin"], 38.5, 5000).then(() => {
      vi.advanceTimersByTime(4999);
      expect(isFresh("bitcoin", 5000)).toBe(true);
      vi.advanceTimersByTime(2);
      expect(isFresh("bitcoin", 5000)).toBe(false);
    });
  });
});

// ── getCached ─────────────────────────────────────────────
describe("getCached", () => {
  it("cache yoksa null döner", () => {
    expect(getCached("bitcoin")).toBeNull();
  });

  it("fiyat verilerini döner", () => {
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      json: async () => ({ lastPrice: "87000", priceChangePercent: "2.1" })
    }));
    return refreshPrices(["bitcoin"], 38.5).then(() => {
      const entry = getCached("bitcoin");
      expect(entry).not.toBeNull();
      expect(entry.usd).toBe(87000);
      expect(entry.tryAmount).toBeCloseTo(87000 * 38.5, 0);
      expect(entry.change24h).toBe(2.1);
    });
  });
});

// ── getStaleIds ───────────────────────────────────────────
describe("getStaleIds", () => {
  it("hepsi stale — tüm liste döner", () => {
    expect(getStaleIds(["bitcoin", "ethereum"])).toEqual(["bitcoin", "ethereum"]);
  });

  it("fresh coin stale listede olmaz", () => {
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      json: async () => ({ lastPrice: "87000", priceChangePercent: "1" })
    }));
    return refreshPrices(["bitcoin"], 38.5).then(() => {
      const stale = getStaleIds(["bitcoin", "ethereum"]);
      expect(stale).toEqual(["ethereum"]);
    });
  });
});

// ── refreshPrices ─────────────────────────────────────────
describe("refreshPrices", () => {
  it("fiyatları cache'e yazar", async () => {
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      json: async () => ({ lastPrice: "2050", priceChangePercent: "0.8" })
    }));
    await refreshPrices(["ethereum"], 38.5);
    const entry = getCached("ethereum");
    expect(entry.usd).toBe(2050);
  });

  it("tüm coinler fresh ise fetch çağrılmaz", async () => {
    const mockFetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ lastPrice: "87000", priceChangePercent: "1" })
    }));
    vi.stubGlobal("fetch", mockFetch);
    await refreshPrices(["bitcoin"], 38.5);
    const callCount = mockFetch.mock.calls.length;
    await refreshPrices(["bitcoin"], 38.5); // ikinci çağrı — fresh
    expect(mockFetch.mock.calls.length).toBe(callCount); // yeni fetch yok
  });

  it("HTTP hatasında stale veri korunur", async () => {
    // Önce geçerli veri çek
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      json: async () => ({ lastPrice: "87000", priceChangePercent: "1" })
    }));
    await refreshPrices(["bitcoin"], 38.5);
    const staleCached = getCached("bitcoin");

    // TTL geç, sonra hatalı response
    vi.advanceTimersByTime(DEFAULT_TTL_MS + 1);
    vi.stubGlobal("fetch", async () => ({ ok: false, status: 503, json: async () => ({}) }));
    await refreshPrices(["bitcoin"], 38.5);

    // Stale veri hâlâ erişilebilir
    expect(getCached("bitcoin")?.usd).toBe(staleCached.usd);
  });

  it("bilinmeyen cgId sessizce atlanır", async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
    await refreshPrices(["bilinmeyen-coin"], 38.5);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("bir coin başarısız olursa diğerleri etkilenmez", async () => {
    let callCount = 0;
    vi.stubGlobal("fetch", async (url) => {
      callCount++;
      if (url.includes("BTC")) return { ok: false, status: 500, json: async () => ({}) };
      return {
        ok: true,
        json: async () => ({ lastPrice: "2050", priceChangePercent: "0.8" })
      };
    });
    await refreshPrices(["bitcoin", "ethereum"], 38.5);
    expect(getCached("bitcoin")).toBeNull();
    expect(getCached("ethereum")).not.toBeNull();
  });
});

// ── getSnapshot ───────────────────────────────────────────
describe("getSnapshot", () => {
  it("sadece cache'de olan coinleri döner", async () => {
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      json: async () => ({ lastPrice: "87000", priceChangePercent: "1" })
    }));
    await refreshPrices(["bitcoin"], 38.5);
    const snap = getSnapshot(["bitcoin", "ethereum"]);
    expect(snap.has("bitcoin")).toBe(true);
    expect(snap.has("ethereum")).toBe(false);
  });
});
