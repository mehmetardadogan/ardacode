import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import { Service } from '../../types';

interface ServicesAdminProps {
    services: Service[];
}

export default function ServicesAdmin({ services = [] }: ServicesAdminProps) {
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const createForm = useForm({
        title: '',
        icon: 'Layout',
        short_description: '',
        full_description: '',
        features: '',
        order: 0,
        is_active: true,
    });

    const editForm = useForm({
        title: '',
        icon: 'Layout',
        short_description: '',
        full_description: '',
        features: '',
        order: 0,
        is_active: true,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/hizmetler', {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const openEdit = (s: Service) => {
        setEditingService(s);
        editForm.setData({
            title: s.title,
            icon: s.icon,
            short_description: s.short_description,
            full_description: s.full_description || '',
            features: s.features ? s.features.join(', ') : '',
            order: s.order,
            is_active: s.is_active,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        editForm.put(`/admin/hizmetler/${editingService.id}`, {
            onSuccess: () => {
                setEditingService(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
            router.delete(`/admin/hizmetler/${id}`);
        }
    };

    return (
        <AdminLayout title="Hizmet Yönetimi">
            <Head title="Hizmetler — Yönetim Paneli" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Ajans Hizmetleri ({services.length})</h2>
                        <p className="text-xs text-slate-500">Müşterilere sunulan hizmet kartlarını ve detaylarını yönetin</p>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Yeni Hizmet Ekle</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="py-3 px-4">İkon</th>
                                <th className="py-3 px-4">Hizmet Adı</th>
                                <th className="py-3 px-4">Kısa Açıklama</th>
                                <th className="py-3 px-4">Sıra</th>
                                <th className="py-3 px-4">Durum</th>
                                <th className="py-3 px-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {services.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-3 px-4 font-mono text-blue-600 font-bold">
                                        {s.icon}
                                    </td>
                                    <td className="py-3 px-4 font-bold text-slate-900">
                                        {s.title}
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                                        {s.short_description}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 font-mono">
                                        {s.order}
                                    </td>
                                    <td className="py-3 px-4">
                                        {s.is_active ? (
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
                                                Pasif
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-1">
                                        <button
                                            onClick={() => openEdit(s)}
                                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 inline-block cursor-pointer"
                                            title="Düzenle"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 inline-block cursor-pointer"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900">Yeni Hizmet Oluştur</h3>
                                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700">Hizmet Başlığı</label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.title}
                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        placeholder="Örn: Mobil Uygulama Geliştirme"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">İkon Adı (Lucide)</label>
                                        <select
                                            value={createForm.data.icon}
                                            onChange={(e) => createForm.setData('icon', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        >
                                            <option value="Layout">Layout (Tasarım)</option>
                                            <option value="Code2">Code2 (Yazılım)</option>
                                            <option value="ShoppingBag">ShoppingBag (E-Ticaret)</option>
                                            <option value="Palette">Palette (UI/UX)</option>
                                            <option value="Sparkles">Sparkles (Marka/Grafik)</option>
                                            <option value="TrendingUp">TrendingUp (SEO)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Sıra</label>
                                        <input
                                            type="number"
                                            value={createForm.data.order}
                                            onChange={(e) => createForm.setData('order', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Kısa Açıklama</label>
                                    <textarea
                                        rows={2}
                                        required
                                        value={createForm.data.short_description}
                                        onChange={(e) => createForm.setData('short_description', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Özellik Maddeleri (Virgülle ayırın)</label>
                                    <input
                                        type="text"
                                        value={createForm.data.features}
                                        onChange={(e) => createForm.setData('features', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        placeholder="Modern Tasarım, Hızlı Mimari, SEO Uyumlu"
                                    />
                                </div>

                                <div className="pt-3 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editingService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900">Hizmeti Düzenle: {editingService.title}</h3>
                                <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700">Hizmet Başlığı</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.title}
                                        onChange={(e) => editForm.setData('title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">İkon Adı</label>
                                        <select
                                            value={editForm.data.icon}
                                            onChange={(e) => editForm.setData('icon', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        >
                                            <option value="Layout">Layout</option>
                                            <option value="Code2">Code2</option>
                                            <option value="ShoppingBag">ShoppingBag</option>
                                            <option value="Palette">Palette</option>
                                            <option value="Sparkles">Sparkles</option>
                                            <option value="TrendingUp">TrendingUp</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Sıra</label>
                                        <input
                                            type="number"
                                            value={editForm.data.order}
                                            onChange={(e) => editForm.setData('order', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Kısa Açıklama</label>
                                    <textarea
                                        rows={2}
                                        required
                                        value={editForm.data.short_description}
                                        onChange={(e) => editForm.setData('short_description', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Özellik Maddeleri (Virgülle ayırın)</label>
                                    <input
                                        type="text"
                                        value={editForm.data.features}
                                        onChange={(e) => editForm.setData('features', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                    />
                                </div>

                                <div className="pt-3 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingService(null)}
                                        className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                                    >
                                        Güncelle
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
