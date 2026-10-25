import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title="Yönetici Girişi — Mehmet Arda Studio" />

            <div className="max-w-md w-full">
                {/* Brand Header */}
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-slate-900 border border-blue-500/30 items-center justify-center text-white font-extrabold text-base shadow-sm">
                        MA
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Mehmet Arda Studio
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                        Kurumsal İçerik ve Portföy Yönetim Paneli
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100 text-xs font-semibold text-slate-700">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Güvenli Oturum Açma</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">E-posta</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                                    placeholder="E-posta adresinizi girin"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-[11px] text-rose-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Şifre</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password && (
                                <p className="text-[11px] text-rose-500">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Beni Hatırla</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
                        >
                            <span>Giriş Yap</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="pt-2 text-center">
                        <Link href="/" className="text-xs text-slate-400 hover:text-slate-700">
                            ← Web Sitesine Dön
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
