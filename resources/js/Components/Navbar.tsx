import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

interface NavbarProps {
    siteLogo?: string;
}

export default function Navbar({ siteLogo }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Check if user has scrolled near bottom of page
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
                setActiveSection('iletisim');
                return;
            }

            const sections = ['hero', 'hakkimda', 'hizmetler', 'projeler', 'surec', 'iletisim'];
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const el = document.getElementById(section);
                if (el) {
                    const top = el.offsetTop;
                    if (window.scrollY >= top - 200) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const navLinks = [
        { label: 'Ana Sayfa', href: '#hero', id: 'hero' },
        { label: 'Hakkımda', href: '#hakkimda', id: 'hakkimda' },
        { label: 'Hizmetler', href: '#hizmetler', id: 'hizmetler' },
        { label: 'Projeler', href: '#projeler', id: 'projeler' },
        { label: 'Çalışma Süreci', href: '#surec', id: 'surec' },
        { label: 'İletişim', href: '#iletisim', id: 'iletisim' },
    ];

    const scrollTo = (href: string, id?: string) => {
        setMobileOpen(false);
        if (id) {
            setActiveSection(id);
        }
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-[#DCE3EE] shadow-sm py-3.5'
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo('#hero');
                        }}
                        className="flex items-center gap-3.5 group cursor-pointer"
                    >
                        <img
                            src={siteLogo || '/images/logo.svg'}
                            alt="MEHMET ARDA STUDIO"
                            className="h-8 sm:h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                        />
                    </a>

                    {/* Navigation Pills (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-[#DCE3EE] shadow-xs">
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.id;
                            return (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollTo(link.href, link.id);
                                    }}
                                    className={`relative px-4 pt-2 pb-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex flex-col items-center justify-center ${
                                        isActive
                                            ? 'text-[#080F20] bg-[#F3F6FB] shadow-2xs font-bold'
                                            : 'text-[#475569] hover:text-[#080F20] hover:bg-slate-50'
                                    }`}
                                >
                                    <span>{link.label}</span>
                                    {isActive ? (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#155DFC] shadow-xs mt-1" />
                                    ) : (
                                        <span className="w-1.5 h-1.5 opacity-0 mt-1 pointer-events-none" />
                                    )}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Right CTA Button & Mobile Trigger */}
                    <div className="flex items-center gap-3">
                        <a
                            href="#iletisim"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollTo('#iletisim');
                            }}
                            className="hidden sm:inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#155DFC] hover:bg-[#0047D4] shadow-md shadow-[#155DFC]/25 hover:shadow-lg hover:shadow-[#155DFC]/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
                        >
                            <span>Projenizi Konuşalım</span>
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                <ArrowUpRight className="w-3 h-3 text-white" />
                            </div>
                        </a>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2.5 rounded-xl text-[#080F20] hover:bg-[#F3F6FB] border border-[#DCE3EE] transition-colors cursor-pointer"
                            aria-label={mobileOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden bg-white border-b border-[#DCE3EE] px-5 pt-4 pb-6 space-y-2.5 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollTo(link.href);
                            }}
                            className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#080F20] hover:bg-[#F3F6FB] hover:text-[#155DFC] transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-2">
                        <a
                            href="#iletisim"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollTo('#iletisim');
                            }}
                            className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-[#155DFC] hover:bg-[#0047D4] transition-all shadow-md"
                        >
                            <span>Projenizi Konuşalım</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
