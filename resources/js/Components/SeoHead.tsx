import { Head } from '@inertiajs/react';

export interface SeoData {
    title: string;
    description: string;
    canonical: string;
    schema: Record<string, unknown>;
}

export default function SeoHead({ seo }: { seo: SeoData }) {
    return <Head>
        <title>{seo.title}</title>
        <meta head-key="description" name="description" content={seo.description} />
        <meta head-key="robots" name="robots" content="index, follow, max-image-preview:large" />
        <link head-key="canonical" rel="canonical" href={seo.canonical} />
        <meta head-key="og:type" property="og:type" content="website" />
        <meta head-key="og:url" property="og:url" content={seo.canonical} />
        <meta head-key="og:title" property="og:title" content={seo.title} />
        <meta head-key="og:description" property="og:description" content={seo.description} />
        <meta head-key="og:locale" property="og:locale" content="tr_TR" />
        <meta head-key="og:site_name" property="og:site_name" content="Mehmet Arda Studio" />
        <meta head-key="twitter:card" name="twitter:card" content="summary" />
        <meta head-key="twitter:title" name="twitter:title" content={seo.title} />
        <meta head-key="twitter:description" name="twitter:description" content={seo.description} />
        <script head-key="schema" type="application/ld+json">{JSON.stringify(seo.schema)}</script>
    </Head>;
}
