/**
 * FinansAI — Güvenlik Katmanı (auth.js)
 * ─────────────────────────────────────────────────────────
 * Yöntemler:
 *  • PBKDF2-SHA256  — şifre hash (310.000 iterasyon, NIST önerileri)
 *  • AES-256-GCM    — uygulama verisi şifreleme
 *  • WebCrypto API  — tarayıcı native, sıfır bağımlılık
 *  • Brute-force    — 5 hatalı giriş → 15 dk kilit
 *  • Session token  — 30 dk hareketsizlik → otomatik çıkış
 *  • Multi-user     — admin + kullanıcı rolleri
 * ─────────────────────────────────────────────────────────
 */

const FinansAuth = (() => {
  'use strict';

  // ── İç Sabitler (karartılmış storage anahtarları) ──────
  const _K = {
    USERS:   '_fa_u2x9k',
    SESSION: '_fa_s7m3p',
    LOCKS:   '_fa_l4q8r',
    DATA:    '_fa_d1n5v',
    SALT:    '_fa_t6w2z',
  };

  const CFG = {
    PBKDF2_ITER:    310_000,
    PBKDF2_HASH:    'SHA-256',
    KEY_LENGTH:     256,
    SESSION_MS:     30 * 60 * 1000,   // 30 dakika
    MAX_ATTEMPTS:   5,
    LOCK_MS:        15 * 60 * 1000,   // 15 dakika kilit
    TOKEN_BYTES:    32,
  };

  // ── WebCrypto yardımcıları ─────────────────────────────
  const crypto = window.crypto || window.msCrypto;
  const subtle = crypto.subtle;

  function rndBytes(n) {
    return crypto.getRandomValues(new Uint8Array(n));
  }

  function buf2hex(buf) {
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function hex2buf(hex) {
    const arr = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) arr[i/2] = parseInt(hex.slice(i,i+2),16);
    return arr.buffer;
  }

  function str2buf(s) { return new TextEncoder().encode(s); }
  function buf2str(b) { return new TextDecoder().decode(b); }

  // ── PBKDF2 — Şifre → Anahtar türetme ──────────────────
  async function deriveKey(password, saltHex) {
    const salt = hex2buf(saltHex);
    const baseKey = await subtle.importKey(
      'raw', str2buf(password), 'PBKDF2', false, ['deriveKey']
    );
    return subtle.deriveKey(
      { name:'PBKDF2', salt, iterations: CFG.PBKDF2_ITER, hash: CFG.PBKDF2_HASH },
      baseKey,
      { name:'AES-GCM', length: CFG.KEY_LENGTH },
      false,
      ['encrypt','decrypt']
    );
  }

  // ── AES-GCM — Şifreleme ────────────────────────────────
  async function encrypt(plaintext, key) {
    const iv = rndBytes(12);
    const cipher = await subtle.encrypt(
      { name:'AES-GCM', iv },
      key,
      str2buf(typeof plaintext === 'string' ? plaintext : JSON.stringify(plaintext))
    );
    // iv(24 hex) + ':' + ciphertext(hex)
    return buf2hex(iv.buffer) + ':' + buf2hex(cipher);
  }

  async function decrypt(token, key) {
    const [ivHex, dataHex] = token.split(':');
    const plain = await subtle.decrypt(
      { name:'AES-GCM', iv: new Uint8Array(hex2buf(ivHex)) },
      key,
      hex2buf(dataHex)
    );
    return buf2str(plain);
  }

  // ── Şifre Hash (verification için) ────────────────────
  async function hashPassword(password, saltHex) {
    const key = await deriveKey(password, saltHex);
    // Key materyalini doğrulama için AES-GCM ile sabit değer şifrele
    const verifier = await subtle.encrypt(
      { name:'AES-GCM', iv: new Uint8Array(12) }, // sabit IV sadece verifier için
      key,
      str2buf('finansai_verify_2026')
    );
    return buf2hex(verifier);
  }

  // ── Storage yardımcıları ───────────────────────────────
  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }
  function lsSet(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  function lsDel(key) { localStorage.removeItem(key); }

  // ── Brute-force koruması ──────────────────────────────
  function getLocks() { return lsGet(_K.LOCKS) || {}; }

  function isLocked(username) {
    const locks = getLocks();
    const entry = locks[username];
    if (!entry) return false;
    if (entry.lockUntil && Date.now() < entry.lockUntil) return { locked: true, remaining: Math.ceil((entry.lockUntil - Date.now()) / 60000) };
    if (entry.lockUntil && Date.now() >= entry.lockUntil) {
      // Kilit süresi doldu, sıfırla
      delete locks[username];
      lsSet(_K.LOCKS, locks);
      return false;
    }
    return false;
  }

  function recordAttempt(username, success) {
    const locks = getLocks();
    if (success) {
      delete locks[username];
    } else {
      locks[username] = locks[username] || { attempts: 0 };
      locks[username].attempts = (locks[username].attempts || 0) + 1;
      if (locks[username].attempts >= CFG.MAX_ATTEMPTS) {
        locks[username].lockUntil = Date.now() + CFG.LOCK_MS;
      }
    }
    lsSet(_K.LOCKS, locks);
    return locks[username]?.attempts || 0;
  }

  // ── Kullanıcı yönetimi ─────────────────────────────────
  function getUsers() { return lsGet(_K.USERS) || {}; }

  async function createUser(username, password, role = 'user', createdBy = null) {
    const users = getUsers();
    if (users[username]) throw new Error('Kullanıcı adı zaten mevcut');
    if (password.length < 8) throw new Error('Şifre en az 8 karakter olmalı');
    if (!/[A-Z]/.test(password)) throw new Error('Şifre en az 1 büyük harf içermeli');
    if (!/[0-9]/.test(password)) throw new Error('Şifre en az 1 rakam içermeli');

    const saltHex = buf2hex(rndBytes(32).buffer);
    const hash = await hashPassword(password, saltHex);
    const encKey = buf2hex(rndBytes(32).buffer); // kullanıcıya özgü data key seed

    users[username] = {
      role,        // 'admin' | 'user'
      saltHex,
      hash,
      encKey,
      createdAt: Date.now(),
      createdBy,
      lastLogin: null,
    };
    lsSet(_K.USERS, users);
    return true;
  }

  // ── Giriş ──────────────────────────────────────────────
  async function login(username, password) {
    const lockCheck = isLocked(username);
    if (lockCheck) throw new Error(`Hesap kilitli. ${lockCheck.remaining} dakika bekleyin.`);

    const users = getUsers();
    const user  = users[username];
    if (!user) {
      recordAttempt(username, false);
      throw new Error('Kullanıcı adı veya şifre hatalı');
    }

    let hash;
    try { hash = await hashPassword(password, user.saltHex); }
    catch { throw new Error('Kimlik doğrulama hatası'); }

    if (hash !== user.hash) {
      const attempts = recordAttempt(username, false);
      const remaining = CFG.MAX_ATTEMPTS - attempts;
      if (remaining <= 0) throw new Error(`Hesap 15 dakika kilitlendi.`);
      throw new Error(`Şifre hatalı. ${remaining} deneme hakkınız kaldı.`);
    }

    recordAttempt(username, true);

    // Session token üret
    const token = buf2hex(rndBytes(CFG.TOKEN_BYTES).buffer);
    const session = {
      token,
      username,
      role: user.role,
      encKey: user.encKey,
      loginAt: Date.now(),
      expiresAt: Date.now() + CFG.SESSION_MS,
      lastActive: Date.now(),
    };
    lsSet(_K.SESSION, session);

    // Son giriş güncelle
    users[username].lastLogin = Date.now();
    lsSet(_K.USERS, users);

    return session;
  }

  // ── Session kontrol ────────────────────────────────────
  function getSession() {
    const s = lsGet(_K.SESSION);
    if (!s) return null;
    if (Date.now() > s.expiresAt) { logout(); return null; }
    // Hareketsizlik süresi yenile
    s.lastActive = Date.now();
    s.expiresAt  = Date.now() + CFG.SESSION_MS;
    lsSet(_K.SESSION, s);
    return s;
  }

  function logout() {
    lsDel(_K.SESSION);
  }

  // ── Şifre değiştir ────────────────────────────────────
  async function changePassword(username, oldPassword, newPassword) {
    const users = getUsers();
    const user  = users[username];
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const oldHash = await hashPassword(oldPassword, user.saltHex);
    if (oldHash !== user.hash) throw new Error('Mevcut şifre hatalı');

    if (newPassword.length < 8) throw new Error('Yeni şifre en az 8 karakter olmalı');
    if (!/[A-Z]/.test(newPassword)) throw new Error('Büyük harf gerekli');
    if (!/[0-9]/.test(newPassword)) throw new Error('Rakam gerekli');

    const newSalt = buf2hex(rndBytes(32).buffer);
    const newHash = await hashPassword(newPassword, newSalt);
    users[username].saltHex = newSalt;
    users[username].hash    = newHash;
    lsSet(_K.USERS, users);
    logout();
    return true;
  }

  // ── Admin — Kullanıcı sil ─────────────────────────────
  function deleteUser(username, requestedBy) {
    const session = getSession();
    if (!session || session.role !== 'admin') throw new Error('Yetersiz yetki');
    if (username === requestedBy) throw new Error('Kendinizi silemezsiniz');
    const users = getUsers();
    delete users[username];
    lsSet(_K.USERS, users);
  }

  // ── İlk kurulum kontrolü ──────────────────────────────
  function needsSetup() {
    const users = getUsers();
    return Object.keys(users).length === 0;
  }

  function listUsers() {
    const session = getSession();
    if (!session || session.role !== 'admin') return [];
    const users = getUsers();
    return Object.entries(users).map(([username, u]) => ({
      username,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    }));
  }

  // ── Public API ─────────────────────────────────────────
  return { createUser, login, logout, getSession, changePassword, deleteUser, needsSetup, listUsers, isLocked };
})();
