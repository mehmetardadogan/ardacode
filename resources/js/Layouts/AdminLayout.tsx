import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    FolderKanban,
    Briefcase,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    ExternalLink,
    Sparkles,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { PageProps } from '../types';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth, flash } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentUrl = window.location.pathname;

    const navItems = [
        { label: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
        { label: 'Projeler', href: '/admin/projeler', icon: FolderKanban },
        { label: 'Hizmetler', href: '/admin/hizmetler', icon: Briefcase },
        { label: 'Mesajlar', href: '/admin/mesajlar', icon: MessageSquare },
        { label: 'Site Ayarları & SEO', href: '/admin/ayarlar', icon: Settings },
    ];

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
                {/* Brand */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
                            MA
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">MEHMET ARDA</span>
                            <span className="text-[10px] font-bold text-blue-600 tracking-wider">YÖNETİM PANELİ</span>
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentUrl === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User & Actions */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between w-full px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <span>Siteyi Görüntüle</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Güvenli Çıkış</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Modal */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-64 bg-white flex flex-col p-4 shadow-2xl z-10">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                            <span className="text-xs font-bold text-slate-900">MEHMET ARDA STUDIO</span>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentUrl === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                                            isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-base font-bold text-slate-900">{title}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <span className="text-xs font-bold text-slate-900 block">{auth.user?.name || 'Mehmet Arda'}</span>
                            <span className="text-[10px] text-slate-400 font-medium">Yönetici</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            MA
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash.success && (
                    <div className="m-4 sm:m-8 mb-0 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash.error && (
                    <div className="m-4 sm:m-8 mb-0 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Body */}
                <main className="flex-1 p-4 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
