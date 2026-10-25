<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin Kullanıcısı
        User::firstOrCreate(
            ['email' => 'mehmetardad068@gmail.com'],
            [
                'name' => 'Mehmet Arda',
                'password' => Hash::make(env('ADMIN_INITIAL_PASSWORD') ?: Str::random(64)),
                'email_verified_at' => now(),
            ]
        );

        // 2. Site Ayarları
        $settings = [
            'site_name' => 'MEHMET ARDA STUDIO',
            'site_subtitle' => 'Premium Web Tasarım ve Yazılım Ajansı',
            'founder_name' => 'Mehmet Arda',
            'slogan' => 'Dijital Dünyada Fark Yaratan Çözümler.',
            'alt_slogan' => 'Fikirlerinizi Dijital Başarıya Dönüştürüyoruz.',
            'hero_title_line1' => 'Dijital Dünyada',
            'hero_title_line2' => 'İz Bırakan',
            'hero_title_line3' => 'Deneyimler Tasarlıyoruz.',
            'hero_description' => 'Mehmet Arda Studio olarak modern web tasarım, yaratıcı dijital çözümler ve kullanıcı odaklı yazılım projeleri geliştiriyoruz. Fikirlerinizi güçlü, estetik ve işlevsel dijital deneyimlere dönüştürüyoruz.',
            'about_title' => 'Merhaba, Ben Mehmet Arda.',
            'about_text' => 'Ben Mehmet Arda. Web tasarım, yazılım ve dijital tasarım alanlarında modern, kullanıcı odaklı ve işlevsel projeler geliştirmeye odaklanıyorum. Amacım, markaların dijital dünyada güçlü bir kimlik kazanmasına yardımcı olmak ve fikirleri profesyonel dijital çözümlere dönüştürmek.',
            'phone' => '0531 466 89 27',
            'email' => 'mehmetardad068@gmail.com',
            'instagram' => 'https://www.instagram.com/mehmetardastudio/',
            'instagram_handle' => '@mehmetardastudio',
            'whatsapp' => 'https://wa.me/905314668927',
            'whatsapp_number' => '+90 531 466 89 27',
            'meta_title' => 'MEHMET ARDA STUDIO — Premium Web Tasarım ve Yazılım Ajansı',
            'meta_description' => 'Mehmet Arda Studio ile modern web tasarım, kurumsal web siteleri, özel web yazılımları ve UI/UX tasarımı. Dijital dünyada iz bırakan çözümler.',
            'meta_keywords' => 'Mehmet Arda Studio, Mehmet Arda Web Tasarım, Profesyonel Web Tasarım, Kurumsal Web Sitesi Tasarımı, Web Yazılım Hizmetleri, UI UX Tasarım',
            'profile_image' => '',
            'site_logo' => '',
        ];

        foreach ($settings as $key => $val) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $val]);
        }

        // 3. Hizmetler (6 Adet Premium Hizmet)
        $services = [
            [
                'title' => 'Web Tasarım',
                'slug' => 'web-tasarim',
                'icon' => 'Layout',
                'short_description' => 'Markanızın prestijini dijitale taşıyan, modern, estetik ve dönüşüm odaklı özgün web tasarım çözümleri.',
                'full_description' => 'Kullanıcı dostu, kurumsal kimliğinizi en üst düzeyde yansıtan ve tüm cihazlarda kusursuz çalışan web tasarımları oluşturuyoruz. Her piksel markanızın güvenilirliğini ve kalitesini hissettirir.',
                'features' => ['Özgün ve Modern Tasarım', 'Kusursuz Responsive Mimari', 'Marka Kimliğine Uygun Tipografi', 'Hızlı Yüklenme & Optimizasyon'],
                'order' => 1,
            ],
            [
                'title' => 'Web Yazılım',
                'slug' => 'web-yazilim',
                'icon' => 'Code2',
                'short_description' => 'İşletmenizin ihtiyaçlarına özel, yüksek güvenlik standartlarına sahip, ölçeklenebilir ve sürdürülebilir web sistemleri.',
                'full_description' => 'Karmaşık iş süreçlerinizi otomatikleştiren, güvenli veri akışı sağlayan modern web uygulamaları ve kurumsal yönetim sistemleri geliştiriyoruz.',
                'features' => ['Laravel & Modern PHP Altyapısı', 'RESTful API & Entegrasyonlar', 'Yüksek Güvenlik & XSS/CSRF Koruması', 'Verimli Veritabanı Mimarisi'],
                'order' => 2,
            ],
            [
                'title' => 'E-Ticaret Çözümleri',
                'slug' => 'e-ticaret-cozumleri',
                'icon' => 'ShoppingBag',
                'short_description' => 'Müşterilerinize pürüzsüz bir alışveriş deneyimi sunan, güvenli ödeme altyapılı ve yüksek dönüşümlü e-ticaret siteleri.',
                'full_description' => 'Ürün yönetimi, stok takibi, kargo entegrasyonu ve güvenli ödeme geçitleriyle donatılmış, satışlarınızı hızla artıracak modern dijital mağazalar kuruyoruz.',
                'features' => ['Kolay Sipariş ve Ödeme Adımları', 'Stok & Kategori Yönetimi', 'Mobil Öncelikli Alışveriş Arayüzü', 'Dönüşüm Odaklı UX Çözümleri'],
                'order' => 3,
            ],
            [
                'title' => 'UI/UX Tasarım',
                'slug' => 'ui-ux-tasarim',
                'icon' => 'Palette',
                'short_description' => 'Kullanıcı deneyimini merkeze alan, estetik ve işlevselliği harmanlayan ergonomik arayüz tasarımları.',
                'full_description' => 'Ziyaretçilerinizin sayfada kolayca gezinmesini, aradıklarına saniyeler içinde ulaşmasını sağlayan prototipler ve interaktif arayüz bileşenleri hazırlıyoruz.',
                'features' => ['Kullanıcı Davranış Analizi', 'Wireframe ve Etkileşimli Prototip', 'Tasarım Sistemi & UI Kit', 'Erişilebilirlik (A11y) Standartları'],
                'order' => 4,
            ],
            [
                'title' => 'Grafik ve Marka Tasarımı',
                'slug' => 'grafik-ve-marka-tasarimi',
                'icon' => 'Sparkles',
                'short_description' => 'Markanızın dijital ve basılı dünyadaki duruşunu güçlendiren kurumsal kimlik, logo ve görsel tasarım çalışmaları.',
                'full_description' => 'Sektörünüzde fark yaratmanızı sağlayacak özgün logo tasarımları, kurumsal kimlik kılavuzları ve sosyal medya görsel şablonları tasarlıyoruz.',
                'features' => ['Özgün Vektörel Logo Tasarımı', 'Kurumsal Kimlik Kılavuzu', 'Kartvizit ve Promosyon Tasarımı', 'Sosyal Medya Görsel Setleri'],
                'order' => 5,
            ],
            [
                'title' => 'SEO ve Performans Optimizasyonu',
                'slug' => 'seo-ve-performans-optimizasyonu',
                'icon' => 'TrendingUp',
                'short_description' => 'Google arama motorlarında üst sıralara taşıyan teknik SEO mimarisi ve ultra hızlı sayfa açılış süreleri.',
                'full_description' => 'Lighthouse skorlarında 90+ performans hedefleyen, semantik HTML5 yapısı, Core Web Vitals iyileştirmeleri ve yapılandırılmış veri işaretlemeleri sunuyoruz.',
                'features' => ['Core Web Vitals Optimizasyonu', 'JSON-LD Semantik Şemalar', 'Meta & OpenGraph Yapılandırması', 'Sitemap ve Robots.txt Yönetimi'],
                'order' => 6,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }

        // 4. Projeler (Demo Proje olarak açıkça işaretli)
        $projects = [
            [
                'title' => 'Nova SaaS Cloud Analytics',
                'slug' => 'nova-saas-cloud-analytics',
                'category' => 'Yazılım',
                'description' => 'Bulut tabanlı veri analitiği ve gerçek zamanlı metrik takibi sunan yeni nesil SaaS platformu ve kontrol paneli.',
                'image' => '/images/projects/project-1.svg',
                'technologies' => ['React', 'Laravel', 'Tailwind CSS', 'TypeScript', 'Chart.js'],
                'live_url' => 'https://example.com/demo-nova',
                'is_demo' => true,
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Apex Luxury Real Estate',
                'slug' => 'apex-luxury-real-estate',
                'category' => 'Web Tasarım',
                'description' => 'Lüks gayrimenkul ve rezidans projeleri için özel olarak tasarlanmış, akıcı animasyonlara ve görsel derinliğe sahip prestij sitesi.',
                'image' => '/images/projects/project-2.svg',
                'technologies' => ['React', 'Framer Motion', 'Tailwind CSS', 'Inertia.js'],
                'live_url' => 'https://example.com/demo-apex',
                'is_demo' => true,
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'title' => 'Lumina Minimal E-Store',
                'slug' => 'lumina-minimal-e-store',
                'category' => 'Web Tasarım',
                'description' => 'İskandinav tasarım anlayışıyla harmanlanmış, ultra minimalist ve dönüşüm oranı maksimize edilmiş modern moda e-ticaret mağazası.',
                'image' => '/images/projects/project-3.svg',
                'technologies' => ['React', 'Tailwind CSS', 'Stripe API', 'Laravel'],
                'live_url' => 'https://example.com/demo-lumina',
                'is_demo' => true,
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'title' => 'Veloce Brand Identity & UI Kit',
                'slug' => 'veloce-brand-identity-ui-kit',
                'category' => 'Kurumsal Kimlik',
                'description' => 'Teknoloji girişimleri için sıfırdan oluşturulan kapsamlı kurumsal kimlik kılavuzu, tipografi sistemi ve dijital tasarım dili.',
                'image' => '/images/projects/project-4.svg',
                'technologies' => ['Figma', 'UI/UX Design', 'Branding', 'Vector Assets'],
                'live_url' => 'https://example.com/demo-veloce',
                'is_demo' => true,
                'is_featured' => true,
                'order' => 4,
            ],
            [
                'title' => 'Kura Fintech Web Application',
                'slug' => 'kura-fintech-web-application',
                'category' => 'Yazılım',
                'description' => 'Finansal varlık ve döviz hareketlerini anlık takip eden, iki aşamalı güvenlikli ve kurumsal düzeyde fintech platformu.',
                'image' => '/images/projects/project-5.svg',
                'technologies' => ['Laravel 12', 'React', 'REST API', 'Tailwind CSS'],
                'live_url' => 'https://example.com/demo-kura',
                'is_demo' => true,
                'is_featured' => true,
                'order' => 5,
            ],
            [
                'title' => 'ArchStudio Architecture & Interior',
                'slug' => 'archstudio-architecture-interior',
                'category' => 'Web Tasarım',
                'description' => 'Ödüllü mimarlık ofisi için geliştirilen, yüksek çözünürlüklü proje galerileri ve minimalist grid tipografisine sahip kurumsal site.',
                'image' => '/images/projects/project-6.svg',
                'technologies' => ['React', 'Framer Motion', 'Tailwind CSS', 'Responsive Grid'],
                'live_url' => 'https://example.com/demo-arch',
                'is_demo' => true,
                'is_featured' => true,
                'order' => 6,
            ],
        ];

        foreach ($projects as $project) {
            Project::updateOrCreate(['slug' => $project['slug']], $project);
        }
    }
}
