import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    Code2,
    TrendingUp,
    CheckCircle,
} from 'lucide-react';
import { WhatsAppIcon } from './Icons';

interface HeroProps {
    whatsappUrl?: string;
}

export default function Hero({
    whatsappUrl = 'https://wa.me/905314668927',
}: HeroProps) {
    // 3D Parallax & Tilt Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 180 };
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const scrollTo = (id: string) => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="hero"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden bg-white bg-grid-tech"
        >
            {/* Ambient Multi-Layer Radial Glows */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[760px] h-[520px] bg-gradient-to-tr from-[#155DFC]/15 via-[#6D28D9]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/3 -right-24 w-96 h-96 bg-[#155DFC]/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 -left-20 w-96 h-96 bg-[#6D28D9]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Headlines & High-Contrast Typography */}
                    <div className="lg:col-span-7 space-y-8">
                        
                        {/* Premium Agency Pill Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F3F6FB] border border-[#DCE3EE] shadow-2xs"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#155DFC] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#155DFC]"></span>
                            </span>
                            <span className="text-xs font-bold text-[#080F20] tracking-wide">
                                Mersin Web Tasarım &amp; Yazılım
                            </span>
                        </motion.div>

                        {/* Bold Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-6xl lg:text-[68px] font-black text-[#080F20] tracking-tight leading-[1.06]"
                        >
                            <span>Mersin Web Tasarım</span>{' '}
                            <span className="block mt-1 bg-gradient-to-r from-[#155DFC] via-[#2563EB] to-[#6D28D9] bg-clip-text text-transparent">
                                Markanıza Özel
                            </span>{' '}
                            <span className="block mt-1">Dijital Deneyimler.</span>
                        </motion.h1>

                        {/* Description with High-Contrast Slate-700 */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl font-medium"
                        >
                            Mehmet Arda Studio (ArdaCode) ile Mersin’deki işletmeler ve Türkiye genelindeki markalar için mobil uyumlu kurumsal web siteleri, e-ticaret çözümleri ve özel web yazılımları geliştiriyoruz.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-1"
                        >
                            <button
                                onClick={() => scrollTo('#projeler')}
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full text-xs sm:text-sm font-bold text-white bg-[#155DFC] hover:bg-[#0047D4] shadow-xl shadow-[#155DFC]/25 hover:shadow-2xl hover:shadow-[#155DFC]/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                            >
                                <span>Projelerimi İncele</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-xs sm:text-sm font-bold text-[#080F20] bg-[#F3F6FB] hover:bg-slate-200/80 border border-[#DCE3EE] transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                                <span>WhatsApp'tan İletişime Geç</span>
                            </a>
                        </motion.div>

                        {/* Quick Trust Highlights */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 border-t border-[#DCE3EE] max-w-lg"
                        >
                            <div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#080F20] tracking-tight">100%</div>
                                <div className="text-[10px] sm:text-xs text-[#475569] font-semibold mt-0.5 leading-tight">Mobil &amp; SEO Uyum</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#155DFC] tracking-tight">98+</div>
                                <div className="text-[10px] sm:text-xs text-[#475569] font-semibold mt-0.5 leading-tight">Performans Puanı</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#080F20] tracking-tight">Modern</div>
                                <div className="text-[10px] sm:text-xs text-[#475569] font-semibold mt-0.5 leading-tight">Yazılım Standardı</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Realistic 3D Laptop & Floating Dashboard Architecture */}
                    <div className="lg:col-span-5 relative perspective-1000 flex items-center justify-center pt-6 lg:pt-0">
                        <motion.div
                            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                            animate={{ y: [-7, 7, -7] }}
                            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                            className="relative w-full max-w-lg select-none"
                        >
                            {/* Ambient Light Bloom Behind Frame */}
                            <div className="absolute -inset-3 bg-gradient-to-tr from-[#155DFC]/30 via-[#6D28D9]/20 to-[#3B82F6]/30 rounded-3xl blur-2xl opacity-80" />

                            {/* Realistic Aluminum Laptop Device Structure */}
                            <div className="relative bg-[#080F20] rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden p-2.5">
                                
                                {/* Inner Screen Bezel with Camera Notch */}
                                <div className="relative rounded-xl overflow-hidden bg-[#0A0F1D] border border-slate-800">
                                    
                                    {/* Notch Header Bar */}
                                    <div className="bg-[#0F172A] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        </div>
                                        <div className="bg-[#080F20] border border-slate-800 rounded-md px-3 py-1 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#155DFC] animate-pulse" />
                                            <span className="text-[10px] font-mono text-slate-300">ardacode.com.tr</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-emerald-400 font-mono">● LIVE</span>
                                    </div>

                                    {/* Dashboard Content Inside Laptop */}
                                    <div className="p-5 space-y-4 bg-gradient-to-b from-[#0A0F1D] to-[#080F20]">
                                        
                                        {/* App Topbar Row */}
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-[#155DFC] text-white flex items-center justify-center font-black text-[10px]">
                                                    MA
                                                </div>
                                                <span className="text-xs font-black text-white">MEHMET ARDA STUDIO</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#60A5FA] bg-[#155DFC]/20 px-2.5 py-0.5 rounded-full border border-[#155DFC]/40">
                                                Enterprise Suite
                                            </span>
                                        </div>

                                        {/* Dynamic Growth Hero Card inside Screen */}
                                        <div className="p-4 rounded-xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-slate-700/80 space-y-2 shadow-md">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-[#38BDF8] flex items-center gap-1">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    <span>Özgün &amp; Hızlı Yazılım Mimarisi</span>
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400">99.8% Uptime</span>
                                            </div>
                                            <h4 className="text-sm font-extrabold text-white">Yeni Nesil Dijital Varlıklar</h4>
                                            
                                            {/* Micro Sparkline */}
                                            <div className="h-8 w-full flex items-end gap-1.5 pt-1">
                                                <div className="flex-1 bg-[#155DFC]/40 h-3 rounded-t-xs" />
                                                <div className="flex-1 bg-[#155DFC]/50 h-5 rounded-t-xs" />
                                                <div className="flex-1 bg-[#155DFC]/60 h-4 rounded-t-xs" />
                                                <div className="flex-1 bg-[#155DFC]/70 h-6 rounded-t-xs" />
                                                <div className="flex-1 bg-[#155DFC] h-8 rounded-t-xs" />
                                                <div className="flex-1 bg-emerald-500 h-7 rounded-t-xs" />
                                            </div>
                                        </div>

                                        {/* Two Metric Cards */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                                                <div className="flex items-center gap-1.5 text-[#38BDF8]">
                                                    <Zap className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-extrabold text-white">Hız: 99/100</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-medium">Core Web Vitals</p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                                                <div className="flex items-center gap-1.5 text-emerald-400">
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-extrabold text-white">%100 Güvenlik</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-medium">OWASP Korumalı</p>
                                            </div>
                                        </div>

                                        {/* Code & Technology Pill */}
                                        <div className="p-2.5 rounded-xl bg-[#080F20] text-slate-300 font-mono text-[10px] flex items-center justify-between border border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <Code2 className="w-3.5 h-3.5 text-[#155DFC]" />
                                                <span className="font-semibold text-slate-200">stack: ['React', 'Laravel 12', 'Tailwind']</span>
                                            </div>
                                            <span className="text-emerald-400 font-bold">active</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Laptop Bottom Notch Indicator */}
                                <div className="h-3 flex items-center justify-center pt-1">
                                    <div className="w-20 h-1 rounded-full bg-slate-700/80" />
                                </div>
                            </div>

                            {/* Floating Tech Badges with Depth */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                                className="absolute -top-3 -right-2 sm:-top-6 sm:-right-6 bg-white border-2 border-[#DCE3EE] shadow-xl rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-2.5 backdrop-blur-md z-10"
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-[#155DFC]" />
                                <span className="text-[11px] sm:text-xs font-black text-[#080F20]">React + Laravel 12</span>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                                className="absolute -bottom-3 -left-2 sm:-bottom-6 sm:-left-6 bg-white border-2 border-[#DCE3EE] shadow-xl rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-2.5 backdrop-blur-md z-10"
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-[11px] sm:text-xs font-extrabold text-[#080F20]">SEO &amp; Ultra Performans</span>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
