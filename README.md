[README.md](https://github.com/user-attachments/files/26128799/README.md)
# FinansAI — GitHub Pages Kurulum Rehberi

Tahmini süre: **5 dakika**

---

## Adım 1 — GitHub Hesabı

1. [github.com](https://github.com) adresine git
2. **Sign up** → kullanıcı adı, e-posta, şifre gir
3. E-posta doğrula (gelen e-postadaki linke tıkla)

> Zaten hesabın varsa bu adımı atla.

---

## Adım 2 — Yeni Repo Oluştur

1. GitHub'a giriş yap
2. Sağ üstteki **＋** butonuna tıkla → **New repository**
3. Şu şekilde doldur:
   - **Repository name:** `finansai`
   - **Visibility:** ✅ **Public** (Pages için şart)
   - **Add a README file:** ✅ işaretle
4. **Create repository** butonuna tıkla

---

## Adım 3 — Dosyayı Yükle

1. Repo sayfasında **Add file** → **Upload files** tıkla
2. `finansai_v3.html` dosyasını sürükle bırak
3. **⚠️ ÖNEMLİ:** Dosyayı yüklemeden önce adını `index.html` olarak değiştir
   - Veya upload ettikten sonra rename edebilirsin
4. Alt kısımda **Commit changes** butonuna tıkla

---

## Adım 4 — GitHub Pages'i Aktif Et

1. Repo sayfasında üstteki **Settings** sekmesine tıkla
2. Sol menüden **Pages** seçeneğine git
3. **Branch** bölümünde: `main` seç → `/root` seç → **Save**
4. Birkaç dakika bekle

---

## Adım 5 — Sitenin Hazır Olduğunu Kontrol Et

Adresin şu formatta olacak:

```
https://KULLANICI_ADIN.github.io/finansai
```

Örnek: `https://yasin-eris.github.io/finansai`

> GitHub Pages genellikle 1-3 dakika içinde yayına girer.
> Settings → Pages sayfasında yeşil "Your site is live at..." mesajı çıkınca hazır demektir.

---

## Güncelleme Nasıl Yapılır?

Yeni bir `index.html` dosyası yüklemen yeterli:

1. Repo sayfasına git
2. `index.html` dosyasına tıkla
3. Sağ üstteki kalem (✏️) ikonuna tıkla → **Edit**
4. Veya: **Add file** → **Upload files** → yeni dosyayı sürükle (eskinin üzerine yazar)

---

## Sık Sorulan Sorular

**Sitem açılmıyor, ne yapmalıyım?**
- Settings → Pages → "Your site is live" mesajını bekle (max 5 dk)
- Adres barında `https://` ile başladığından emin ol

**Kripto fiyatları neden güncellenmiyor?**
- CoinGecko ücretsiz API'si saatte 5-10 istek limitine sahip
- Sayfayı sık yenilemek yerine ↻ butonunu kullan

**Google Takvim entegrasyonu çalışıyor mu?**
- Claude.ai üzerinden açıldığında çalışır (mevcut durum)
- GitHub Pages'den açıldığında Calendar API için ek kurulum gerekir
- Aşağıdaki "Google Takvim Kurulumu" bölümüne bak

---

## Google Takvim — GitHub Pages Kurulumu (İsteğe Bağlı)

GitHub Pages'den Calendar API'yi kullanmak için Google Cloud Console'da proje oluşturman gerekir:

1. [console.cloud.google.com](https://console.cloud.google.com) → New Project
2. APIs & Services → Enable APIs → **Google Calendar API** aktif et
3. Credentials → Create Credentials → **OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Authorized origins: `https://KULLANICI_ADIN.github.io`
6. Oluşturulan **Client ID**'yi `index.html` içindeki `GOOGLE_CLIENT_ID` alanına yapıştır

> Bu adım olmadan uygulama Calendar'a bağlanamaz ama diğer tüm özellikler çalışır.
