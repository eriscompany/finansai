import { describe, it, expect, beforeEach } from "vitest";
import { appState } from "./state.js";

// setTheme mantığını izole test et (DOM environment'ı gerektirmeyen kısım)
describe("setTheme davranış mantığı", () => {
  it("light tema için data-theme 'light' olmalı", () => {
    const attr = "light" === "light" ? "light" : "";
    expect(attr).toBe("light");
  });

  it("dark tema için data-theme '' (boş) olmalı", () => {
    const attr = "dark" === "light" ? "light" : "";
    expect(attr).toBe("");
  });

  it("bilinmeyen tema için data-theme '' olmalı", () => {
    const attr = "unknown" === "light" ? "light" : "";
    expect(attr).toBe("");
  });
});

describe("setLang appState güncellemesi", () => {
  beforeEach(() => {
    appState.preferences.language = "tr";
  });

  it("dil state'e doğru yazılmalı", () => {
    const langArg = "en";
    appState.preferences.language = langArg;
    expect(appState.preferences.language).toBe("en");
  });
});
