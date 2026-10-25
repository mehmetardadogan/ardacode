import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Eye, X, Sparkles, ArrowRight, Layers, ExternalLink } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Project } from '../types';

interface ProjectsProps {
    projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
    const [activeFilter, setActiveFilter] = useState('Tümü');
    const [previewProject, setPreviewProject] = useState<Project | null>(null);

    const categories = ['Tümü', 'Web Tasarım', 'Yazılım', 'Grafik Tasarım', 'Kurumsal Kimlik'];

    const filteredProjects = activeFilter === 'Tümü'
        ? projects
        : projects.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

    // Body scroll lock and ESC key handling for modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPreviewProject(null);
            }
        };

        if (previewProject) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [previewProject]);

    return (
        <section id="projeler" className="py-24 bg-white border-t border-[#DCE3EE] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header & Filter Controls */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3F6FB] border border-[#DCE3EE] text-[#155DFC] text-xs font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Referans Vitrini & Çalışmalar</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080F20] tracking-tight">
                            Projelerimiz ve Çalışmalarımız
                        </h2>
                        <p className="text-sm text-[#475569] max-w-xl font-medium leading-relaxed">
                            Kullanıcı deneyimi, kurumsal estetik ve yüksek mühendislik kalitesiyle tasarladığımız referans çalışmalarımız.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-[#F3F6FB] p-1.5 rounded-2xl border-2 border-[#DCE3EE] self-start lg:self-end">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                    activeFilter === cat
                                        ? 'bg-[#155DFC] text-white shadow-md shadow-[#155DFC]/20'
                                        : 'text-[#475569] hover:text-[#080F20] hover:bg-white/60'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, idx) => {
                            // Dynamic Bento sizing when viewing all projects
                            const isAll = activeFilter === 'Tümü';
                            let bentoColSpan = 'lg:col-span-4';
                            let isDarkTheme = false;

                            if (isAll) {
                                if (idx === 0) bentoColSpan = 'lg:col-span-8';
                                else if (idx === 1) {
                                    bentoColSpan = 'lg:col-span-4';
                                    isDarkTheme = true;
                                }
                                else if (idx === 2) bentoColSpan = 'lg:col-span-4';
                                else if (idx === 3) bentoColSpan = 'lg:col-span-4';
                                else if (idx === 4) bentoColSpan = 'lg:col-span-4';
                                else if (idx === 5) bentoColSpan = 'lg:col-span-8';
                            } else {
                                if (filteredProjects.length === 1) bentoColSpan = 'lg:col-span-12';
                                else if (filteredProjects.length === 2) bentoColSpan = 'lg:col-span-6';
                                else bentoColSpan = 'lg:col-span-4';
                            }

                            return (
                                <motion.div
                                    layout
                                    key={project.id || project.slug}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                                    className={`${bentoColSpan} group ${
                                        isDarkTheme
                                            ? 'bg-[#080F20] text-white border-2 border-slate-800 hover:border-[#155DFC]'
                                            : 'bg-white text-[#080F20] border-2 border-[#DCE3EE] hover:border-[#155DFC]'
                                    } rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between`}
                                >
                                    {/* Thumbnail / Mockup Presentation Container */}
                                    <div 
                                        onClick={() => setPreviewProject(project)}
                                        className={`relative ${
                                            isAll && (idx === 0 || idx === 5) ? 'aspect-16/9 sm:aspect-21/9 lg:aspect-16/9' : 'aspect-16/10'
                                        } overflow-hidden bg-[#0A0F1D] cursor-pointer`}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setPreviewProject(project);
                                            }
                                        }}
                                        aria-label={`${project.title} önizlemesi`}
                                    >
                                        <img
                                            src={project.image || '/images/projects/project-1.svg'}
                                            alt={project.title}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        
                                        {/* Hover Overlay with Quick Action Buttons */}
                                        <div className="absolute inset-0 bg-[#080F20]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-2xs">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewProject(project);
                                                }}
                                                className="px-4 py-2.5 rounded-xl bg-white text-[#080F20] text-xs font-bold flex items-center gap-1.5 hover:bg-[#F3F6FB] transition-colors shadow-lg cursor-pointer"
                                            >
                                                <Eye className="w-4 h-4 text-[#155DFC]" />
                                                <span>Önizle</span>
                                            </button>
                                            <Link
                                                href={`/projeler/${project.slug}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-4 py-2.5 rounded-xl bg-[#155DFC] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#0047D4] transition-colors shadow-lg"
                                            >
                                                <span>Detay Sayfası</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </div>

                                        {/* Badges: Demo vs Real Customer Distinction */}
                                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
                                            {project.is_demo ? (
                                                <div className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-md flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                    <span>Demo Proje Vitrini</span>
                                                </div>
                                            ) : (
                                                <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-md flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                    <span>Müşteri Projesi</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute top-3.5 right-3.5 bg-[#080F20]/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold border border-white/10 pointer-events-none">
                                            {project.category}
                                        </div>
                                    </div>

                                    {/* Content Details */}
                                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[11px] font-black uppercase tracking-wider ${
                                                    isDarkTheme ? 'text-[#60A5FA]' : 'text-[#155DFC]'
                                                }`}>
                                                    {project.category}
                                                </span>
                                                {project.is_featured && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                        isDarkTheme ? 'bg-white/10 text-slate-300' : 'bg-blue-50 text-[#155DFC]'
                                                    }`}>
                                                        Öne Çıkan
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className={`text-xl sm:text-2xl font-black ${
                                                isDarkTheme
                                                    ? 'text-white group-hover:text-[#60A5FA]'
                                                    : 'text-[#080F20] group-hover:text-[#155DFC]'
                                            } transition-colors tracking-tight`}>
                                                <Link href={`/projeler/${project.slug}`}>
                                                    {project.title}
                                                </Link>
                                            </h3>

                                            <p className={`text-xs sm:text-sm ${
                                                isDarkTheme ? 'text-slate-300' : 'text-[#334155]'
                                            } line-clamp-2 leading-relaxed font-normal`}>
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Technology Tags */}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className={`flex flex-wrap gap-1.5 pt-3 border-t ${
                                                isDarkTheme ? 'border-slate-800' : 'border-[#DCE3EE]'
                                            }`}>
                                                {project.technologies.map((tech, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                                                            isDarkTheme
                                                                ? 'bg-slate-900 text-slate-200 border-slate-700'
                                                                : 'bg-[#F3F6FB] text-[#080F20] border-[#DCE3EE]'
                                                        }`}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Bar */}
                                        <div className={`pt-3 border-t ${isDarkTheme ? 'border-slate-800' : 'border-[#DCE3EE]'} flex items-center justify-between gap-2`}>
                                            <Link
                                                href={`/projeler/${project.slug}`}
                                                className={`text-xs font-bold ${
                                                    isDarkTheme ? 'text-[#60A5FA] hover:text-white' : 'text-[#155DFC] hover:text-[#0047D4]'
                                                } inline-flex items-center gap-1.5 group/btn`}
                                            >
                                                <span>Projeyi İncele</span>
                                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => setPreviewProject(project)}
                                                className={`text-[11px] font-bold ${
                                                    isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-[#475569] hover:text-[#155DFC]'
                                                } transition-colors cursor-pointer`}
                                            >
                                                Hızlı Önizle
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Bento CTA Card (Displayed when All Projects are active) */}
                        {activeFilter === 'Tümü' && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35, delay: 0.3 }}
                                className="lg:col-span-4 bg-gradient-to-br from-[#080F20] via-[#0F172A] to-[#155DFC] text-white rounded-3xl border-2 border-slate-800 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden"
                            >
                                <div className="space-y-4 relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#60A5FA] text-xs font-bold backdrop-blur-md">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Yeni Proje Başlatın</span>
                                    </div>

                                    <h3 className="text-2xl font-black tracking-tight leading-snug">
                                        Sıradaki Başarı Hikayesi Sizin Markanız Olsun.
                                    </h3>

                                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                                        İhtiyaçlarınıza özel modern web tasarımı, kurumsal yazılım veya e-ticaret altyapısını birlikte planlayalım.
                                    </p>
                                </div>

                                <div className="pt-6 relative z-10 space-y-3">
                                    <a
                                        href="#iletisim"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const el = document.getElementById('iletisim');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-slate-100 text-[#080F20] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                                    >
                                        <span>Ücretsiz Teklif İsteyin</span>
                                        <ArrowUpRight className="w-4 h-4 text-[#155DFC]" />
                                    </a>

                                    <a
                                        href="https://wa.me/905314668927"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 px-5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-white/15"
                                    >
                                        <span>WhatsApp'tan Hızlı Sorun</span>
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Premium Project Detail Modal */}
            <AnimatePresence>
                {previewProject && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#080F20]/80 backdrop-blur-md overflow-hidden"
                        onClick={() => setPreviewProject(null)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-project-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 16 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl max-w-[1000px] w-full max-h-[90dvh] flex flex-col border-2 border-[#DCE3EE] shadow-2xl relative overflow-hidden"
                        >
                            {/* Safe Top-Right Close Button */}
                            <button
                                onClick={() => setPreviewProject(null)}
                                className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-[#080F20]/80 hover:bg-[#080F20] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-105 shadow-xl cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#155DFC]"
                                aria-label="Modalı Kapat"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* 16:9 Aspect Upper Visual Presentation (Optimized Max-Height to Prevent Oversizing) */}
                            <div className="relative aspect-16/9 max-h-[220px] sm:max-h-[320px] md:max-h-[360px] w-full bg-gradient-to-b from-[#080F20] to-[#0A1020] shrink-0 overflow-hidden flex items-center justify-center border-b border-[#DCE3EE]">
                                <img
                                    src={previewProject.image || '/images/projects/project-1.svg'}
                                    alt={previewProject.title}
                                    className="w-full h-full object-contain p-2 sm:p-4"
                                />
                                {previewProject.is_demo && (
                                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 pointer-events-none">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        <span>Demo Proje Vitrini</span>
                                    </div>
                                )}
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto flex-1 space-y-6">
                                
                                {/* Meta Pill Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3EE] pb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-lg bg-[#F3F6FB] border border-[#DCE3EE] text-xs font-black text-[#155DFC] uppercase tracking-wider">
                                            {previewProject.category}
                                        </span>
                                        {previewProject.is_featured && (
                                            <span className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-[#155DFC]">
                                                Öne Çıkan Çalışma
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-[#475569]">
                                        Mehmet Arda Studio Referansı
                                    </span>
                                </div>

                                {/* Title & Narrative */}
                                <div className="space-y-3">
                                    <h3 id="modal-project-title" className="text-2xl sm:text-3xl font-black text-[#080F20] tracking-tight">
                                        {previewProject.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-normal">
                                        {previewProject.description}
                                    </p>
                                </div>

                                {/* Technologies & Standards */}
                                {previewProject.technologies && previewProject.technologies.length > 0 && (
                                    <div className="space-y-2.5 pt-2">
                                        <span className="text-xs font-extrabold text-[#080F20] uppercase tracking-wider block">
                                            Kullanılan Teknolojiler & Standartlar:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {previewProject.technologies.map((t, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3.5 py-1.5 bg-[#F3F6FB] text-[#080F20] text-xs font-bold rounded-xl border border-[#DCE3EE]"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Balanced Action Buttons (Stacked on Mobile, Balanced on Desktop) */}
                                <div className="pt-6 border-t border-[#DCE3EE] flex flex-col sm:flex-row items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewProject(null)}
                                        className="w-full sm:w-auto px-7 py-3.5 rounded-full border-2 border-[#DCE3EE] text-[#080F20] hover:bg-[#F3F6FB] font-bold text-xs transition-colors cursor-pointer text-center order-2 sm:order-1"
                                    >
                                        Pencereyi Kapat
                                    </button>

                                    <Link
                                        href={`/projeler/${previewProject.slug}`}
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#155DFC] hover:bg-[#0047D4] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#155DFC]/25 transition-all duration-200 order-1 sm:order-2"
                                    >
                                        <span>Detaylı Sayfayı İncele</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
