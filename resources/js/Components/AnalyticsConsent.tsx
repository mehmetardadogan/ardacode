import React, { useEffect, useState } from 'react';
import { analyticsChoice, chooseAnalytics } from '../lib/telemetry';
import { router } from '@inertiajs/react';

export default function AnalyticsConsent() {
    const [choice, setChoice] = useState(analyticsChoice);
    const [open, setOpen] = useState(!choice);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [isPublic, setIsPublic] = useState(!location.pathname.startsWith('/admin'));
    useEffect(() => router.on('navigate', () => setIsPublic(!location.pathname.startsWith('/admin'))), []);
    useEffect(() => { const update = () => setChoice(analyticsChoice()); window.addEventListener('mas-consent-change', update); return () => window.removeEventListener('mas-consent-change', update); }, []);
    const select = async (value: 'accepted' | 'rejected') => {
        setPending(true); setError('');
        try { await chooseAnalytics(value); setChoice(value); setOpen(false); }
        catch { setChoice(analyticsChoice()); setError('Takip kapatıldı. Geçmiş oturumu silme işlemi tamamlanamadı; yeniden deneyin.'); }
        finally { setPending(false); }
    };
    if (!isPublic) return null;
    return <>
        {!open && <button type="button" onClick={() => setOpen(true)} className="fixed bottom-3 left-3 z-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus-visible:outline-2 focus-visible:outline-blue-600">Gizlilik tercihleri</button>}
        {open && <section aria-label="Ziyaret analitiği tercihi" className="fixed bottom-4 left-4 right-4 z-[70] max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-xl sm:left-6 sm:right-auto">
            <h2 className="text-base font-bold">Ziyaret ölçümüne izin verir misiniz?</h2>
            <p className="mt-2 max-w-prose text-sm leading-relaxed">İzin verirseniz sayfa ve bölüm ziyaretleri, bağlantı tıklamaları ve teknik olayları rastgele oturum kimliğiyle ölçeriz. Form metni, e-posta, IP veya konum bu kayıtlara eklenmez. Veriler Vercel ve Neon altyapısında en fazla 30 gün saklanır; yurt dışında işlenebilir. Tercihinizi burada geri alabilirsiniz.</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">Tercih bu tarayıcıda 180 gün hatırlanır. Zorunlu oturum güvenliği ve sunucu hata kayıtları ayrı çalışır. Ret tercihi siteyi kullanmanızı etkilemez.</p>
            {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
                <button disabled={pending} onClick={() => void select('rejected')} className="rounded-lg border border-slate-400 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-200 disabled:opacity-50">{choice === 'accepted' ? 'İzni geri al ve oturumu sil' : 'İzin verme'}</button>
                <button disabled={pending} onClick={() => void select('accepted')} className="rounded-lg border border-slate-400 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-200 disabled:opacity-50">{pending ? 'Kaydediliyor…' : 'İzin ver'}</button>
                {choice && <button disabled={pending} onClick={() => setOpen(false)} className="px-2 py-2 text-sm underline underline-offset-4">Kapat</button>}
            </div>
        </section>}
    </>;
}
