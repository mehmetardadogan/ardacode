import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: 'Web sitesi ne kadar sürede hazırlanır?',
            a: 'Geliştirme süresi projenin kapsamına, sayfa sayısına, özel yazılım gereksinimlerine ve içerik hazırlık durumuna bağlı olarak değişkenlik gösterir. Standart bir kurumsal web sitesi genellikle birkaç hafta içerisinde titizlikle tamamlanırken; karmaşık web yazılımları veya e-ticaret projeleri daha kapsamlı bir geliştirme ve test takvimi gerektirir. Analiz aşamasında sizin için net ve gerçekçi bir proje takvimi oluşturuyoruz.',
        },
        {
            q: 'Mobil uyumlu (Responsive) tasarım yapıyor musunuz?',
            a: 'Evet, geliştirdiğimiz tüm web siteleri mobil öncelikli (Mobile-First) felsefeyle kodlanır. Akıllı telefonlar, tabletler, dizüstü ve ultra geniş masaüstü ekranlar dahil olmak üzere tüm cihazlarda kusursuz çözünürlük, akıcı kaydırma ve hızlı yanıt verme garantilenir.',
        },
        {
            q: 'Web sitemi sonradan kendim güncelleyebilir miyim?',
            a: 'Elbette. Mehmet Arda Studio olarak geliştirdiğimiz projelerde modern ve kullanıcı dostu bir yönetim paneli entegre ediyoruz. Bu sayede yazılım veya kodlama bilmenize gerek kalmadan içeriklerinizi, görsellerinizi, hizmetlerinizi ve iletişim bilgilerinizi kolayca yönetebilirsiniz.',
        },
        {
            q: 'SEO ve arama motoru optimizasyonu yapıyor musunuz?',
            a: 'Geliştirdiğimiz her web sitesi, teknik SEO kurallarına (semantik HTML5, meta ve OpenGraph etiketleri, hızlı sayfa açılış süreleri, Core Web Vitals uyumu ve XML sitemap) tam uyumlu olarak inşa edilir. Bu yapı, arama motorlarının sitenizi sağlıklı indekslemesi ve üst sıralara tırmanması için sağlam bir temel oluşturur.',
        },
        {
            q: 'Projem için nasıl fiyat teklifi alabilirim?',
            a: 'Web sitemizdeki iletişim formunu doldurarak veya doğrudan WhatsApp üzerinden projenizin hedeflerini ve detaylarını bize iletebilirsiniz. Talebinizi inceledikten sonra gereksinimlerinize en uygun çözüm kapsamını ve şeffaf fiyatlandırma teklifimizi tarafınıza iletiyoruz.',
        },
    ];

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section className="py-24 bg-white border-t border-[#DCE3EE] relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3F6FB] border border-[#DCE3EE] text-[#155DFC] text-xs font-bold">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Merak Edilenler</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080F20] tracking-tight">
                        Sıkça Sorulan Sorular
                    </h2>
                    <p className="text-sm text-[#475569] max-w-lg mx-auto font-medium">
                        Süreçlerimiz, teknik yaklaşımımız ve çalışma prensiplerimiz hakkında en çok yöneltilen soruların yanıtları.
                    </p>
                </div>

                {/* Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                                    isOpen
                                        ? 'border-[#155DFC] bg-[#F3F6FB] shadow-md shadow-[#155DFC]/5'
                                        : 'border-[#DCE3EE] hover:border-slate-300 bg-white'
                                }`}
                            >
                                <button
                                    onClick={() => toggle(idx)}
                                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <span className="text-base font-extrabold text-[#080F20]">
                                        {faq.q}
                                    </span>
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                                            isOpen
                                                ? 'bg-[#155DFC] text-white rotate-180'
                                                : 'bg-[#F3F6FB] text-[#080F20] border border-[#DCE3EE]'
                                        }`}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        >
                                            <div className="px-6 pb-6 pt-1 text-sm text-[#334155] leading-relaxed border-t border-[#DCE3EE] font-normal">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
