/**
 * Kripto fiyat cache servisi.
 *
 * app.js'deki fetchCryptoPrices'ın sorunlarını çözer:
 *  - Per-coin TTL: her coin bağımsız olarak stale/fresh kontrol edilir
 *  - Kısmi güncelleme: sadece eski coinler yeniden çekilir
 *  - Stale koruma: API hatasında mevcut cache silinmez
 *  - symbols.indexOf bug yok: cgId→sembol Map kullanılır
 */

import { reportError } from "../core/errors.js";

/** cgId → Binance sembol eşlemesi */
export const CG_TO_BINANCE = {
  bitcoin: "BTCUSDT",
  ripple: "XRPUSDT",
  ethereum: "ETHUSDT",
  solana: "SOLUSDT",
  "terra-luna-classic": "LUNCUSDT",
  cardano: "ADAUSDT",
  dogecoin: "DOGEUSDT",
  polkadot: "DOTUSDT",
  avalanche: "AVAXUSDT",
  chainlink: "LINKUSDT",
  litecoin: "LTCUSDT",
  "shiba-inu": "SHIBUSDT",
  matic: "MATICUSDT",
  kaspa: "KASUSDT",
  tron: "TRXUSDT",
  toncoin: "TONUSDT",
  "sonic-3": "SUSDT"
};

/** Varsayılan cache süresi: 30 saniye */
export const DEFAULT_TTL_MS = 30_000;

/**
 * @typedef {Object} PriceEntry
 * @property {number} usd
 * @property {number} tryAmount   — TRY karşılığı
 * @property {number} change24h   — 24s % değişim
 * @property {number} fetchedAt   — epoch ms
 */

/** @type {Map<string, PriceEntry>} */
const _cache = new Map();

/**
 * Belirtilen coin için cache'de güncel veri var mı?
 * @param {string} cgId
 * @param {number} [ttlMs]
 * @returns {boolean}
 */
export function isFresh(cgId, ttlMs = DEFAULT_TTL_MS) {
  const entry = _cache.get(cgId);
  return !!entry && Date.now() - entry.fetchedAt < ttlMs;
}

/**
 * Cache'den coin fiyatını döner (stale olsa bile).
 * @param {string} cgId
 * @returns {PriceEntry|null}
 */
export function getCached(cgId) {
  return _cache.get(cgId) ?? null;
}

/**
 * Verilen ID listesinden stale olanları döner.
 * @param {string[]} ids
 * @param {number} [ttlMs]
 * @returns {string[]}
 */
export function getStaleIds(ids, ttlMs = DEFAULT_TTL_MS) {
  return ids.filter((id) => !isFresh(id, ttlMs));
}

/**
 * Belirtilen coinlerin fiyatlarını Binance'den çeker.
 * Sadece stale coinler güncellenir; başarısız olanlar mevcut cache'de kalır.
 *
 * @param {string[]} ids           — cgId listesi
 * @param {number}   usdTry        — mevcut USD/TRY kuru
 * @param {number}   [ttlMs]       — cache süresi (ms)
 * @returns {Promise<Map<string, PriceEntry>>} güncel cache snapshot
 */
export async function refreshPrices(ids, usdTry, ttlMs = DEFAULT_TTL_MS) {
  const stale = getStaleIds(ids, ttlMs);

  if (!stale.length) return getSnapshot(ids);

  // cgId → Binance sembol Map (indexOf bug yok)
  const idToSymbol = new Map(
    stale.map((id) => [id, CG_TO_BINANCE[id]]).filter(([, sym]) => sym)
  );

  const fetches = Array.from(idToSymbol.entries()).map(async ([cgId, sym]) => {
    try {
      const resp = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`
      );
      if (!resp.ok) {
        reportError(`${cgId} fiyatı alınamadı (HTTP ${resp.status})`, {
          source: "crypto",
          severity: "warning"
        });
        return;
      }
      const data = await resp.json();
      if (!data.lastPrice) return;

      const usd = parseFloat(data.lastPrice);
      _cache.set(cgId, {
        usd,
        tryAmount: usd * usdTry,
        change24h: parseFloat(data.priceChangePercent) || 0,
        fetchedAt: Date.now()
      });
    } catch (cause) {
      reportError(`${cgId} fiyatı çekilemedi`, {
        source: "crypto",
        severity: "warning",
        cause
      });
    }
  });

  await Promise.allSettled(fetches);

  return getSnapshot(ids);
}

/**
 * İstenen ID'ler için mevcut cache snapshot'ını döner.
 * @param {string[]} ids
 * @returns {Map<string, PriceEntry>}
 */
export function getSnapshot(ids) {
  const result = new Map();
  for (const id of ids) {
    const entry = _cache.get(id);
    if (entry) result.set(id, entry);
  }
  return result;
}

/**
 * Cache'i tamamen temizler (test için).
 */
export function clearCache() {
  _cache.clear();
}
