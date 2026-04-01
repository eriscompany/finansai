import { reportError } from "../core/errors.js";

export async function safeCalendarPost(url, token, body) {
  if (!token) return null;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      reportError(`Takvim güncellenemedi (HTTP ${resp.status})`, {
        source: "calendar",
        severity: "warning"
      });
      return null;
    }
    return await resp.json();
  } catch (cause) {
    reportError("Takvim servisine erişilemiyor", {
      source: "calendar",
      severity: "warning",
      cause
    });
    return null;
  }
}
