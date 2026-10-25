import { router } from '@inertiajs/react';

export type TelemetryType = 'page_viewed' | 'project_viewed' | 'services_viewed' | 'service_viewed' | 'contact_clicked' | 'whatsapp_clicked' | 'form_started' | 'form_response' | 'form_accepted' | 'form_failed' | 'javascript_error' | 'promise_rejection' | 'api_failed' | 'session_ended';
type ClientEvent = { id: string; type: TelemetryType; path: string; http_status?: number; section?: string; attempt_identifier?: string };
const consentKey = 'mas-analytics-choice-v1';
const sessionKey = 'mas-analytics-session-v1';
let queue: ClientEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let inFlight = false;
let retries = 0;
let installed = false;
let observer: IntersectionObserver | undefined;
let lastPage = '';

export function analyticsChoice(): 'accepted' | 'rejected' | null {
    try {
        const saved = JSON.parse(localStorage.getItem(consentKey) || 'null');
        return saved && saved.expires > Date.now() && ['accepted', 'rejected'].includes(saved.choice) ? saved.choice : null;
    } catch { return null; }
}

function sessionId(): string | null {
    try {
        let id = sessionStorage.getItem(sessionKey);
        if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(sessionKey, id); }
        return id;
    } catch { return null; }
}

export function csrfHeaders(): Record<string, string> {
    const cookie = document.cookie.split('; ').find(c => c.startsWith('XSRF-TOKEN='));
    if (cookie) return { 'X-XSRF-TOKEN': decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) };
    return { 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' };
}

export async function chooseAnalytics(choice: 'accepted' | 'rejected') {
    try {
        localStorage.setItem(consentKey, JSON.stringify({ choice, expires: Date.now() + 180 * 86400000 }));
        if (choice === 'rejected') {
            queue = [];
            clearTimeout(timer);
            const id = sessionStorage.getItem(sessionKey);
            if (id) {
                const response = await fetch('/izleme/iptal', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...csrfHeaders() }, body: JSON.stringify({ session_identifier: id }) });
                if (!response.ok) throw new Error('revoke_failed');
                sessionStorage.removeItem(sessionKey);
            }
        } else {
            lastPage = '';
            recordPage();
        }
    } finally { window.dispatchEvent(new Event('mas-consent-change')); }
}

export function trackEvent(type: TelemetryType, data: Pick<ClientEvent, 'http_status' | 'section' | 'attempt_identifier'> = {}) {
    if (analyticsChoice() !== 'accepted' || location.pathname.startsWith('/admin') || !sessionId()) return;
    if (queue.length >= 24) return;
    // Do not send titles, URLs with query strings, input values or error messages.
    const path = location.pathname === '/' || /^\/projeler\/[a-z0-9-]{1,120}$/.test(location.pathname) ? location.pathname : '/[diğer]';
    queue.push({ id: crypto.randomUUID(), type, path, ...data });
    if (!timer) timer = setTimeout(() => { timer = undefined; void flush(); }, 400);
}

async function flush(heartbeat = false) {
    if (inFlight || analyticsChoice() !== 'accepted' || location.pathname.startsWith('/admin') || (!queue.length && !heartbeat)) return;
    const id = sessionId();
    if (!id) return;
    inFlight = true;
    const batch = queue.splice(0, 12);
    try {
        const response = await fetch('/izleme/olay', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...csrfHeaders() }, body: JSON.stringify({ consent: true, session_identifier: id, events: batch }) });
        if (!response.ok) throw new Error('telemetry_unavailable');
        retries = 0;
    } catch {
        if (analyticsChoice() === 'accepted' && retries < 3) { queue = [...batch, ...queue].slice(0, 24); retries++; }
    } finally {
        inFlight = false;
        if (queue.length && retries < 3 && !timer) timer = setTimeout(() => { timer = undefined; void flush(); }, Math.min(30000, 1000 * 2 ** retries));
    }
}

function recordPage() {
    if (location.pathname.startsWith('/admin') || analyticsChoice() !== 'accepted' || lastPage === location.pathname) return;
    lastPage = location.pathname;
    trackEvent('page_viewed');
    if (location.pathname.startsWith('/projeler/')) trackEvent('project_viewed');
    observer?.disconnect();
    observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
            trackEvent('services_viewed', { section: 'hizmetler' });
            observer?.unobserve(entry.target);
        }
    }, { threshold: 0.25 });
    const section = document.getElementById('hizmetler');
    if (section) observer.observe(section);
}

export function installTelemetry() {
    if (installed) return;
    installed = true;
    router.on('navigate', () => { setTimeout(recordPage, 100); });
    window.addEventListener('mas-consent-change', () => { if (analyticsChoice() !== 'accepted') { lastPage = ''; observer?.disconnect(); } });
    window.addEventListener('error', (event: ErrorEvent) => { if (event.error) trackEvent('javascript_error'); });
    window.addEventListener('unhandledrejection', () => trackEvent('promise_rejection'));
    document.addEventListener('click', event => {
        const link = (event.target as Element)?.closest?.('a');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        if (/^https:\/\/(wa.me|api.whatsapp.com)\//.test(href)) trackEvent('whatsapp_clicked');
        else if (href.includes('#iletisim') || /^(tel:|mailto:)/.test(href)) trackEvent('contact_clicked');
    });
    setInterval(() => { if (document.visibilityState === 'visible') void flush(true); }, 60000);
    window.addEventListener('pageshow', event => { if (event.persisted) { lastPage = ''; recordPage(); } });
    window.addEventListener('pagehide', () => {
        if (analyticsChoice() !== 'accepted' || location.pathname.startsWith('/admin')) return;
        const id = sessionId();
        if (!id) return;
        const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        const events = [...queue.slice(-10), { id: crypto.randomUUID(), type: 'session_ended', path: lastPage || '/' }];
        navigator.sendBeacon('/izleme/olay', new Blob([JSON.stringify({ _token: token, consent: true, session_identifier: id, events })], { type: 'application/json' }));
    });
    setTimeout(recordPage, 150);
}
