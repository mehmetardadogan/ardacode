import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Save, Upload, Sparkles, Globe, Shield, Phone, Mail } from 'lucide-react';
import { SiteSettings } from '../../types';

interface SettingsProps {
    settings: SiteSettings;
}

export default function Settings({ settings = {} }: SettingsProps) {
    const { data, setData, post, processing } = useForm({
        site_name: settings.site_name || 'MEHMET ARDA STUDIO',
        founder_name: settings.founder_name || 'Mehmet Arda',
        slogan: settings.slogan || 'Dijital Dünyada Fark Yaratan Çözümler.',
        alt_slogan: settings.alt_slogan || 'Fikirlerinizi Dijital Başarıya Dönüştürüyoruz.',
        hero_title_line1: settings.hero_title_line1 || 'Dijital Dünyada',
        hero_title_line2: settings.hero_title_line2 || 'İz Bırakan',
        hero_title_line3: settings.hero_title_line3 || 'Deneyimler Tasarlıyoruz.',
        hero_description: settings.hero_description || '',
        about_title: settings.about_title || 'Merhaba, Ben Mehmet Arda.',
        about_text: settings.about_text || '',
        phone: settings.phone || '0531 466 89 27',
        email: settings.email || 'mehmetardad068@gmail.com',
        instagram: settings.instagram || 'https://www.instagram.com/mehmetardastudio/',
        whatsapp: settings.whatsapp || 'https://wa.me/905314668927',
        meta_title: settings.meta_title || '',
        meta_description: settings.meta_description || '',
        meta_keywords: settings.meta_keywords || '',
        formspree_endpoint: settings.formspree_endpoint || 'https://formspree.io/f/xaeeqjdq',
        profile_image_file: null as File | null,
        site_logo_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/ayarlar', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Site Ayarları & SEO">
            <Head title="Site Ayarları — Yönetim Paneli" />

            <div className="max-w-4xl space-y-6">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Genel Yapılandırma ve Arama Motoru Ayarları</h2>
                    <p className="text-xs text-slate-500">Sitenizin marka metinlerini, iletişim bilgilerini ve SEO meta etiketlerini yönetin</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Brand & Hero Texts */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold text-slate-800">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span>Marka ve Ana Sayfa Metinleri</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700">Marka İsmi</label>
                                <input
                                    type="text"
                                    value={data.site_name}
                                    onChange={(e) => setData('site_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">Kurucu Adı</label>
                                <input
                                    type="text"
                                    value={data.founder_name}
                                    onChange={(e) => setData('founder_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700">Ana Slogan</label>
                                <input
                                    type="text"
                                    value={data.slogan}
                                    onChange={(e) => setData('slogan', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">Alternatif Slogan</label>
                                <input
                                    type="text"
                                    value={data.alt_slogan}
                                    onChange={(e) => setData('alt_slogan', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs font-bold text-slate-700">Hero Satır 1</label>
                                <input
                                    type="text"
                                    value={data.hero_title_line1}
                                    onChange={(e) => setData('hero_title_line1', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">Hero Satır 2 (Vurgulu)</label>
                                <input
                                    type="text"
                                    value={data.hero_title_line2}
                                    onChange={(e) => setData('hero_title_line2', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">Hero Satır 3</label>
                                <input
                                    type="text"
                                    value={data.hero_title_line3}
                                    onChange={(e) => setData('hero_title_line3', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Hero Açıklama Paragrafı</label>
                            <textarea
                                rows={2}
                                value={data.hero_description}
                                onChange={(e) => setData('hero_description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1 resize-none"
                            />
                        </div>
                    </div>

                    {/* About Section Management */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold text-slate-800">
                            <span>Hakkımda Bölümü ve Profil Görseli</span>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Hakkımda Başlığı</label>
                            <input
                                type="text"
                                value={data.about_title}
                                onChange={(e) => setData('about_title', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Hakkımda Metni</label>
                            <textarea
                                rows={3}
                                value={data.about_text}
                                onChange={(e) => setData('about_text', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1 resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Profil Fotoğrafı Yükle</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('profile_image_file', e.target.files ? e.target.files[0] : null)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                            />
                            {settings.profile_image && (
                                <p className="text-[11px] text-blue-600 mt-1">Mevcut görsel yüklü: {settings.profile_image}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact & Social Links */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold text-slate-800">
                            <Phone className="w-4 h-4 text-emerald-600" />
                            <span>İletişim ve Sosyal Medya Kanalları</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700">Telefon</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">E-posta</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700">Instagram Profil Linki</label>
                                <input
                                    type="url"
                                    value={data.instagram}
                                    onChange={(e) => setData('instagram', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">WhatsApp Linki</label>
                                <input
                                    type="url"
                                    value={data.whatsapp}
                                    onChange={(e) => setData('whatsapp', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold text-slate-800">
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span>Formspree İletişim Entegrasyonu</span>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700">Formspree Endpoint URL</label>
                            <input
                                type="url"
                                value={data.formspree_endpoint}
                                onChange={(e) => setData('formspree_endpoint', e.target.value)}
                                placeholder="https://formspree.io/f/xaeeqjdq"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">İletişim formundan gönderilen mesajların Formspree hesabınıza ulaşacağı API adresi.</p>
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold text-slate-800">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span>Arama Motoru Optimizasyonu (SEO)</span>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Meta Başlık (Title)</label>
                            <input
                                type="text"
                                value={data.meta_title}
                                onChange={(e) => setData('meta_title', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Meta Açıklama (Description)</label>
                            <textarea
                                rows={2}
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1 resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Meta Anahtar Kelimeler (Keywords)</label>
                            <input
                                type="text"
                                value={data.meta_keywords}
                                onChange={(e) => setData('meta_keywords', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mt-1"
                            />
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
