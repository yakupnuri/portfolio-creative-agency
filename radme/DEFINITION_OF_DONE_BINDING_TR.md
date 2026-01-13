# DEFINITION_OF_DONE (Bağlayıcı)

Bir görev/özellik, aşağıdaki maddelerin tamamı sağlanmadan “Bitti” sayılmaz.

## 1) İşlevsellik
- Kullanıcı akışı ve kabul kriterleri çalışıyor
- Boş/yükleniyor/hata durumları var
- Kırık route/link yok

## 2) UI/UX
- STYLEGUIDE.md ile uyumlu
- Mobil + tablet + masaüstü kontrol edildi
- Klavye ile kullanım + focus-visible var, WCAG AA kontrast

## 3) Kod Kalitesi
- TypeScript: gerekçesiz `any` yok
- Ölü kod / yorum satırı bırakılmadı
- 2+ tekrar eden yapı component’e çıkarıldı
- İsimlendirme + klasör yapısı standart

## 4) Veri & Güvenlik
- Input doğrulama var (gerekliyse client + server)
- Auth/izin kontrolü doğru (açık kapı yok)
- Hassas veri loglanmıyor, secret repo’ya yazılmıyor

## 5) i18n
- UI metinleri hardcode değil, i18n dosyalarında
- TR/NL/EN anahtarları eklendi ve ekranda kontrol edildi

## 6) Test & Merge
- Lint/build geçiyor
- En az 1 başarı + 1 hata senaryosu manuel test edildi
- PR notu: ne değişti + nasıl test edilir + (UI varsa) screenshot
