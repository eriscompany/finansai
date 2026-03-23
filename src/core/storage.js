const STORAGE_KEY = "finansai_modular_state_v1";

export function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveAppState(state) {
  try {
    const snapshot = {
      version: 1,
      preferences: state.preferences,
      filters: state.filters
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore write failures (private mode/full storage).
  }
}
