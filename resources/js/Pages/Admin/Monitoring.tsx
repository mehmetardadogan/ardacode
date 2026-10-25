import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Activity, ArrowDown, ArrowLeft, ChevronRight, Download, Pause, Play, Search, ShieldCheck, X, RefreshCw, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';
import { csrfHeaders } from '../../lib/telemetry';
import '../../../css/monitoring.css';

type SystemEvent = {
    id: number; event_type: string; category: string; severity: string; message: string;
    source: string; actor_id: number | null; session_identifier: string | null;
    resource_type: string | null; resource_id: string | null; path: string | null;
    http_status: number | null; occurrences: number; status: string;
    occurred_at: string; last_seen_at: string; metadata: Record<string, unknown>;
};
type Bucket = { label: string; count: number };
type Stats = {
    visits: number; active_estimate: number; page_views: number; form_accepted: number;
    form_started: number; form_failed: number; form_archived: number; errors: number; security: number;
    hourly: Bucket[]; daily: Bucket[]; top_pages: { path: string; total: number }[];
    error_distribution: { event_type: string; total: number }[]; recent_admin: SystemEvent[];
};
type Feed = { events: SystemEvent[]; next_cursor: number | null; stats: Stats; server_time: string; retention_days: number };
const categories: Record<string, string> = { analytics: 'Ziyaretler', forms: 'Formlar', admin: 'Yönetici', errors: 'Hatalar', security: 'Güvenlik', audit: 'Erişim denetimi' };
const statuses: Record<string, string> = { open: 'Açık', investigating: 'İnceleniyor', resolved: 'Çözüldü' };
const time = (value: string, date = false) => new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', ...(date ? { dateStyle: 'short', timeStyle: 'medium' } : { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }).format(new Date(value));

function TrafficChart({ buckets, label }: { buckets: Bucket[]; label: string }) {
    const max = Math.max(1, ...buckets.map(b => b.count));
    const sum = buckets.reduce((n, b) => n + b.count, 0);
    return <figure className="monitor-chart" aria-label={`${label}: toplam ${sum} onaylı sayfa görüntüleme`}>
        <div className="monitor-chart-title"><h3>{label}</h3><span>{sum.toLocaleString('tr-TR')} görüntüleme</span></div>
        <svg viewBox="0 0 600 120" role="img" aria-label={buckets.map(b => `${b.label}: ${b.count}`).join(', ')}>
            {[0, 1, 2].map(i => <line key={i} x1="4" x2="596" y1={14 + i * 49} y2={14 + i * 49} stroke="#293b54" strokeWidth="1" />)}
            {buckets.map((b, i) => {
                const slot = 592 / buckets.length;
                const height = b.count / max * 94;
                return <g key={b.label}><title>{b.label}: {b.count}</title><rect x={6 + i * slot} y={112 - Math.max(height, 2)} width={Math.max(slot - 5, 2)} height={Math.max(height, 2)} rx="2" fill={b.count ? '#79b5ff' : '#34485f'} />
                </g>;
            })}
        </svg>
        <div className="monitor-chart-axis" aria-hidden="true">{buckets.filter((_, i) => buckets.length <= 7 || i === 0 || i === 8 || i === 16 || i === buckets.length - 1).map(b => <span key={b.label}>{b.label}</span>)}</div>
        {sum === 0 && <figcaption>Henüz onaylı ziyaret kaydı yok.</figcaption>}
    </figure>;
}

