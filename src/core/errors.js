/**
 * Merkezi hata yönetimi — pub/sub tabanlı errorBus.
 *
 * Kullanım:
 *   import { reportError, onError } from './errors.js';
 *
 *   // Dinleyici ekle (genellikle main.js'de bir kez yapılır)
 *   const unsub = onError((entry) => console.warn(entry));
 *
 *   // Hata bildir (herhangi bir modülden)
 *   reportError('Kripto fiyat alınamadı', { source: 'crypto', severity: 'warning' });
 */

/** @typedef {'error'|'warning'|'info'} Severity */

/**
 * @typedef {Object} ErrorEntry
 * @property {string}   message
 * @property {string}   source
 * @property {Severity} severity
 * @property {unknown}  cause
 * @property {number}   timestamp
 */

const listeners = new Set();

/** Son N hatayı tutan geçmiş (debug için). */
const MAX_HISTORY = 50;
const _history = [];

/**
 * Hata dinleyicisi ekler.
 * @param {function(ErrorEntry): void} listener
 * @returns {function(): void} unsubscribe fonksiyonu
 */
export function onError(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Hata bildirir — tüm dinleyicilere iletir.
 * @param {string} message
 * @param {{ source?: string, severity?: Severity, cause?: unknown }} [options]
 */
export function reportError(message, { source = "app", severity = "error", cause = null } = {}) {
  const entry = { message, source, severity, cause, timestamp: Date.now() };

  if (_history.length >= MAX_HISTORY) _history.shift();
  _history.push(entry);

  for (const listener of listeners) {
    try {
      listener(entry);
    } catch {
      // Listener hatası diğer listener'ları etkilemesin
    }
  }
}

/**
 * Kayıtlı hata geçmişini döner (en yeni sonda).
 * @returns {ErrorEntry[]}
 */
export function getErrorHistory() {
  return [..._history];
}

/**
 * Hata geçmişini temizler.
 */
export function clearErrorHistory() {
  _history.length = 0;
}
