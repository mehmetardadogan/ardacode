# Canlı Log Merkezi

Yönetim paneli: `/admin/izleme`. Ayrı güvenlik görünümü: `/admin/izleme?category=security`.
Bu ekleme mevcut Laravel 12 / Inertia 3 / React / TypeScript uygulamasını genişletir.

## Çalışma şekli

- Olaylar Neon PostgreSQL üzerinde `system_events` tablosunda kalıcıdır. Yerel dosya veya sürekli çalışan worker gerekmez.
- Panel 8 saniyede bir son 50 kaydı ve gerçek istatistikleri alır. Bu gecikmeli polling'dir; milisaniyelik yayın iddiası yoktur.
- Aynı anda yalnızca bir istek çalışır. Gizli sekmelerde ve duraklatıldığında istek yapılmaz. Hatalarda 16/32/60 saniyeye kadar artan bekleme uygulanır. 401/403 sonrası yeniden giriş gerekir.
- Eski kayıtlar ID imleciyle sayfalanır. Geçmiş sayfalarda akış yenilenmez. CSV geçerli filtrelerden en çok 5.000 kayıt indirir.
- Hatalar olay türü, kaynak, normalize sayfa, HTTP kodu, takma adlı oturum ve saat bazında gruplanır. Tekrarlar sayılır, yeniden görülürse kapatılan kayıt açılır. Yeni hata görülene kadar mevcut kapanış durumu korunur.
- Tarayıcı yeniden denemeleri rastgele olay ID'leriyle ayıklanır; son 30 günlük / en çok 100.000 alım makbuzu tutulur.
- Hata grupları `last_seen_at`, trafik verileri `occurred_at` zamanına göre değerlendirilir. Son 24 saat grafikleri ve 7 günlük trafik yalnızca kaydedilen gerçek olaylardan oluşur.

## Ziyaretçi ölçümünün sınırları

İsteğe bağlı analitik varsayılan olarak kapalıdır. Eşit ağırlıklı kabul/ret düğmeleri vardır. Tercih yerel depolamada 180 gün, ziyaret kimliği sekme oturumunda tutulur. Ham UUID sunucuda HMAC ile takma adlı kimliğe çevrilir. IP, konum, referrer, URL sorguları, sayfa başlıkları, form içerikleri ve ham hata mesajları izleme tablosuna yazılmaz. Bilinmeyen yollar `/[diğer]` olarak kaydedilir.

Oturum başlangıcı ilk etkinlikte veya 30 dakika hareketsizlikten sonra kaydedilir. “Aktif” sayısı son 5 dakikada etkinlik bildiren oturumların tahminidir; tekil kişi sayısı değildir. Görünür sekmeler dakikada bir yaşam sinyali gönderir. `pagehide` kapanış sinyali en iyi çabadır; kesin oturum bitişi değildir. Tam sayfa yenilemesi aynı oturumu yeni ziyaret saymaz.

İzin geri alındığında ilgili sekmenin kayıtları silinir. HMAC kimlikli iptal kaydı geç gelen isteklerin bu oturumu yeniden yaratmasını engeller. Tarayıcı storage kapalıysa ölçüm yapılmaz. Zorunlu güvenlik, sunucu hata ve yönetici denetim kayıtları isteğe bağlı ziyaret analitiğinden bağımsızdır.

Tarayıcı olayları üçüncü kişilerce taklit edilebilir; `source=browser`, `reported_by=browser_unverified` olarak işaretlenir. Denetlenmiş satış/dönüşüm muhasebesi değildir. İzin vermeyen ziyaretçilerin tarayıcı olayları grafiklere dahil edilmez.

## Formspree

Mevcut `https://formspree.io/f/xaeeqjdq` adresi korunur. Başlatıldı, HTTP yanıtı, kabul ve hata olayları bir `attempt_identifier` ile ilişkilendirilir. Form alanları loglara eklenmez. Başarılı sağlayıcı yanıtı yalnızca gönderimin kabulünü belirtir; e-posta teslimatı doğrulanmaz. Sağlayıcı webhook'u eklenmedi. Sunucu arşiv kaydı ayrıca `form_archived` olarak sayılır; Formspree kabul sayısına tekrar eklenmez. Gerçek sağlayıcıya test e-postası gönderilmez; otomasyon sağlayıcı yanıtlarını yerel testte taklit eder.

## Yetkiler ve denetim

`users.monitoring_role`: `admin` (oku, durum değiştir, dışa aktar), `analyst` (yalnız oku), `none` (erişim yok). Migration yalnızca bu önceden admin-only uygulamadaki mevcut hesaplara `admin` rolü verir; yeni hesaplar `none` ile başlar. Bu alan mass-assignment'a açık değildir. Rol ataması ancak güvenilir uygulama/CLI işlemiyle `forceFill` veya açık veritabanı yönetimi üzerinden yapılır. Yeni bir herkese açık yetki düzenleme uç noktası eklenmez. Eloquent üzerinden rol değişikliği kritik inceleme olayı üretir; doğrudan SQL değişiklikleri uygulama olaylarını atlayabilir, bunun için sağlayıcı düzeyinde DB denetimi gerekir.

