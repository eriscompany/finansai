import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAuthSessionKey,
  clearSession,
  getSession,
  isAuthenticated,
  getUsername,
  getRole,
  isAdmin
} from "./authService.js";

const SESSION_KEY = "_fa_s7m3p";

const makeStorage = () => {
  const store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; }
  };
};

const futureExpiry = () => Date.now() + 30 * 60 * 1000;
const pastExpiry = () => Date.now() - 1000;

function storeSession(storage, overrides = {}) {
  const session = {
    token: "abc123",
    username: "yasin",
    role: "admin",
    loginAt: Date.now(),
    expiresAt: futureExpiry(),
    ...overrides
  };
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

describe("getAuthSessionKey", () => {
  it("doğru session key döner", () => {
    expect(getAuthSessionKey()).toBe("_fa_s7m3p");
  });
});

describe("getSession", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });

  it("session yoksa null döner", () => {
    expect(getSession()).toBeNull();
  });

  it("geçerli session döner", () => {
    storeSession(localStorage);
    const s = getSession();
    expect(s).not.toBeNull();
    expect(s.username).toBe("yasin");
  });

  it("süresi dolmuş session null döner ve temizlenir", () => {
    storeSession(localStorage, { expiresAt: pastExpiry() });
    expect(getSession()).toBeNull();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("bozuk JSON'da null döner", () => {
    localStorage.setItem(SESSION_KEY, "{{bozuk}}");
    expect(getSession()).toBeNull();
  });
});

describe("isAuthenticated", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });

  it("session yokken false döner", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("geçerli session varken true döner", () => {
    storeSession(localStorage);
    expect(isAuthenticated()).toBe(true);
  });
});

describe("getUsername / getRole / isAdmin", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });

  it("getUsername session'dan kullanıcı adı döner", () => {
    storeSession(localStorage, { username: "testuser" });
    expect(getUsername()).toBe("testuser");
  });

  it("getRole 'admin' döner", () => {
    storeSession(localStorage, { role: "admin" });
    expect(getRole()).toBe("admin");
  });

  it("getRole 'user' döner", () => {
    storeSession(localStorage, { role: "user" });
    expect(getRole()).toBe("user");
  });

  it("isAdmin admin için true döner", () => {
    storeSession(localStorage, { role: "admin" });
    expect(isAdmin()).toBe(true);
  });

  it("isAdmin user için false döner", () => {
    storeSession(localStorage, { role: "user" });
    expect(isAdmin()).toBe(false);
  });

  it("session yokken getUsername null döner", () => {
    expect(getUsername()).toBeNull();
  });
});

describe("clearSession", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });

  it("session'ı temizler", () => {
    storeSession(localStorage);
    expect(isAuthenticated()).toBe(true);
    clearSession();
    expect(isAuthenticated()).toBe(false);
  });
});
