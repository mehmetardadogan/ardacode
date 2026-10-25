import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import AnalyticsConsent from './Components/AnalyticsConsent';
import { installTelemetry } from './lib/telemetry';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'MEHMET ARDA STUDIO';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: async (name) => {
        const page = await resolvePageComponent<{ default: ResolvedComponent }>(`./Pages/${name}.tsx`, import.meta.glob<{ default: ResolvedComponent }>('./Pages/**/*.tsx'));
        return page.default;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<><App {...props} /><AnalyticsConsent /></>);
        installTelemetry();
    },
    progress: {
        color: '#2563EB',
        showSpinner: true,
    },
});
