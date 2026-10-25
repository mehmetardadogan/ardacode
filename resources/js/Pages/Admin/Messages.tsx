import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Mail, Check, Trash2, Phone, Calendar, User, MessageCircle, X } from 'lucide-react';
import { Message } from '../../types';

interface MessagesProps {
    messages: Message[];
}

export default function Messages({ messages = [] }: MessagesProps) {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const toggleRead = (id: number) => {
        router.post(`/admin/mesajlar/${id}/toggle`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Bu mesajı kalıcı olarak silmek istediğinize emin misiniz?')) {
            router.delete(`/admin/mesajlar/${id}`, {
                onSuccess: () => {
                    if (selectedMessage?.id === id) {
                        setSelectedMessage(null);
                    }
                },
            });
        }
    };

    return (
        <AdminLayout title="İletişim Mesajları">
            <Head title="Mesajlar — Yönetim Paneli" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Gelen Mesaj Kutusu ({messages.length})</h2>
                    <p className="text-xs text-slate-500">Müşteri taleplerini, proje tekliflerini ve iletişim formlarını inceleyin</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Message List (Left) */}
                    <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
                        {messages.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400">
                                Gelen kutunuzda mesaj bulunmuyor.
                            </div>
                        ) : (
                            messages.map((m) => (
                                <div
                                    key={m.id}
                                    onClick={() => setSelectedMessage(m)}
                                    className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                                        selectedMessage?.id === m.id
                                            ? 'bg-blue-50/70 border-l-4 border-blue-600'
                                            : m.is_read
                                            ? 'bg-white hover:bg-slate-50'
                                            : 'bg-blue-50/20 hover:bg-blue-50/40 font-medium'
                                    }`}
                                >
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-900 truncate">{m.name}</span>
                                            {!m.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                                            )}
                                        </div>
                                        <div className="text-[11px] text-blue-600 font-semibold truncate">
                                            {m.service || 'Genel İletişim'}
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2">{m.details}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                        {new Date(m.created_at).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Message Detail (Right) */}
                    <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                        {selectedMessage ? (
                            <div className="space-y-6">
                                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">{selectedMessage.name}</h3>
                                        <span className="text-xs text-blue-600 font-medium">{selectedMessage.service || 'Hizmet Belirtilmedi'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleRead(selectedMessage.id)}
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            <span>{selectedMessage.is_read ? 'Okunmadı Yap' : 'Okundu Yap'}</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(selectedMessage.id)}
                                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                        <span className="text-[10px] text-slate-400 font-semibold uppercase">E-posta</span>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-slate-900 font-bold hover:text-blue-600 block truncate">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Telefon</span>
                                        <a href={`tel:${selectedMessage.phone}`} className="text-slate-900 font-bold hover:text-blue-600 block">
                                            {selectedMessage.phone || 'Belirtilmedi'}
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-slate-700">Proje Detayları & Mesaj:</span>
                                    <div className="p-4 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
                                        {selectedMessage.details}
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                                    <span>IP: {selectedMessage.ip_address || 'Gizli'}</span>
                                    <span>Tarih: {new Date(selectedMessage.created_at).toLocaleString('tr-TR')}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center text-xs text-slate-400 space-y-2">
                                <Mail className="w-8 h-8 mx-auto text-slate-300" />
                                <p>Detaylarını görüntülemek için soldan bir mesaj seçin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
