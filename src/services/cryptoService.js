import { reportError } from "../core/errors.js";

export async function safeCryptoFetch(url, fallback = null) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      reportError(`Kripto fiyat alınamadı (HTTP ${resp.status})`, {
        source: "crypto",
        severity: "warning"
      });
      return fallback;
    }
    return await resp.json();
  } catch (cause) {
    reportError("Kripto servisine erişilemiyor", {
      source: "crypto",
      severity: "warning",
      cause
    });
    return fallback;
  }
}
