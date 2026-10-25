<!DOCTYPE html>
<html lang="tr" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @php($seo = $page['props']['seo'] ?? null)
    <title data-inertia="">{{ $seo['title'] ?? config('app.name', 'MEHMET ARDA STUDIO') }}</title>
    <meta name="google-site-verification" content="{{ config('seo.verification') }}">
    @if($seo)
        <meta data-inertia="description" name="description" content="{{ $seo['description'] }}">
        <meta data-inertia="robots" name="robots" content="index, follow, max-image-preview:large">
        <link data-inertia="canonical" rel="canonical" href="{{ $seo['canonical'] }}">
        <meta data-inertia="og:type" property="og:type" content="website">
        <meta data-inertia="og:url" property="og:url" content="{{ $seo['canonical'] }}">
        <meta data-inertia="og:title" property="og:title" content="{{ $seo['title'] }}">
        <meta data-inertia="og:description" property="og:description" content="{{ $seo['description'] }}">
        <meta data-inertia="og:locale" property="og:locale" content="tr_TR">
        <meta data-inertia="og:site_name" property="og:site_name" content="Mehmet Arda Studio">
        <meta data-inertia="twitter:card" name="twitter:card" content="summary">
        <meta data-inertia="twitter:title" name="twitter:title" content="{{ $seo['title'] }}">
        <meta data-inertia="twitter:description" name="twitter:description" content="{{ $seo['description'] }}">
        <script data-inertia="schema" type="application/ld+json">{!! json_encode($seo['schema'], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}</script>
    @else
        <meta data-inertia="robots" name="robots" content="noindex, nofollow">
    @endif
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">

    <!-- Google Fonts: Plus Jakarta Sans & Manrope -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-white text-[#334155] selection:bg-[#155DFC] selection:text-white">
    {{-- Public HTML is readable before JavaScript; React progressively replaces this root. --}}
    <script data-page="app" type="application/json">{!! json_encode($page, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) !!}</script>
    <div id="app">
        @if($seo)
            @include('public-content')
        @endif
    </div>
</body>
</html>
