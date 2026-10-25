import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Code, Rocket, CheckCircle2, Sparkles } from 'lucide-react';

export default function Process() {
    const steps = [
        {
            number: '01',
            title: 'Analiz & Strateji',
            icon: Search,
            description: 'İş hedeflerinizi, rakip analizlerini ve kullanıcı beklentilerini derinlemesine inceleyerek net bir mimari yol haritası oluştururuz.',
            items: ['Kapsam ve İhtiyaç Analizi', 'Kullanıcı Akış Planı', 'Teknoloji & Altyapı Seçimi'],
        },
        {
            number: '02',
            title: 'Tasarım & UI/UX Prototip',
            icon: Compass,
            description: 'Kullanıcı odaklı, modern ve kurumsal kimliğinizi yansıtan interaktif arayüz tasarımlarını hazırlar, deneyimi test ederiz.',
            items: ['Wireframe & UI Bileşenleri', 'Tipografi & Renk Hiyerarşisi', 'İnteraktif Prototipleme'],
        },
        {
            number: '03',
            title: 'Yazılım & Geliştirme',
            icon: Code,
            description: 'Tasarımı, temiz kod prensipleri ve en güncel teknolojilerle (React, Laravel, Tailwind) performansı yüksek sistemlere dönüştürürüz.',
            items: ['Modüler Bileşen Mimarisi', 'Güvenli Backend & Veritabanı', 'Mobil Öncelikli Kodlama'],
        },
        {
            number: '04',
            title: 'Test, SEO & Canlıya Alma',
            icon: Rocket,
            description: 'Tarayıcı uyumluluğu, güvenlik denetimleri, hız ve arama motoru optimizasyonlarını tamamlayarak projenizi sorunsuz yayına alırız.',
            items: ['Lighthouse & Hız Testleri', 'Güvenlik & Penetrasyon Kontrolleri', 'Canlıya Alma & Teknik Destek'],
        },
    ];

    return (
        <section id="surec" className="py-28 bg-[#080F20] text-white relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#155DFC]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#6D28D9]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#60A5FA] text-xs font-bold backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Mühendislik & Çalışma Metodolojisi</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        Bir Fikirden Dijital Başarıya
                    </h2>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                        Her projeyi adım adım, şeffaf, disiplinli ve sonuç odaklı bir yaklaşımla hayata geçiriyoruz.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="relative">
                    {/* Connecting glowing line for desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-[#155DFC] via-[#60A5FA] to-[#6D28D9] -translate-y-10 z-0 opacity-40" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => {
                            const IconComp = step.icon;
                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border-2 border-slate-800 hover:border-[#155DFC] transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Number & Icon */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-13 h-13 rounded-2xl bg-[#155DFC] text-white flex items-center justify-center font-bold shadow-lg shadow-[#155DFC]/30 group-hover:scale-110 transition-transform">
                                                <IconComp className="w-6 h-6" />
                                            </div>
                                            <span className="font-mono text-3xl font-black text-slate-700 group-hover:text-[#60A5FA] transition-colors">
                                                {step.number}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#60A5FA] transition-colors">
                                            {step.title}
                                        </h3>

                                        <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Sub-items */}
                                    <div className="space-y-2 pt-4 border-t border-slate-800">
                                        {step.items.map((item, iIdx) => (
                                            <div key={iIdx} className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#155DFC] shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