export default function Monitoring({ canManage, pollSeconds = 8 }: { canManage: boolean; pollSeconds: number }) {
    const [navigation, setNavigation] = useState({ url: location.pathname + location.search, serial: 0 });
    const [feed, setFeed] = useState<Feed | null>(null);
    const [category, setCategory] = useState(() => new URLSearchParams(location.search).get('category') || '');
    const [severity, setSeverity] = useState('');
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [before, setBefore] = useState<number | null>(null);
    const [paused, setPaused] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [connection, setConnection] = useState('loading');
    const [error, setError] = useState('');
    const [detailError, setDetailError] = useState('');
    const [selected, setSelected] = useState<SystemEvent | null>(null);
    const [busy, setBusy] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [visible, setVisible] = useState(document.visibilityState === 'visible');
    const [updated, setUpdated] = useState('');
    const streamRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const lastEventRef = useRef<number | undefined>(undefined);
    const detailSequence = useRef(0);
    const detailController = useRef<AbortController | null>(null);
    useEffect(() => router.on('navigate', event => setNavigation(previous => ({ url: event.detail.page.url, serial: previous.serial + 1 }))), []);
    useEffect(() => () => { detailSequence.current++; detailController.current?.abort(); }, []);
    useEffect(() => { const id = setTimeout(() => setDebouncedSearch(search), 350); return () => clearTimeout(id); }, [search]);
    useEffect(() => { const listener = () => setVisible(document.visibilityState === 'visible'); document.addEventListener('visibilitychange', listener); return () => document.removeEventListener('visibilitychange', listener); }, []);
    useEffect(() => { setBefore(null); }, [category, severity, status, debouncedSearch, from, to]);

    const filters = () => {
        const params = new URLSearchParams();
        Object.entries({ category, severity, status, search: debouncedSearch, from, to }).forEach(([key, value]) => { if (value) params.set(key, value); });
        return params;
    };
    useEffect(() => {
        if (paused || !visible) return;
        let live = true;
        let timer: ReturnType<typeof setTimeout>;
        let controller: AbortController;
        let failures = 0;
        const run = async () => {
            controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12000);
            let authExpired = false;
            try {
                const params = filters();
                if (before) params.set('before', String(before));
                const response = await fetch(`/admin/izleme/events?${params}`, { headers: { Accept: 'application/json' }, credentials: 'same-origin', signal: controller.signal });
                if (!response.ok) {
                    authExpired = [401, 403].includes(response.status);
                    throw new Error(authExpired ? 'İzleme oturumu sona erdi veya erişim yetkiniz yok. Yeniden giriş yapın.' : response.status === 422 ? 'Tarih aralığını kontrol edin; bitiş tarihi başlangıçtan önce olamaz.' : response.status === 429 ? 'İstek sınırına ulaşıldı. Yeniden bağlanma bekleniyor.' : 'Log merkezi şu an yanıt vermiyor. Otomatik yeniden denenecek.');
                }
                const data: Feed = await response.json();
                if (live) { setFeed(data); setUpdated(data.server_time); setConnection('connected'); setError(''); failures = 0; }
            } catch (e) {
                if (live) { setConnection('error'); setError(e instanceof Error && e.name !== 'AbortError' ? e.message : 'Bağlantı zaman aşımına uğradı. Otomatik yeniden denenecek.'); failures++; }
            } finally {
                clearTimeout(timeout);
                if (live && !before && !authExpired) timer = setTimeout(() => void run(), Math.min(60000, pollSeconds * 1000 * 2 ** failures));
            }
        };
        void run();
        return () => { live = false; clearTimeout(timer); controller?.abort(); };
    }, [category, severity, status, debouncedSearch, from, to, before, paused, visible, refresh, pollSeconds]);

    const openDetail = async (id: number, syncUrl = true) => {
        const sequence = ++detailSequence.current;
        detailController.current?.abort();
        const controller = new AbortController(); detailController.current = controller;
        setDetailError(''); setBusy(true);
        try {
            const response = await fetch(`/admin/izleme/events/${id}`, { headers: { Accept: 'application/json' }, signal: controller.signal });
            if (!response.ok) throw new Error('Olay ayrıntısı alınamadı; erişiminizi veya kaydın saklama süresini kontrol edin.');
            const detail: SystemEvent = await response.json();
            if (sequence !== detailSequence.current) return;
            setSelected(detail);
            if (syncUrl) { const params = filters(); params.set('event', String(id)); history.replaceState(history.state, '', `/admin/izleme?${params}`); }
        } catch (e) { if (sequence === detailSequence.current && (e as Error).name !== 'AbortError') setDetailError((e as Error).message); }
        finally { if (sequence === detailSequence.current) setBusy(false); }
    };
    useEffect(() => {
        const params = new URLSearchParams(navigation.url.split('?')[1] || '');
        setCategory(params.get('category') || ''); setSeverity(params.get('severity') || ''); setStatus(params.get('status') || '');
        setSearch(params.get('search') || ''); setFrom(params.get('from') || ''); setTo(params.get('to') || ''); setBefore(null);
        const id = Number(params.get('event'));
        if (id > 0) void openDetail(id, false);
        else { detailSequence.current++; detailController.current?.abort(); setSelected(null); setBusy(false); }
    }, [navigation]);
    useEffect(() => {
        const latest = feed?.events[0]?.id;
        if (autoScroll && latest && latest !== lastEventRef.current && !before) streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight });
        lastEventRef.current = latest;
    }, [feed, autoScroll, before]);
    const closeDetail = () => { detailSequence.current++; detailController.current?.abort(); setBusy(false); setSelected(null); history.replaceState(history.state, '', `/admin/izleme?${filters()}`); };
    const updateStatus = async (value: string) => {
        if (!selected) return;
        const sequence = ++detailSequence.current;
        setBusy(true); setDetailError('');
        try {
            const response = await fetch(`/admin/izleme/events/${selected.id}`, { method: 'PATCH', headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...csrfHeaders() }, body: JSON.stringify({ status: value }) });
            if (!response.ok) throw new Error('Durum kaydedilemedi. Oturumu yenileyip yeniden deneyin.');
            const detail: SystemEvent = await response.json();
            if (sequence === detailSequence.current) { setSelected(detail); setRefresh(n => n + 1); }
        } catch (e) { if (sequence === detailSequence.current) setDetailError((e as Error).message); }
        finally { if (sequence === detailSequence.current) setBusy(false); }
    };
    const exportCsv = async () => {
        setBusy(true); setDetailError('');
        try {
            const response = await fetch(`/admin/izleme/export?${filters()}`, { headers: { Accept: 'text/csv' } });
            if (!response.ok || !response.headers.get('Content-Type')?.includes('text/csv')) throw new Error('CSV dışa aktarılamadı. Oturumunuzu ve yetkinizi kontrol edin.');
            const url = URL.createObjectURL(await response.blob()); const a = document.createElement('a'); a.href = url; a.download = 'mehmet-arda-system-events.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) { setDetailError((e as Error).message); }
        finally { setBusy(false); }
    };
    const clearFilters = () => { setCategory(''); setSeverity(''); setStatus(''); setSearch(''); setFrom(''); setTo(''); setBefore(null); };
    const stats = feed?.stats;
    const critical = feed?.events.filter(e => e.severity === 'CRITICAL' && e.status !== 'resolved');
    const stateLabel = paused ? 'Akış duraklatıldı' : !visible ? 'Sekme arka planda' : before ? 'Geçmiş kayıtlar' : connection === 'connected' ? `${pollSeconds} sn aralıkla bağlı` : connection === 'error' ? 'Yeniden bağlanıyor' : 'Bağlantı kuruluyor';
    const metrics: [string, number | undefined, string][] = [
        ['Ziyaret / 24 sa.', stats?.visits, 'Onaylı oturum başlangıcı'],
        ['Aktif oturum', stats?.active_estimate, 'Tahmin · son 5 dakika'],
        ['Sayfa görüntüleme', stats?.page_views, 'Son 24 saat · onaylı'],
        ['Form kabulü', stats?.form_accepted, 'Tarayıcı bildirimi · 24 sa.'],
        ['Uygulama hatası', stats?.errors, 'Tekrarlar dahil · 24 sa.'],
        ['Güvenlik olayı', stats?.security, 'Saldırı tespiti değildir'],
    ];
    return <AdminLayout title="Sistem İzleme">
        <Head title="Canlı Log Merkezi — Mehmet Arda Studio" />
        <div className="monitor-shell">
            <header className="monitor-header">
                <div className="monitor-heading"><Activity size={25} aria-hidden="true" /><div><h2>Canlı Log Merkezi</h2><p>Mehmet Arda Studio · operasyon ve olay kayıtları</p></div></div>
                <div className={`monitor-connection ${connection === 'error' ? 'is-error' : ''}`} role="status"><span className={!paused && connection === 'connected' ? 'monitor-dot' : 'monitor-dot muted'} />{stateLabel}</div>
            </header>
            <div className="monitor-toolbar">
                <div className="monitor-tabs" aria-label="İzleme bölümü">
                    <button className={category !== 'security' ? 'active' : ''} onClick={() => { setCategory(''); setBefore(null); }}>Tüm olaylar</button>
                    <button className={category === 'security' ? 'active' : ''} onClick={() => { setCategory('security'); setBefore(null); }}><ShieldCheck size={15} />Güvenlik</button>
                </div>
                <div className="monitor-actions">
                    <button onClick={() => setPaused(!paused)}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? 'Devam et' : 'Duraklat'}</button>
                    <button disabled={busy || paused} onClick={() => setRefresh(n => n + 1)} aria-label="Şimdi yenile"><RefreshCw size={15} /></button>
                    {canManage && <button disabled={busy} onClick={() => void exportCsv()}><Download size={15} />CSV indir</button>}
                </div>
            </div>
            {error && <div className="monitor-alert" role="alert"><AlertTriangle size={18} /><span>{error} <a href="/admin/login">Giriş ekranı</a></span></div>}
            {!!critical?.length && <div className="monitor-alert critical" role="alert"><AlertTriangle size={18} /><span>{critical.length} kritik kayıt inceleme bekliyor.</span><button onClick={() => { setSeverity('CRITICAL'); setStatus('open'); }}>Kayıtları göster</button></div>}
            <div className="monitor-metrics">{metrics.map(([label, value, note]) => <div key={label}><span>{label}</span><strong>{value === undefined ? '—' : value.toLocaleString('tr-TR')}</strong><small>{note}</small></div>)}</div>
            <p className="monitor-note">Ziyaretler yalnızca izin veren tarayıcıları kapsar; tekil kişi sayısı değildir. Tarayıcı olayları doğrulanmamış bildirimlerdir. E-posta teslimatı ölçülmez.</p>
            <div className="monitor-graphs">
                {stats ? <><TrafficChart buckets={stats.hourly} label="Saatlik trafik · son 24 saat" /><TrafficChart buckets={stats.daily} label="Günlük trafik · 7 gün" /></> : <div className="monitor-placeholder">Gerçek trafik verileri yükleniyor…</div>}
            </div>
            <section className="monitor-feed-section" aria-label="Olay akışı">
                <div className="monitor-section-title"><div><h3>{category === 'security' ? 'Güvenlik olayları' : 'Olay akışı'}</h3><p>Zamanlar Türkiye saatiyle · kayıtlar oluşma sırasına göre</p></div><label className="monitor-check"><input type="checkbox" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} /><ArrowDown size={14} />Otomatik kaydır</label></div>
                <div className="monitor-filters">
                    <label className="monitor-search"><span>Metin ara</span><div><Search size={16} /><input aria-label="Loglarda ara" placeholder="Açıklama, olay veya sayfa…" value={search} onChange={e => setSearch(e.target.value)} maxLength={100} /></div></label>
                    <label>Kategori<select aria-label="Kategori" value={category} onChange={e => setCategory(e.target.value)}><option value="">Tüm kategoriler</option>{Object.entries(categories).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
                    <label>Seviye<select aria-label="Seviye" value={severity} onChange={e => setSeverity(e.target.value)}><option value="">Tüm seviyeler</option>{['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'CRITICAL'].map(s => <option key={s}>{s}</option>)}</select></label>
                    <label>Durum<select aria-label="Durum" value={status} onChange={e => setStatus(e.target.value)}><option value="">Tüm durumlar</option>{Object.entries(statuses).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
                    <label>Başlangıç<input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
                    <label>Bitiş<input type="date" value={to} min={from} onChange={e => setTo(e.target.value)} /></label>
                    <button className="monitor-clear" onClick={clearFilters}>Temizle</button>
                </div>
                <div className={`monitor-workspace ${selected ? 'has-detail' : ''}`}>
                    <div className="monitor-log" ref={streamRef} tabIndex={0} aria-label="Kaydırılabilir olay kayıtları">
                        <div className="monitor-log-head"><span>ZAMAN</span><span>SEVİYE</span><span>OLAY / AÇIKLAMA</span><span>AYRINTI</span></div>
                        {!feed && <p className="monitor-empty">Olay kayıtları yükleniyor…</p>}
                        {feed?.events.length === 0 && <div className="monitor-empty"><Search size={28} /><h4>Bu görünümde kayıt yok</h4><p>Filtreleri temizleyin veya yeni bir olay bekleyin. Ziyaret ölçümü izin verildikten sonra başlar.</p><button onClick={clearFilters}>Filtreleri temizle</button></div>}
                        {feed?.events.slice().reverse().map(e => <button type="button" key={e.id} className={`monitor-row ${selected?.id === e.id ? 'selected' : ''}`} onClick={() => void openDetail(e.id)} aria-label={`Olay ${e.id}: ${e.message}`}>
                            <time dateTime={e.occurred_at} title={time(e.occurred_at, true)}>{time(e.occurred_at)}<small>{new Date(e.occurred_at).toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit' })}</small></time>
                            <span className={`monitor-severity level-${e.severity.toLowerCase()}`}>{e.severity}</span>
                            <span className="monitor-row-message"><span>{e.message}{e.occurrences > 1 && <b className="monitor-count">×{e.occurrences}</b>}</span><small>{categories[e.category]} · {e.path || e.event_type} · {e.source === 'browser' ? 'Tarayıcı bildirimi' : 'Sunucu'}{e.actor_id ? ` · Yönetici #${e.actor_id}` : ''}</small></span>
                            <span className="monitor-row-tail">{e.http_status && <span>{e.http_status}</span>}{e.category === 'errors' || e.category === 'security' ? <small>{statuses[e.status]}</small> : null}<ChevronRight size={14} /></span>
                        </button>)}
                        <div ref={bottomRef} />
                    </div>
                    {selected && <aside className="monitor-inspector" aria-label="Tekil olay ayrıntısı">
                        <div className="monitor-inspector-heading"><h3>Olay #{selected.id}</h3><button aria-label="Ayrıntıyı kapat" onClick={closeDetail}><X size={18} /></button></div>
                        <span className={`monitor-severity level-${selected.severity.toLowerCase()}`}>{selected.severity}</span>
                        <h4>{selected.message}</h4>
                        <dl>{Object.entries({ Zaman: time(selected.occurred_at, true), 'Son tekrar': time(selected.last_seen_at, true), Kategori: categories[selected.category], Kaynak: selected.source === 'browser' ? 'Tarayıcı · doğrulanmamış' : 'Sunucu', 'Yönetici ID': selected.actor_id ?? '—', Kayıt: [selected.resource_type, selected.resource_id].filter(Boolean).join(' #') || '—', Sayfa: selected.path || '—', 'HTTP durumu': selected.http_status || '—', Tekrar: selected.occurrences }).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                        <label>İnceleme durumu<select aria-label="İnceleme durumu" disabled={!canManage || busy} value={selected.status} onChange={e => void updateStatus(e.target.value)}>{Object.entries(statuses).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
                        {!canManage && <p className="monitor-note">Analist rolü: salt okunur erişim.</p>}
                        <details open><summary>Güvenli JSON ayrıntısı</summary><pre>{JSON.stringify({ event_type: selected.event_type, session_identifier: selected.session_identifier ? selected.session_identifier.slice(0, 12) + '…' : null, metadata: selected.metadata }, null, 2)}</pre></details>
                        <a href={`/admin/izleme?event=${selected.id}`}>Bu olayın bağlantısı</a>
                    </aside>}
                </div>
                {detailError && <p className="monitor-alert" role="alert">{detailError}</p>}
                <div className="monitor-pagination"><span>{feed?.events.length ?? 0} kayıt · sayfa başına 50 · CSV en çok 5.000</span><div>{before && <button onClick={() => { setBefore(null); setRefresh(n => n + 1); }}><ArrowLeft size={14} />En yeni kayıtlar</button>}<button disabled={!feed?.next_cursor || busy} onClick={() => { setBefore(feed?.next_cursor ?? null); streamRef.current?.scrollTo(0, 0); }}>Daha eski kayıtlar<ChevronRight size={14} /></button></div></div>
            </section>
            <div className="monitor-breakdowns">
                <section><h3>En çok görüntülenen sayfalar <small>24 saat</small></h3>{stats?.top_pages.length ? stats.top_pages.map(p => <div className="monitor-ranking" key={p.path}><span>{p.path}</span><strong>{p.total}</strong></div>) : <p>Henüz onaylı sayfa görüntülemesi yok.</p>}</section>
                <section><h3>Hata ve güvenlik dağılımı <small>24 saat</small></h3>{stats?.error_distribution.length ? stats.error_distribution.map(p => <div className="monitor-ranking" key={p.event_type}><span>{p.event_type}</span><strong>{p.total}</strong></div>) : <p>Bu dönemde kayıt yok.</p>}</section>
                <section><h3>Form gönderimleri <small>24 saat</small></h3>{[['Başlatıldı', stats?.form_started], ['Sağlayıcı kabulü¹', stats?.form_accepted], ['Başarısız', stats?.form_failed], ['Sunucu arşivi', stats?.form_archived]].map(([label, count]) => <div className="monitor-ranking" key={label}><span>{label}</span><strong>{count ?? '—'}</strong></div>)}<p>¹ Tarayıcı bildirimi. Gelen kutusuna teslimat doğrulanmaz; izin vermeyen ziyaretçiler bu sayıya dahil değildir.</p></section>
            </div>
            <section className="monitor-recent"><h3>Son yönetici işlemleri</h3>{stats?.recent_admin.length ? stats.recent_admin.map(e => <button key={e.id} onClick={() => void openDetail(e.id)}><time>{time(e.occurred_at)}</time><span>{e.message}</span><small>Yönetici #{e.actor_id ?? '—'}</small></button>) : <p>Henüz yönetici işlemi kaydedilmedi.</p>}</section>
            <footer className="monitor-footer"><span>Saklama: {feed?.retention_days ?? 30} gün / 50.000 olay · anonim oturum kimlikleri</span><span>Son başarılı yenileme: {updated ? time(updated) : '—'}</span></footer>
        </div>
    </AdminLayout>;
}

