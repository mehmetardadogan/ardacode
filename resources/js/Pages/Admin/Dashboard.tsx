import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import {
    FolderKanban,
    Briefcase,
    MessageSquare,
    Clock,
    ArrowUpRight,
    Plus,
    CheckCircle2,
    Eye,
} from 'lucide-react';
import { Project, Message } from '../../types';

interface DashboardProps {
    stats: {
        total_projects: number;
        total_services: number;
        total_messages: number;
        unread_messages: number;
    };
    latestMessages: Message[];
    recentProjects: Project[];
}

export default function Dashboard({ stats, latestMessages = [], recentProjects = [] }: DashboardProps) {
    return (
        <AdminLayout title="Kontrol Paneli">
            <Head title="Admin Dashboard — Mehmet Arda Studio" />

            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Toplam Proje</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FolderKanban className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">{stats.total_projects}</div>
                        <Link href="/admin/projeler" className="text-[11px] font-semibold text-blue-600 hover:underline">
                            Projeleri Yönet →
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Aktif Hizmetler</span>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Briefcase className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">{stats.total_services}</div>
                        <Link href="/admin/hizmetler" className="text-[11px] font-semibold text-indigo-600 hover:underline">
                            Hizmetleri Düzenle →
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Gelen Mesajlar</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">{stats.total_messages}</div>
                        <Link href="/admin/mesajlar" className="text-[11px] font-semibold text-emerald-600 hover:underline">
                            Gelen Kutusunu Aç →
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Okunmamış</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-amber-600">{stats.unread_messages}</div>
                        <span className="text-[11px] text-slate-400">Yeni müşteri talebi</span>
                    </div>
                </div>

                {/* Two Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Latest Messages */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Son İletişim Mesajları</h3>
                                <p className="text-xs text-slate-400">Müşterilerden gelen son form gönderimleri</p>
                            </div>
                            <Link href="/admin/mesajlar" className="text-xs font-semibold text-blue-600 hover:underline">
                                Tümünü Gör
                            </Link>
                        </div>

                        {latestMessages.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">Henüz gelen mesaj bulunmuyor.</p>
                        ) : (
                            <div className="space-y-3">
                                {latestMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-colors ${
                                            msg.is_read
                                                ? 'bg-slate-50/50 border-slate-100 text-slate-600'
                                                : 'bg-blue-50/30 border-blue-200/60 text-slate-900 font-medium'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900">{msg.name}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(msg.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        <div className="text-[11px] text-blue-600 font-semibold">{msg.service || 'Genel İletişim'}</div>
                                        <p className="text-xs text-slate-600 line-clamp-1">{msg.details}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Projects */}
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Portföy Projeleri</h3>
                                <p className="text-xs text-slate-400">Son vitrin çalışmaları</p>
                            </div>
                            <Link
                                href="/admin/projeler"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Yeni Ekle</span>
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentProjects.map((p) => (
                                <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                    <img
                                        src={p.image || '/images/projects/project-1.svg'}
                                        alt={p.title}
                                        className="w-12 h-10 object-cover rounded-lg bg-slate-900 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                                        <span className="text-[10px] text-slate-400">{p.category}</span>
                                    </div>
                                    <Link
                                        href={`/projeler/${p.slug}`}
                                        target="_blank"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
