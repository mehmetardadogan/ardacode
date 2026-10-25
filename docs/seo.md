# Arama görünürlüğü

Tercih edilen adres `https://ardacode.com.tr/`. Ana sayfa, proje sayfaları ve sitemap aynı canonical adres kaynağını kullanır (`config/seo.php`, `SEO_CANONICAL_URL`). Alternatif alan adları aynı canonical adresi bildirir. Alan adı değişirse Search Console mülkü ve doğrulaması da güncellenmelidir.

Ana sayfa Mersin web tasarım, Mehmet Arda Studio ve ArdaCode aramalarına uygun doğal içerik kullanır. Fiziksel ofis adresi, müşteri yorumu veya ölçülmemiş yerel sıralama iddiası eklenmemiştir. Yapılandırılmış veri hizmet verilen şehri Mersin olarak belirtir; bir sokak adresi uydurmaz. Google meta keywords alanını sıralama için kullanmadığından anahtar kelime yığını eklenmez.

Başlık, açıklama, canonical, Open Graph ve JSON-LD ilk HTTP yanıtında bulunur; Inertia geçişlerinde aynı `seo` verisi kullanılır. Başlığa ikinci kez marka eklenmez. Orijinal seed SEO metinleri yeni varsayılanlara yükseltilir; sonraki özel yönetici düzenlemeleri korunur.

`app.blade.php` Inertia 3 JSON sayfa verisini ve public sayfaların görünür, semantik HTML başlangıç içeriğini sunar. React `createRoot` aynı kökü tam arayüzle değiştirir. Böylece JavaScript kapalıyken de hizmetler, proje bağlantıları ve iletişim bilgileri okunabilir. Bu bir Node SSR servisi değildir; Blade ve React public metinleri değiştiğinde birlikte güncellenmelidir. Özel yönetici verileri HTML başlangıç içeriğine eklenmez.

`/sitemap.xml` yalnızca ana sayfayı ve mevcut projeleri listeler. Projelerde gerçek güncelleme tarihleri kullanılır; ana sayfaya her istekte yapay güncelleme tarihi yazılmaz. `/robots.txt` Laravel tarafından sunulur. Yönetim ve dahili uçlarda `X-Robots-Tag: noindex, nofollow` vardır; bu erişim kontrolünün yerini almaz.

Google Search Console doğrulama meta etiketi hesap tarafından verilen public değerdir ve doğrulamadan sonra tutulmalıdır. Sitemap gönderimi ve ana sayfa için URL denetimi Search Console üzerinden yapılır. Tarama, indekslenme ve sıralama Google tarafından belirlenir; garanti verilmez.

Doğrulama: `php artisan test` (SEO, XML, kaçış, noindex dahil), `npm run typecheck`, `npm run build`; tarayıcıda ana sayfa ve Inertia proje geçişlerinde tek canonical/description/H1 kontrolü.
