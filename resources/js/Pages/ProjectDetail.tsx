import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    Layers,
    Sparkles,
    CheckCircle2,
    ExternalLink,
    Smartphone,
    Monitor,
    Zap,
    ShieldCheck,
    Cpu,
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Project, SiteSettings } from '../types';

interface ProjectDetailProps {
    project: Project;
    relatedProjects: Project[];
    settings: SiteSettings;
}

export default function ProjectDetail({ project, relatedProjects = [], settings = {} }: ProjectDetailProps) {
    const pageTitle = `${project.title} — Mehmet Arda Studio`;

    return (
        <div className="min-h-screen bg-white text-[#334155] selection:bg-[#155DFC] selection:text-white flex flex-col font-sans">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={project.description} />
            </Head>

            <Navbar siteLogo={settings.site_logo} />

            <main className="flex-1 pt-32 pb-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Navigation & Breadcrumb Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE3EE] pb-6">
                        <Link
                            href="/#projeler"
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#080F20] hover:text-[#155DFC] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Tüm Projelere Geri Dön</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {project.is_demo ? (
                                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span>Demo Proje Vitrini</span>
                                </span>
                            ) : (
                                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                    <span>Müşteri Projesi</span>
                                </span>
                            )}
                            <span className="bg-[#F3F6FB] border border-[#DCE3EE] text-[#080F20] px-3.5 py-1 rounded-full text-xs font-extrabold">
                                {project.category}
                            </span>
                        </div>
                    </div>

                    {/* Title, Narrative & Live Action */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <span className="text-xs font-black text-[#155DFC] uppercase tracking-wider block">
                                Mehmet Arda Studio • Vaka Analizi & Portföy
                            </span>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#080F20] tracking-tight leading-[1.08]">
                                {project.title}
                            </h1>
                        </div>

                        <p className="text-base sm:text-lg text-[#334155] leading-relaxed font-normal max-w-3xl">
                            {project.description}
                        </p>

                        {/* Action Buttons Row */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3.5 rounded-full bg-[#155DFC] hover:bg-[#0047D4] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#155DFC]/25 transition-all"
                                >
                                    <span>Canlı Önizlemeyi Aç</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}

                            <Link
                                href="/#iletisim"
                                className="px-6 py-3.5 rounded-full bg-[#F3F6FB] hover:bg-slate-200/80 text-[#080F20] border border-[#DCE3EE] font-bold text-xs flex items-center gap-2 transition-all"
                            >
                                <span>Bu Proje İçin Teklif Alın</span>
                                <ArrowUpRight className="w-4 h-4 text-[#155DFC]" />
                            </Link>
                        </div>
                    </div>

                    {/* Main Image: Realistic Laptop / Hardware Mockup */}
                    <div className="rounded-3xl overflow-hidden border-2 border-[#DCE3EE] shadow-2xl bg-[#080F20] aspect-16/9 flex items-center justify-center p-3 sm:p-6 relative group">
                        <img
                            src={project.image || '/images/projects/project-1.svg'}
                            alt={project.title}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl bg-[#F3F6FB] border-2 border-[#DCE3EE]">
                        <div className="space-y-1">
                            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Kategori</span>
                            <span className="text-base font-black text-[#080F20]">{project.category}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Ajans & Stüdyo</span>
                            <span className="text-base font-black text-[#080F20]">MEHMET ARDA STUDIO</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Mühendislik</span>
                            <span className="text-base font-black text-[#155DFC]">Responsive & Özel Kodlama</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Performans Hedefi</span>
                            <span className="text-base font-black text-emerald-600">Core Web Vitals 98+</span>
                        </div>
                    </div>

                    {/* Multi-Device Perspective Gallery Section */}
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F6FB] border border-[#DCE3EE] text-[#155DFC] text-xs font-bold">
                                <Monitor className="w-3.5 h-3.5" />
                                <span>Cihaz ve Ekran Deneyimi</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#080F20]">
                                Masaüstü, Tablet ve Mobil Kusursuzluğu
                            </h2>
                            <p className="text-sm text-[#475569] max-w-2xl font-normal leading-relaxed">
                                Her arayüz bileşeni, en küçük mobil ekrandan 4K stüdyo monitörlerine kadar piksel hassasiyetinde ölçeklenir ve akıcı kullanıcı deneyimi sunar.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Device Card 1: Desktop Architecture */}
                            <div className="bg-[#080F20] text-white p-7 rounded-3xl border-2 border-slate-800 space-y-4 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-[#60A5FA] font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <Monitor className="w-4 h-4" />
                                            <span>Masaüstü & Retina Ekran</span>
                                        </span>
                                        <span className="font-mono text-[10px]">1920x1080 & 2560x1440</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Geniş Tuval & Gelişmiş Navigasyon</h3>
                                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                        Masaüstü kullanıcıları için zengin veri tabloları, mikro etkileşimler ve hızlı klavye/fare navigasyonu optimize edilmiştir.
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                                    <span>Tam Ekran Uyumu</span>
                                    <span className="text-emerald-400 font-bold">● Optimize</span>
                                </div>
                            </div>

                            {/* Device Card 2: Mobile Priority */}
                            <div className="bg-[#F3F6FB] p-7 rounded-3xl border-2 border-[#DCE3EE] space-y-4 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-[#155DFC] font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <Smartphone className="w-4 h-4" />
                                            <span>Mobil Öncelikli (Mobile-First)</span>
                                        </span>
                                        <span className="font-mono text-[10px]">320px — 430px</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#080F20]">Ergonomik Dokunma ve Hız</h3>
                                    <p className="text-xs text-[#334155] leading-relaxed font-normal">
                                        Başparmak erişim bölgeleri, hafif animasyonlar ve sıfır yerleşim kayması (Zero CLS) ile anında açılan mobil arayüz.
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-[#DCE3EE] flex items-center justify-between text-[11px] text-[#475569]">
                                    <span>Tek Elle Kullanım Standardı</span>
                                    <span className="text-[#155DFC] font-bold">● A++ Ergonomi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technologies & Architectural Standards */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-extrabold text-[#080F20] flex items-center gap-2">
                            <Layers className="w-5 h-5 text-[#155DFC]" />
                            <span>Kullanılan Teknolojiler & Standartlar</span>
                        </h3>

                        {project.technologies && (
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((t, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 rounded-xl bg-white border-2 border-[#DCE3EE] text-xs font-bold text-[#080F20] shadow-2xs"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="p-6 rounded-2xl bg-white border-2 border-[#DCE3EE] space-y-2">
                                <div className="w-9 h-9 rounded-xl bg-[#F3F6FB] text-[#155DFC] flex items-center justify-center font-bold">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-black text-[#080F20]">Sıfır Hız Kaybı</h4>
                                <p className="text-xs text-[#475569] leading-relaxed font-medium">
                                    Optimize edilmiş asset paketleri ve sunucu taraflı önbellekleme ile 1 saniyenin altında açılış.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white border-2 border-[#DCE3EE] space-y-2">
                                <div className="w-9 h-9 rounded-xl bg-[#F3F6FB] text-[#155DFC] flex items-center justify-center font-bold">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-black text-[#080F20]">Kurumsal Güvenlik</h4>
                                <p className="text-xs text-[#475569] leading-relaxed font-medium">
                                    OWASP standartlarında CSRF, XSS koruması ve güvenli HTTPS SSL veri iletimi.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white border-2 border-[#DCE3EE] space-y-2">
                                <div className="w-9 h-9 rounded-xl bg-[#F3F6FB] text-[#155DFC] flex items-center justify-center font-bold">
                                    <Cpu className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-black text-[#080F20]">Modern Mimari</h4>
                                <p className="text-xs text-[#475569] leading-relaxed font-medium">
                                    Modüler React bileşen yapısı ve sürdürülebilir, genişletilebilir temiz kod prensipleri.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Blue Gradient CTA Box */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#080F20] via-[#0F172A] to-[#155DFC] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-slate-800">
                        <div>
                            <h3 className="text-2xl font-black">Benzer Bir Proje mi Hayal Ediyorsunuz?</h3>
                            <p className="text-xs sm:text-sm text-slate-200 mt-1">İhtiyaçlarınıza özel modern web sitesi ve yazılım için hemen görüşelim.</p>
                        </div>
                        <Link
                            href="/#iletisim"
                            className="px-7 py-4 rounded-full bg-white hover:bg-slate-100 text-[#080F20] font-black text-xs transition-colors shrink-0 flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                            <span>Projenizi Konuşalım</span>
                            <ArrowUpRight className="w-4 h-4 text-[#155DFC]" />
                        </Link>
                    </div>

                    {/* Related Projects */}
                    {relatedProjects.length > 0 && (
                        <div className="pt-8 border-t border-[#DCE3EE] space-y-6">
                            <h3 className="text-2xl font-black text-[#080F20]">Diğer Örnek Çalışmalar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedProjects.map((rp) => (
                                    <Link
                                        key={rp.id}
                                        href={`/projeler/${rp.slug}`}
                                        className="group block bg-white rounded-2xl border-2 border-[#DCE3EE] overflow-hidden hover:border-[#155DFC] hover:shadow-lg transition-all"
                                    >
                                        <div className="aspect-16/10 bg-[#080F20] overflow-hidden">
                                            <img
                                                src={rp.image || '/images/projects/project-1.svg'}
                                                alt={rp.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-5 space-y-1">
                                            <span className="text-[10px] font-black text-[#155DFC] uppercase">{rp.category}</span>
                                            <h4 className="text-sm font-extrabold text-[#080F20] group-hover:text-[#155DFC] transition-colors truncate">
                                                {rp.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <Footer
                phone={settings.phone}
                email={settings.email}
                instagram={settings.instagram}
                whatsapp={settings.whatsapp}
            />
        </div>
    );
}
