# Proje İlerleme Kaydı (Process)

## Özet
- Çok dilli frontend (NL/TR/EN) ve güçlü tipografi ile modern portfolyo UI kuruldu.
- Brief akışı 3 adımlı form olarak çalışıyor, dil URL ile korunuyor.
- Node/Express tabanlı TypeScript backend eklendi; Brief ve Project için Mongoose modelleri hazır.
- İlk kurulum sihirbazı (Setup) ile env bilgileri sizden alınarak sunucu yapılandırması otomatik tamamlanıyor.

## Frontend
- Teknoloji: React 19, React Router 7, Vite, TypeScript, TailwindCSS.
- Sayfalar:
  - Home (/): Hero, Featured Projects, Process, Clients, CTA’lar.
  - Projects (/work): Kategori filtreleri, grid ve kartlar.
  - Project Detail (/work/:slug): Kapak, galeri, detaylar.
  - Services (/services): Servis kartları ve Brief’e yönlendirme.
  - About (/about), Contact (/contact): Metin ve iletişim.
  - Brief (/brief): 3 adım (Hizmet seçimi, form, özet + gönder).
- i18n:
  - LanguageContext ile dil durumu ve t(key).
  - TRANSLATIONS, PROJECTS, SERVICES çok dilli içerik taşıyor.
  - Dil seçici Header’da; tüm Link’ler dili URL’de ?lang=... ile koruyor.
- Navigasyon:
  - HashRouter, Routes/Route/Navigate; Link, useLocation.
  - Dil senkronizasyonu: tüm sayfalarda URL parametresi ile korunur.

## Brief Akışı
- Adım mantığı: useState ile step 1→3; submit sonrası success ekranı.
- Form: ortak alanlar (Ad, Email, Telefon ops., Firma ops., Bütçe, Deadline, Mesaj) ve hizmete özel alanlar (Logo için marka adı vb.).
- API entegrasyonu: POST /api/brief’a gönderim; başarıda “Brief Alındı” ekranı.

## Backend (TypeScript + Express)
- Sunucu:
  - Express, CORS, morgan, zod doğrulama.
  - Mongoose bağlantısı (MongoDB_URI verilirse DB’ye bağlanır; yoksa geçici memory fallback).
- Modeller:
  - Brief: serviceType, name, email, phone, company, budgetRange, deadline, message, serviceSpecificData, createdAt.
  - Project: title, slug, category, description, year, coverImage, galleryImages, isFeatured, createdAt.
- Endpoint’ler:
  - POST /api/brief: zod ile doğrulama, DB’ye kaydetme (veya memory).
  - GET /api/projects: proje listesi.
  - GET /api/projects/:slug: tekil proje.

## İlk Kurulum Sihirbazı
- Amaç: Sunucu yapılandırması (MongoDB ve Cloudinary) yoksa kullanıcıdan bilgileri almak.
- API:
  - GET /api/setup/status: configured durumunu döner.
  - POST /api/setup: { MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } değerlerini kaydeder, runtime’a uygular, Mongo bağlantısını dener.
- İstemci:
  - Setup sayfası (/setup): form ile bilgileri alır, başarıda ana sayfaya yönlendirir.
  - Layout guard: yapılandırma yoksa otomatik /setup’a yönlendirir (dil korunur).
- Kalıcılık: server/config.json dosyasında saklanır; env ile birleştirilerek çalışır.

## Cloudinary
- Sunucu tarafı config (cloudinary.v2).
- İlerleyen aşamada proje yükleme (POST /api/projects) akışında uploader ile secure_url kaydı planlanabilir.

## Ortam Değişkenleri
- İstemci: .env.local içinde VITE_API_BASE_URL (default: http://localhost:4000).
- Sunucu: Setup sihirbazı ile config.json’a kaydedilen değerler runtime’da kullanılır; istenirse gerçek .env’e taşınabilir.

## Komutlar
- Frontend geliştirme: `npm run dev` → http://localhost:3000/
- Backend geliştirme: `npm run server` → http://localhost:4000/
- Türkçe ile örnek başlangıç: http://localhost:3000/#/?lang=tr

## Sonraki Adımlar (Öneri)
- /api/projects için POST yükleme akışı ve Cloudinary uploader (form-data).
- Setup formuna “Bağlantı testi” butonu (Mongo ve Cloudinary sağlığını kontrol).
- Brief formu için hizmete özel alanları genişletme (katalog/sosyal medya).
