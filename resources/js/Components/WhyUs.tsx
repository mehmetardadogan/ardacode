import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Smartphone,
    Zap,
    Search,
    ShieldCheck,
    Cpu,
} from 'lucide-react';

export default function WhyUs() {
    const advantages = [
        {
            title: 'Özgün & Karakterli Tasarım',
            description: 'Kalıp hazır şablonlar yerine, markanızın hedef kitlesine hitap eden benzersiz ve estetik dijital kimlikler inşa ediyoruz.',
            icon: Sparkles,
        },
        {
            title: 'Kusursuz Mobil Uyum (Responsive)',
            description: 'Akıllı telefonlardan ultra geniş ekranlara kadar her cihazda pürüzsüz kaydırma ve milimetrik hizalama garantisi.',
            icon: Smartphone,
        },
        {
            title: 'Performans & Hız Odaklı Mimari',
            description: 'Gereksiz kod yükünden arındırılmış, hafif ve ultra hızlı yüklenen modern React ve optimize backend altyapısı.',
            icon: Zap,
        },
        {
            title: 'Google & SEO Uyumlu Yapı',
            description: 'Arama motorlarının en çok değer verdiği temiz semantik HTML, Schema.org işaretlemeleri ve Core Web Vitals optimizasyonu.',
            icon: Search,
        },
        {
            title: 'Güvenli Yazılım Yaklaşımı',
            description: 'OWASP standartlarında veri güvenliği, CSRF ve XSS korumaları, şifreli oturumlar ve güvenli altyapı prensipleri.',
            icon: ShieldCheck,
        },
        {
            title: 'İhtiyaca Özel Esnek Çözümler',
            description: 'İşletmenizin büyüme hedeflerine kolayca adapte olan, genişletilebilir ve modüler kod mimarisi.',
            icon: Cpu,
        },
    ];

    return (
        <section className="py-24 bg-white border-t border-[#DCE3EE] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3F6FB] border border-[#DCE3EE] text-[#155DFC] text-xs font-bold">
                        <span>Fark Yaratan Değerlerimiz</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080F20] tracking-tight">
                        Sadece Web Sitesi Değil, Dijital Deneyim Tasarlıyoruz.
                    </h2>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-medium">
                        Mehmet Arda Studio olarak sunduğumuz her çözümde hız, estetik ve mühendislik disiplinini bir araya getiriyoruz.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advantages.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: index * 0.05 }}
                                className="bg-[#F3F6FB] p-8 rounded-2xl border-2 border-[#DCE3EE] shadow-2xs hover:border-[#155DFC] hover:shadow-md transition-all duration-200 space-y-3"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white border border-[#DCE3EE] text-[#155DFC] flex items-center justify-center shadow-2xs">
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-extrabold text-[#080F20]">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
