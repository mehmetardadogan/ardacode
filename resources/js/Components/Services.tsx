import React, { useState, useEffect } from 'react';
import { trackEvent } from '../lib/telemetry';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Code2,
    ShoppingBag,
    Palette,
    Sparkles,
    TrendingUp,
    ArrowUpRight,
    CheckCircle2,
    X,
    ArrowRight,
} from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
    services: Service[];
}

const iconMap: Record<string, React.ElementType> = {
    Layout,
    Code2,
    ShoppingBag,
    Palette,
    Sparkles,
    TrendingUp,
};

const serviceImageMap: Record<string, string> = {
    'web-tasarim': '/images/services/service-web-design.svg',
    'web-yazilim': '/images/services/service-software.svg',
    'e-ticaret-cozumleri': '/images/services/service-ecommerce.svg',
    'ui-ux-tasarim': '/images/services/service-uiux.svg',
    'grafik-ve-marka-tasarimi': '/images/services/service-branding.svg',
    'seo-ve-performans-optimizasyonu': '/images/services/service-seo.svg',
};

export default function Services({ services }: ServicesProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Body scroll lock and ESC key handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedService(null);
            }
        };

        if (selectedService) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedService]);

    const scrollToContact = () => {
        setSelectedService(null);
        const el = document.querySelector('#iletisim');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hizmetler" className="py-28 bg-[#F3F6FB] border-t border-[#DCE3EE] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DCE3EE] text-[#155DFC] text-xs font-bold shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Uzmanlık & Çözüm Portföyü</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080F20] tracking-tight">
                            Dijital Başarınız İçin Profesyonel Çözümler
                        </h2>
                    </div>
                    <p className="text-sm text-[#475569] max-w-md font-medium leading-relaxed">
                        Mehmet Arda Studio olarak markanızın dijital varlığını güçlendirecek, yüksek performanslı ve kullanıcı odaklı çözümler sunuyoruz.
                    </p>
                </div>

                {/* Services Cards Grid with Photorealistic Device/Interface Illustrations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const IconComponent = iconMap[service.icon] || Layout;
                        const serviceImage = serviceImageMap[service.slug] || '/images/services/service-web-design.svg';

                        return (
                            <motion.div
                                key={service.id || service.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                whileHover={{ y: -8 }}
                                className="group relative bg-white rounded-3xl border-2 border-[#DCE3EE] hover:border-[#155DFC] shadow-sm hover:shadow-2xl hover:shadow-[#155DFC]/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                            >
                                {/* Top Visual Showcase Image */}
                                <div className="relative aspect-16/10 overflow-hidden bg-[#080F20] border-b border-[#DCE3EE]">
                                    <img
                                        src={serviceImage}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-[#080F20] border border-[#DCE3EE] shadow-xs flex items-center gap-1.5">
                                        <IconComponent className="w-3.5 h-3.5 text-[#155DFC]" />
                                        <span>{service.title}</span>
                                    </div>
                                    <div className="absolute top-3.5 right-3.5 bg-[#080F20]/80 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
                                        0{index + 1}
                                    </div>
                                </div>

                                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-black text-[#080F20] group-hover:text-[#155DFC] transition-colors tracking-tight">
                                                {service.title}
                                            </h3>
                                            <span className="text-[10px] font-black text-[#155DFC] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                                Aktif Çözüm
                                            </span>
                                        </div>

                                        <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">
                                            {service.short_description}
                                        </p>

                                        {/* Feature Pills */}
                                        {service.features && service.features.length > 0 && (
                                            <div className="pt-2 flex flex-wrap gap-1.5 sm:gap-2">
                                                {service.features.slice(0, 2).map((feat, fIdx) => (
                                                    <span
                                                        key={fIdx}
                                                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#080F20] bg-[#F3F6FB] px-2.5 py-1 rounded-lg border border-[#DCE3EE] group-hover:border-[#155DFC]/30 transition-colors"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#155DFC]" />
                                                        {feat}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Link */}
                                    <div className="pt-5 mt-4 border-t border-[#DCE3EE] flex items-center justify-between">
                                        <button
                                            onClick={() => { setSelectedService(service); trackEvent('service_viewed', { section: 'hizmetler' }); }}
                                            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#080F20] group-hover:text-[#155DFC] transition-colors cursor-pointer"
                                        >
                                            <span>Detayları İncele</span>
                                            <div className="w-6 h-6 rounded-full bg-[#F3F6FB] group-hover:bg-[#155DFC] text-[#080F20] group-hover:text-white flex items-center justify-center transition-all duration-200">
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </button>

                                        <span className="text-[10px] font-bold text-[#155DFC] uppercase tracking-wider">
                                            Kapsamlı Çözüm
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>

            {/* Service Detail Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#080F20]/80 backdrop-blur-md overflow-hidden"
                        onClick={() => setSelectedService(null)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-service-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 16 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl max-w-[750px] w-full max-h-[90dvh] flex flex-col border-2 border-[#DCE3EE] shadow-2xl relative overflow-hidden"
                        >
                            {/* Safe Top-Right Close Button */}
                            <button
                                onClick={() => setSelectedService(null)}
                                className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-[#080F20]/80 hover:bg-[#080F20] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-105 shadow-xl cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#155DFC]"
                                aria-label="Modalı Kapat"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Upper Visual Presentation Container */}
                            <div className="relative aspect-16/9 max-h-[220px] sm:max-h-[300px] w-full bg-gradient-to-b from-[#080F20] to-[#0A1020] shrink-0 overflow-hidden flex items-center justify-center border-b border-[#DCE3EE]">
                                <img
                                    src={serviceImageMap[selectedService.slug] || '/images/services/service-web-design.svg'}
                                    alt={selectedService.title}
                                    className="w-full h-full object-contain p-2 sm:p-4"
                                />
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto flex-1 space-y-6">
                                <div>
                                    <h3 id="modal-service-title" className="text-2xl sm:text-3xl font-black text-[#080F20] tracking-tight">
                                        {selectedService.title}
                                    </h3>
                                    <p className="text-xs text-[#155DFC] font-bold uppercase tracking-wider mt-1">
                                        Mehmet Arda Studio Standartları
                                    </p>
                                </div>

                                <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-normal">
                                    {selectedService.full_description || selectedService.short_description}
                                </p>

                                {selectedService.features && selectedService.features.length > 0 && (
                                    <div className="space-y-3 pt-3 border-t border-[#DCE3EE]">
                                        <h4 className="text-xs font-bold text-[#080F20] uppercase tracking-wider">
                                            Hizmet Kapsamı & Avantajlar
                                        </h4>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#334155]">
                                            {selectedService.features.map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-[#155DFC] shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Balanced Buttons (Mobile full-width stack, desktop balanced row) */}
                                <div className="pt-6 border-t border-[#DCE3EE] flex flex-col sm:flex-row items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedService(null)}
                                        className="w-full sm:w-auto px-7 py-3.5 rounded-full border-2 border-[#DCE3EE] text-[#080F20] hover:bg-[#F3F6FB] font-bold text-xs transition-colors cursor-pointer text-center order-2 sm:order-1"
                                    >
                                        Pencereyi Kapat
                                    </button>

                                    <button
                                        type="button"
                                        onClick={scrollToContact}
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#155DFC] hover:bg-[#0047D4] text-white font-extrabold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#155DFC]/25 cursor-pointer order-1 sm:order-2"
                                    >
                                        <span>Bu Hizmet İçin Teklif Alın</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
