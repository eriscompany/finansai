const SESSION_KEY = "_fa_s7m3p";

export function getAuthSessionKey() {
  return SESSION_KEY;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * localStorage'dan session nesnesini okur ve geçerliliğini kontrol eder.
 * FinansAuth ile aynı key ve expiresAt mantığını kullanır.
 * @returns {object|null}
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || typeof session !== "object") return null;
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Geçerli bir oturum var mı?
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getSession() !== null;
}

/**
 * Oturum açık kullanıcının adını döner.
 * @returns {string|null}
 */
export function getUsername() {
  return getSession()?.username ?? null;
}

/**
 * Oturum açık kullanıcının rolünü döner ('admin' | 'user' | null).
 * @returns {string|null}
 */
export function getRole() {
  return getSession()?.role ?? null;
}

/**
 * Kullanıcının admin olup olmadığını döner.
 * @returns {boolean}
 */
export function isAdmin() {
  return getRole() === "admin";
}