Tüm okuma uç noktaları oturum + Gate + rate limit ile korunur. Durum değişimi CSRF gerektirir. Veri yanıtları `private, no-store` döner. Dışa aktarma formül enjeksiyonunu etkisizleştirir. Panel açılması, tekil olay okunması, durum değişimi ve CSV indirme ayrıca denetlenir. Her polling isteği ayrıca loglanmaz.

Giriş başarı/başarısızlık/çıkışları, proje/hizmet işlemleri, ayarlar ve görsel yüklemeleri kaydedilir. Bir başarısız giriş `WARNING`'dir; otomatik saldırı tanısı konulmaz. HTTP 403/404/419/429/5xx ve uygulama/veritabanı istisnaları güvenli sabit özetlerle yazılır. Ham SQL, stack trace, credential, cookie veya exception mesajı bu merkeze veya yeni stderr fallback kaydına taşınmaz.

## Saklama ve arıza davranışı

30 gün görünür saklama; temizlemede en çok 50.000 olay ve 50.000 oturum. Makbuzlar en çok 100.000. Onay iptal kimlikleri 30 gün tutulur. Bir global veritabanı lease'i ile olay alımında / panel okumasında 10 dakikada bir temizleme denenir. Bu aralıkta sınır kısa süreli aşılabilir. Trafik olmasa bile Vercel Cron her gün 02:00 UTC'de `/internal/monitoring/prune` yolunu çağırır. Fiziksel silme için günlük cron aralığı kadar gecikme olabilir; süresi dolan olaylar liste, ayrıntı ve CSV API'sinde gösterilmez.

Cron `Authorization: Bearer CRON_SECRET` gerektirir; en az 32 karakterlik secret yalnızca Vercel ortam değişkeninde saklanır. Yerel komut: `php artisan monitoring:prune`. Hiçbir log silme uç noktası herkese açık bırakılmaz.

Olay alımı 90 istek/dakika/IP ve toplam 600 istek/dakika ile sınırlıdır. IP yalnızca HMAC rate-limit anahtarına dönüşür; olay kayıtlarına yazılmaz. Gövde 12 KB, batch 12 olayla sınırlıdır. DB / kayıt katmanı çökerse ana siteyi bozmaz; panel erişilemiyor durumuna geçer. Aynı veritabanı tamamen kapalıyken ona kalıcı olay yazılamaz; güvenli stderr kaydı Vercel Runtime Logs'a düşer. Ayrı bir bağımsız izleme hizmeti veya alarm e-postası kurulmadı.

## KVKK / gizlilik uygulaması

Teknik tasarım, isteğe bağlı ziyaret ölçümünü ayrı açık tercihe bağlar. [KVKK Çerez Uygulamaları Hakkında Rehber](https://www.kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber) temel alınmıştır. Arayüzde Vercel/Neon, Formspree kullanımı, yurt dışı işleme olasılığı ve saklama süresi açıklanır. Bu teknik değişiklik veri sorumlusunun hukuki yükümlülüklerinin tamamlandığı anlamına gelmez; aydınlatma, yurt dışı aktarım dayanağı, sağlayıcı sözleşmeleri ve başvuru süreçleri veri sorumlusu tarafından değerlendirilmelidir. Hosting sağlayıcılarının kendi erişim logları bu uygulamanın minimizasyon politikasıyla yönetilmez.

## Doğrulama ve dağıtım

`php artisan test`, `npx tsc --noEmit`, `npm run build`. E2E: ayrı SQLite veritabanı ve 8018 numaralı yerel sunucuyla `npx playwright test`. Bu test asla gerçek üretim veritabanı veya sağlayıcıya çalıştırılmamalıdır. `MONITORING_E2E_URL`, `MONITORING_E2E_PASSWORD`, `MONITORING_ARTIFACT_DIR` isteğe bağlı test ayarlarıdır.

Üretimde önce yerel şifreli veri yedeği ve mevcut kullanıcı/parola özetleri alınır. Sonra yalnızca additive `php artisan migrate --force`, mevcut içerik sayıları ve kullanıcı kimlikleri doğrulanır. `db:seed`, `migrate:fresh`, reset veya veri silen migration kullanılmaz. `MONITORING_ENABLED=false` kayıt alımını kapatabilir; bu mevcut kayıtları silmez. `CRON_SECRET` üretimde tanımlanmalıdır. Geri alma uygulama sürümüyle yapılır; tablolar korunur. İzleme migration'larının `down` metotları yalnızca kontrollü geliştirme/geri dönüş içindir; üretimde kullanıcı onayı olmadan çalıştırılmaz.

Vercel hesabının bağlı GitHub hesabı depo sahibinden farklıysa otomatik Git entegrasyonu kurulamaz. Bu durumda GitHub'a push ardından mevcut yetkili Vercel CLI oturumu ile üretim dağıtımı yapılır; bu sınır teslimde ayrıca belirtilir.
