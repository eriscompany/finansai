import { describe, it, expect, beforeEach } from "vitest";
import { appState, subscribe, publish } from "./state.js";

describe("appState", () => {
  it("varsayılan tema dark'tır", () => {
    expect(appState.preferences.theme).toBe("dark");
  });

  it("varsayılan dil tr'dir", () => {
    expect(appState.preferences.language).toBe("tr");
  });

  it("varsayılan transaction filtresi all'dır", () => {
    expect(appState.filters.transactions.type).toBe("all");
    expect(appState.filters.transactions.category).toBe("all");
    expect(appState.filters.transactions.query).toBe("");
  });
});

describe("subscribe / publish", () => {
  it("listener yayın alır", () => {
    let received = null;
    const unsub = subscribe((state) => { received = state; });
    publish();
    expect(received).toBe(appState);
    unsub();
  });

  it("unsubscribe sonrası listener çağrılmaz", () => {
    let count = 0;
    const unsub = subscribe(() => { count++; });
    publish();
    expect(count).toBe(1);
    unsub();
    publish();
    expect(count).toBe(1);
  });

  it("birden fazla listener desteklenir", () => {
    let a = 0, b = 0;
    const u1 = subscribe(() => { a++; });
    const u2 = subscribe(() => { b++; });
    publish();
    expect(a).toBe(1);
    expect(b).toBe(1);
    u1(); u2();
  });
});
