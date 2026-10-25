import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code2,
    Palette,
    Terminal,
    Cpu,
    ArrowUpRight,
    Mail,
    Phone,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './Icons';

interface AboutProps {
    title?: string;
    text?: string;
    profileImage?: string;
    instagram?: string;
    whatsapp?: string;
    email?: string;
    phone?: string;
}

export default function About({
    title = 'Merhaba, Ben Mehmet Arda.',
    text = 'Mehmet Arda Studio bünyesinde modern web tasarım, yazılım ve dijital arayüz projeleri geliştiriyorum. Amacım, markaların dijital dünyada güçlü, işlevsel ve estetik bir kimlik kazanmasına yardımcı olmak.',
    profileImage,
    instagram = 'https://www.instagram.com/mehmetardastudio/',
    whatsapp = 'https://wa.me/905314668927',
    email = 'mehmetardad068@gmail.com',
    phone = '0531 466 89 27',
}: AboutProps) {
    const [imgFailed, setImgFailed] = useState(false);

    const expertiseList = [
        {
            title: 'Modern Web Geliştirme',
            desc: 'Laravel, React ve modern mimariler ile güvenli, ölçeklenebilir ve yüksek hızlı web sistemleri.',
            icon: Code2,
        },
        {
            title: 'Kullanıcı Deneyimi & UI Tasarım',
            desc: 'Kullanıcı odaklı, ergonomik, estetik ve dönüşüm odaklı çağdaş web arayüzleri.',
            icon: Palette,
        },
        {
            title: 'SEO & Performans Mimarisi',
            desc: 'Google Core Web Vitals standartlarında, hızlı yüklenen ve semantik web altyapısı.',
            icon: Cpu,
        },
    ];

    const techTags = [
        'React',
        'Laravel',
        'TypeScript',
        'Tailwind CSS',
        'Inertia.js',
        'PHP',
        'MySQL',
        'UI/UX Tasarım',
        'SEO Mimarisi',
        'Framer Motion',
    ];

    const scrollToContact = () => {
        const el = document.querySelector('#iletisim');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const hasValidImage = profileImage && profileImage.trim() !== '' && !imgFailed;

    return (
        <section id="hakkimda" className="py-24 bg-white border-t border-[#DCE3EE] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="max-w-2xl mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3F6FB] border border-[#DCE3EE] text-[#155DFC] text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Hakkımda & Vizyon</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080F20] tracking-tight">
                        {title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Compact & High-End Profile Card (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#F3F6FB] rounded-3xl border-2 border-[#DCE3EE] p-5 sm:p-6 shadow-sm space-y-5">
                            
                            {/* Profile Visual Container */}
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#080F20] border-2 border-slate-800 shadow-md flex items-center justify-center group">
                                {hasValidImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Mehmet Arda"
                                        onError={() => setImgFailed(true)}
                                        className="w-full h-full object-cover object-center"
                                    />
                                ) : (
                                    /* High-End Vector Monogram Visual */
                                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#080F20] via-[#0F172A] to-[#155DFC]/40">
                                        <div className="absolute inset-0 bg-radial from-[#155DFC]/30 to-transparent blur-xl pointer-events-none" />
                                        
                                        <div className="relative w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-[#155DFC] transition-all duration-300">
                                            <span className="text-3xl font-black text-white tracking-tighter">MA</span>
                                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#155DFC] border-2 border-[#080F20]" />
                                        </div>

                                        <div className="mt-4 relative">
                                            <span className="text-base font-black text-white tracking-tight block">MEHMET ARDA</span>
                                            <span className="text-[10px] font-bold text-[#60A5FA] tracking-[0.2em] uppercase mt-0.5 block">
                                                STUDIO FOUNDER
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#DCE3EE] shadow-xs flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px] font-bold text-[#080F20]">Yeni Projelere Açık</span>
                                </div>
                            </div>

                            {/* Name & Title */}
                            <div>
                                <h3 className="text-xl font-extrabold text-[#080F20]">Mehmet Arda</h3>
                                <p className="text-xs font-bold text-[#155DFC] uppercase tracking-wider mt-0.5">
                                    Kurucu • Web Geliştirici & Tasarımcı
                                </p>
                            </div>

                            {/* Contact Links */}
                            <div className="space-y-2 pt-2 border-t border-[#DCE3EE] text-xs">
                                <a
                                    href={`tel:${phone.replace(/\s+/g, '')}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-[#DCE3EE] hover:border-[#155DFC] text-[#080F20] font-bold transition-colors shadow-2xs"
                                >
                                    <Phone className="w-4 h-4 text-[#155DFC]" />
                                    <span>{phone}</span>
                                </a>

                                <a
                                    href={`mailto:${email}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-[#DCE3EE] hover:border-[#155DFC] text-[#080F20] font-bold transition-colors shadow-2xs"
                                >
                                    <Mail className="w-4 h-4 text-[#155DFC]" />
                                    <span className="truncate">{email}</span>
                                </a>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <a
                                        href={instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border-2 border-[#DCE3EE] text-[#080F20] font-bold text-[11px] hover:border-rose-400 transition-colors shadow-2xs"
                                    >
                                        <InstagramIcon className="w-4 h-4 text-rose-500" />
                                        <span>Instagram</span>
                                    </a>

                                    <a
                                        href={whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border-2 border-[#DCE3EE] text-[#080F20] font-bold text-[11px] hover:border-emerald-400 transition-colors shadow-2xs"
                                    >
                                        <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                                        <span>WhatsApp</span>
                                    </a>
                                </div>
                            </div>

                            {/* Direct Action Button */}
                            <button
                                onClick={scrollToContact}
                                className="w-full py-3.5 px-4 rounded-xl bg-[#080F20] hover:bg-[#155DFC] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
                            >
                                <span>İletişime Geç</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Narrative & Expertise (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Narrative Box */}
                        <div className="bg-[#F3F6FB] rounded-3xl border-2 border-[#DCE3EE] p-6 sm:p-8 md:p-10 shadow-2xs space-y-4">
                            <h3 className="text-xl font-extrabold text-[#080F20] flex items-center gap-2.5">
                                <Terminal className="w-5 h-5 text-[#155DFC]" />
                                <span>Dijital Çözümlerde Titizlik ve Kararlılık</span>
                            </h3>

                            <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-normal">
                                {text}
                            </p>

                            <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-normal">
                                Şablon tasarımlar yerine, her markanın kendi dinamiklerine uygun arayüzler ve temiz kod mimarileri tasarlıyorum. Kullanıcıların sitenizde rahatça gezinmesi ve aradıklarını kolayca bulması için modern web teknolojilerini bir araya getiriyorum.
                            </p>
                        </div>

                        {/* Expertise Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {expertiseList.map((item, idx) => {
                                const IconComp = item.icon;
                                return (
                                    <motion.div
                                        key={item.title}
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-white p-6 rounded-2xl border-2 border-[#DCE3EE] shadow-2xs hover:border-[#155DFC] transition-colors space-y-2.5"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-[#F3F6FB] text-[#155DFC] flex items-center justify-center border border-[#DCE3EE]">
                                            <IconComp className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-sm font-extrabold text-[#080F20]">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-[#475569] leading-relaxed font-medium">
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Tech Tags */}
                        <div className="p-5 sm:p-7 rounded-2xl bg-white border-2 border-[#DCE3EE] space-y-3">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-[#080F20] block">
                                Çalışma Alanları & Temel Teknolojiler
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {techTags.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3.5 py-1.5 rounded-lg bg-[#F3F6FB] border border-[#DCE3EE] text-xs font-bold text-[#080F20] hover:border-[#155DFC] hover:text-[#155DFC] transition-colors"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
