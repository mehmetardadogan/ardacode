import React, { useState } from 'react';
import {
    ArrowUpRight,
    Mail,
    Phone,
} from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './Icons';
import LegalModal from './LegalModal';

interface FooterProps {
    phone?: string;
    email?: string;
    instagram?: string;
    whatsapp?: string;
}

export default function Footer({
    phone = '0531 466 89 27',
    email = 'mehmetardad068@gmail.com',
    instagram = 'https://www.instagram.com/mehmetardastudio/',
    whatsapp = 'https://wa.me/905314668927',
}: FooterProps) {
    const [legalType, setLegalType] = useState<'kvkk' | 'privacy' | null>(null);

    const scrollTo = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#080F20] text-slate-300 pt-16 pb-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
                    
                    {/* Brand Col */}
                    <div className="lg:col-span-4 space-y-4">
                        <img
                            src="/images/logo-dark.svg"
                            alt="MEHMET ARDA STUDIO"
                            className="h-11 w-auto"
                        />

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                            Modern web tasarım, kullanıcı odaklı UI/UX arayüzleri ve yüksek performanslı web yazılımları geliştiren dijital ajans.
                        </p>

                        <div className="pt-2 flex items-center gap-2.5">
                            <a
                                href={instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#155DFC] transition-colors"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="w-4 h-4 text-rose-400" />
                            </a>
                            <a
                                href={`mailto:${email}`}
                                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#155DFC] transition-colors"
                                aria-label="E-posta"
                            >
                                <Mail className="w-4 h-4 text-[#60A5FA]" />
                            </a>
                            <a
                                href={whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-emerald-500 transition-colors"
                                aria-label="WhatsApp"
                            >
                                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                            </a>
                        </div>
                    </div>

                    {/* Services Col */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Hizmetlerimiz
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#hizmetler" onClick={(e) => { e.preventDefault(); scrollTo('#hizmetler'); }} className="hover:text-white transition-colors">Web Tasarım</a></li>
                            <li><a href="#hizmetler" onClick={(e) => { e.preventDefault(); scrollTo('#hizmetler'); }} className="hover:text-white transition-colors">Web Yazılım</a></li>
                            <li><a href="#hizmetler" onClick={(e) => { e.preventDefault(); scrollTo('#hizmetler'); }} className="hover:text-white transition-colors">E-Ticaret Çözümleri</a></li>
                            <li><a href="#hizmetler" onClick={(e) => { e.preventDefault(); scrollTo('#hizmetler'); }} className="hover:text-white transition-colors">UI/UX Tasarım</a></li>
                            <li><a href="#hizmetler" onClick={(e) => { e.preventDefault(); scrollTo('#hizmetler'); }} className="hover:text-white transition-colors">Grafik & Marka Tasarımı</a></li>
                            <li><a href="#hizmetler" onClick={(e) => { e.preventDefault(); scrollTo('#hizmetler'); }} className="hover:text-white transition-colors">SEO & Performans</a></li>
                        </ul>
                    </div>

                    {/* Quick Nav Col */}
                    <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Hızlı Menü
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }} className="hover:text-white transition-colors">Ana Sayfa</a></li>
                            <li><a href="#hakkimda" onClick={(e) => { e.preventDefault(); scrollTo('#hakkimda'); }} className="hover:text-white transition-colors">Hakkımda</a></li>
                            <li><a href="#projeler" onClick={(e) => { e.preventDefault(); scrollTo('#projeler'); }} className="hover:text-white transition-colors">Projelerimiz</a></li>
                            <li><a href="#surec" onClick={(e) => { e.preventDefault(); scrollTo('#surec'); }} className="hover:text-white transition-colors">Çalışma Süreci</a></li>
                            <li><a href="#iletisim" onClick={(e) => { e.preventDefault(); scrollTo('#iletisim'); }} className="hover:text-white transition-colors">İletişim</a></li>
                        </ul>
                    </div>

                    {/* Contact & Location Col */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            İletişim & Lokasyon
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            Türkiye geneli ve yurt dışı müşteriler için uzaktan & yerinde profesyonel dijital ajans hizmeti.
                        </p>
                        <div className="space-y-1.5 text-xs">
                            <div>Tel: <span className="font-bold text-white">{phone}</span></div>
                            <div className="truncate">E-posta: <span className="font-bold text-white">{email}</span></div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <p>© 2026 Mehmet Arda Studio. Tüm Hakları Saklıdır.</p>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setLegalType('privacy')}
                            className="hover:text-white transition-colors cursor-pointer"
                        >
                            Gizlilik Politikası
                        </button>
                        <button
                            onClick={() => setLegalType('kvkk')}
                            className="hover:text-white transition-colors cursor-pointer"
                        >
                            KVKK Aydınlatma Metni
                        </button>
                    </div>
                </div>

            </div>

            <LegalModal
                isOpen={legalType !== null}
                onClose={() => setLegalType(null)}
                type={legalType}
            />
        </footer>
    );
}
