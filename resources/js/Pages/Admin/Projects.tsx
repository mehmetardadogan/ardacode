import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Image, ExternalLink, X, Eye } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsProps {
    projects: Project[];
}

export default function Projects({ projects = [] }: ProjectsProps) {
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form for Create
    const createForm = useForm({
        title: '',
        category: 'Web Tasarım',
        description: '',
        technologies: 'React, Tailwind CSS, TypeScript',
        live_url: '',
        is_demo: true,
        is_featured: true,
        order: 0,
        image_file: null as File | null,
    });

    // Form for Edit
    const editForm = useForm({
        title: '',
        category: 'Web Tasarım',
        description: '',
        technologies: '',
        live_url: '',
        is_demo: true,
        is_featured: true,
        order: 0,
        image_file: null as File | null,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/projeler', {
            forceFormData: true,
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const openEdit = (project: Project) => {
        setEditingProject(project);
        editForm.setData({
            title: project.title,
            category: project.category,
            description: project.description,
            technologies: project.technologies ? project.technologies.join(', ') : '',
            live_url: project.live_url || '',
            is_demo: project.is_demo,
            is_featured: project.is_featured,
            order: project.order,
            image_file: null,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        editForm.post(`/admin/projeler/${editingProject.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setEditingProject(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
            router.delete(`/admin/projeler/${id}`);
        }
    };

    return (
        <AdminLayout title="Proje Yönetimi">
            <Head title="Projeler — Yönetim Paneli" />

            <div className="space-y-6">
                {/* Top Action Bar */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Tüm Projeler ({projects.length})</h2>
                        <p className="text-xs text-slate-500">Portföyünüzde sergilenen çalışmaları yönetin</p>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Yeni Proje Ekle</span>
                    </button>
                </div>

                {/* Projects Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3 px-4">Görsel</th>
                                    <th className="py-3 px-4">Proje Başlığı</th>
                                    <th className="py-3 px-4">Kategori</th>
                                    <th className="py-3 px-4">Teknolojiler</th>
                                    <th className="py-3 px-4">Durum</th>
                                    <th className="py-3 px-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3 px-4">
                                            <img
                                                src={p.image || '/images/projects/project-1.svg'}
                                                alt={p.title}
                                                className="w-14 h-9 object-cover rounded-md bg-slate-900"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-900">{p.title}</div>
                                            <div className="text-[10px] text-slate-400 truncate max-w-xs">{p.description}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-slate-500 text-[11px]">
                                                {p.technologies ? p.technologies.slice(0, 3).join(', ') : '-'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {p.is_demo ? (
                                                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                                                    Demo
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                                    Canlı
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-1">
                                            <a
                                                href={`/projeler/${p.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 inline-block"
                                                title="Detayı Gör"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </a>
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 inline-block cursor-pointer"
                                                title="Düzenle"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
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
                </div>

                {/* Create Project Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900">Yeni Proje Ekle</h3>
                                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700">Proje Başlığı</label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.title}
                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        placeholder="Örn: Horizon Finansal Analitik Platformu"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Kategori</label>
                                        <select
                                            value={createForm.data.category}
                                            onChange={(e) => createForm.setData('category', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        >
                                            <option value="Web Tasarım">Web Tasarım</option>
                                            <option value="Yazılım">Yazılım</option>
                                            <option value="Grafik Tasarım">Grafik Tasarım</option>
                                            <option value="Kurumsal Kimlik">Kurumsal Kimlik</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Sıralama (Order)</label>
                                        <input
                                            type="number"
                                            value={createForm.data.order}
                                            onChange={(e) => createForm.setData('order', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Açıklama</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1 resize-none"
                                        placeholder="Projenin amacı, mimari çözümleri ve sağlanan faydalar..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Kullanılan Teknolojiler (Virgülle ayırın)</label>
                                    <input
                                        type="text"
                                        value={createForm.data.technologies}
                                        onChange={(e) => createForm.setData('technologies', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        placeholder="React, Laravel, Tailwind CSS, TypeScript"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Kapak Görseli Yükle</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => createForm.setData('image_file', e.target.files ? e.target.files[0] : null)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-0.5">Seçilmezse varsayılan kurumsal mockup kullanılır.</p>
                                </div>

                                <div className="flex items-center gap-4 pt-1">
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={createForm.data.is_demo}
                                            onChange={(e) => createForm.setData('is_demo', e.target.checked)}
                                            className="rounded text-blue-600"
                                        />
                                        <span>Demo Proje Olarak İşaretle</span>
                                    </label>
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

                {/* Edit Project Modal */}
                {editingProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900">Projeyi Düzenle: {editingProject.title}</h3>
                                <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700">Proje Başlığı</label>
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
                                        <label className="text-xs font-bold text-slate-700">Kategori</label>
                                        <select
                                            value={editForm.data.category}
                                            onChange={(e) => editForm.setData('category', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        >
                                            <option value="Web Tasarım">Web Tasarım</option>
                                            <option value="Yazılım">Yazılım</option>
                                            <option value="Grafik Tasarım">Grafik Tasarım</option>
                                            <option value="Kurumsal Kimlik">Kurumsal Kimlik</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Sıralama (Order)</label>
                                        <input
                                            type="number"
                                            value={editForm.data.order}
                                            onChange={(e) => editForm.setData('order', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Açıklama</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Kullanılan Teknolojiler (Virgülle ayırın)</label>
                                    <input
                                        type="text"
                                        value={editForm.data.technologies}
                                        onChange={(e) => editForm.setData('technologies', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700">Yeni Görsel Yükle (İsteğe bağlı)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => editForm.setData('image_file', e.target.files ? e.target.files[0] : null)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-1">
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editForm.data.is_demo}
                                            onChange={(e) => editForm.setData('is_demo', e.target.checked)}
                                            className="rounded text-blue-600"
                                        />
                                        <span>Demo Proje Olarak İşaretle</span>
                                    </label>
                                </div>

                                <div className="pt-3 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingProject(null)}
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
