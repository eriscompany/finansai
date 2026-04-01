import { describe, it, expect, beforeEach } from "vitest";
import { onError, reportError, getErrorHistory, clearErrorHistory } from "./errors.js";

beforeEach(() => {
  clearErrorHistory();
});

describe("reportError", () => {
  it("dinleyiciye hata iletir", () => {
    let received = null;
    const unsub = onError((entry) => { received = entry; });
    reportError("Test hatası");
    expect(received).not.toBeNull();
    expect(received.message).toBe("Test hatası");
    unsub();
  });

  it("varsayılan severity 'error'dır", () => {
    let received = null;
    const unsub = onError((e) => { received = e; });
    reportError("hata");
    expect(received.severity).toBe("error");
    unsub();
  });

  it("varsayılan source 'app'dır", () => {
    let received = null;
    const unsub = onError((e) => { received = e; });
    reportError("hata");
    expect(received.source).toBe("app");
    unsub();
  });

  it("özel source ve severity alır", () => {
    let received = null;
    const unsub = onError((e) => { received = e; });
    reportError("kripto hatası", { source: "crypto", severity: "warning" });
    expect(received.source).toBe("crypto");
    expect(received.severity).toBe("warning");
    unsub();
  });

  it("cause iletilir", () => {
    let received = null;
    const cause = new Error("network");
    const unsub = onError((e) => { received = e; });
    reportError("bağlantı hatası", { cause });
    expect(received.cause).toBe(cause);
    unsub();
  });

  it("timestamp eklenir", () => {
    let received = null;
    const before = Date.now();
    const unsub = onError((e) => { received = e; });
    reportError("hata");
    expect(received.timestamp).toBeGreaterThanOrEqual(before);
    unsub();
  });

  it("birden fazla dinleyici desteklenir", () => {
    let a = 0, b = 0;
    const u1 = onError(() => { a++; });
    const u2 = onError(() => { b++; });
    reportError("hata");
    expect(a).toBe(1);
    expect(b).toBe(1);
    u1(); u2();
  });

  it("dinleyicide hata olursa diğerleri etkilenmez", () => {
    let safeCount = 0;
    const u1 = onError(() => { throw new Error("listener crash"); });
    const u2 = onError(() => { safeCount++; });
    expect(() => reportError("hata")).not.toThrow();
    expect(safeCount).toBe(1);
    u1(); u2();
  });
});

describe("onError — unsubscribe", () => {
  it("unsubscribe sonrası dinleyici çağrılmaz", () => {
    let count = 0;
    const unsub = onError(() => { count++; });
    reportError("hata");
    expect(count).toBe(1);
    unsub();
    reportError("hata");
    expect(count).toBe(1);
  });
});

describe("getErrorHistory", () => {
  it("bildirilen hataları saklar", () => {
    reportError("hata 1");
    reportError("hata 2");
    const history = getErrorHistory();
    expect(history).toHaveLength(2);
    expect(history[0].message).toBe("hata 1");
    expect(history[1].message).toBe("hata 2");
  });

  it("kopya dizi döner, orijinali korur", () => {
    reportError("hata");
    const h1 = getErrorHistory();
    h1.push({ fake: true });
    expect(getErrorHistory()).toHaveLength(1);
  });
});

describe("clearErrorHistory", () => {
  it("geçmişi temizler", () => {
    reportError("hata");
    clearErrorHistory();
    expect(getErrorHistory()).toHaveLength(0);
  });
});
