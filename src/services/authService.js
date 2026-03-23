export function getAuthSessionKey() {
  return "_fa_s7m3p";
}

export function clearSession() {
  localStorage.removeItem(getAuthSessionKey());
}
