export async function safeCryptoFetch(url, fallback = null) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return fallback;
    return await resp.json();
  } catch {
    return fallback;
  }
}
