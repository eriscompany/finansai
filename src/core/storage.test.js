import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadAppState, saveAppState } from "./storage.js";

const makeStorage = () => {
  const store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; }
  };
};

describe("loadAppState", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });

  it("boş storage'da boş nesne döner", () => {
    expect(loadAppState()).toEqual({});
  });

  it("kaydedilmiş state'i okur", () => {
    const snap = { version: 1, preferences: { theme: "light", language: "en" }, filters: {} };
    localStorage.setItem("finansai_modular_state_v1", JSON.stringify(snap));
    expect(loadAppState()).toEqual(snap);
  });

  it("bozuk JSON'da boş nesne döner", () => {
    localStorage.setItem("finansai_modular_state_v1", "{{bozuk}}");
    expect(loadAppState()).toEqual({});
  });
});

describe("saveAppState", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });

  it("preferences ve filters kaydeder", () => {
    const state = {
      preferences: { theme: "light", language: "en" },
      filters: { transactions: { type: "gelir", category: "all", query: "" } }
    };
    saveAppState(state);
    const raw = localStorage.getItem("finansai_modular_state_v1");
    const parsed = JSON.parse(raw);
    expect(parsed.preferences.theme).toBe("light");
    expect(parsed.filters.transactions.type).toBe("gelir");
  });

  it("version: 1 ekler", () => {
    saveAppState({ preferences: {}, filters: {} });
    const parsed = JSON.parse(localStorage.getItem("finansai_modular_state_v1"));
    expect(parsed.version).toBe(1);
  });
});
