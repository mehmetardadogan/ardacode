@php($props = $page['props'])
@php($settings = $props['settings'] ?? [])
<header class="max-w-7xl mx-auto px-6 py-8 border-b border-slate-200">
    <a href="/" class="font-black text-xl text-[#080F20]">MEHMET ARDA STUDIO</a>
    <nav aria-label="Ana menü" class="flex flex-wrap gap-6 mt-4">
        <a href="/#hizmetler">Hizmetler</a><a href="/#projeler">Projeler</a><a href="/#iletisim">İletişim</a>
    </nav>
</header>
<main class="max-w-7xl mx-auto px-6 py-16 space-y-16">
    @if($page['component'] === 'Home')
        <section id="hero" class="space-y-6 max-w-3xl">
            <h1 class="text-4xl sm:text-6xl font-black text-[#080F20]">Mersin Web Tasarım — Markanıza Özel Dijital Deneyimler.</h1>
            <p class="text-lg leading-relaxed">Mehmet Arda Studio (ArdaCode) ile Mersin’deki işletmeler ve Türkiye genelindeki markalar için mobil uyumlu kurumsal web siteleri, e-ticaret çözümleri ve özel web yazılımları geliştiriyoruz.</p>
            <a href="#iletisim" class="inline-block bg-[#155DFC] text-white px-6 py-3 rounded-full">Projenizi konuşalım</a>
        </section>
        <section id="hakkimda" class="space-y-4">
            <h2 class="text-3xl font-bold">{{ $settings['about_title'] ?? 'Merhaba, Ben Mehmet Arda.' }}</h2>
            <p>{{ $settings['about_text'] ?? 'Mehmet Arda Studio bünyesinde modern web tasarım, yazılım ve dijital arayüz projeleri geliştiriyorum.' }}</p>
        </section>
        <section id="hizmetler" class="space-y-6">
            <h2 class="text-3xl font-bold">Web tasarım ve yazılım hizmetleri</h2>
            <div class="grid sm:grid-cols-2 gap-8">
            @foreach($props['services'] ?? [] as $service)
                <article class="space-y-3"><h3 class="text-xl font-bold">{{ data_get($service, 'title') }}</h3><p>{{ data_get($service, 'short_description') }}</p></article>
            @endforeach
            </div>
        </section>
        <section id="projeler" class="space-y-6">
            <h2 class="text-3xl font-bold">Örnek web sitesi projeleri</h2>
            <div class="grid sm:grid-cols-2 gap-8">
            @foreach($props['projects'] ?? [] as $project)
                <article class="space-y-3"><h3 class="text-xl font-bold"><a href="{{ '/projeler/'.rawurlencode(data_get($project, 'slug')) }}">{{ data_get($project, 'title') }}</a></h3><p>{{ data_get($project, 'description') }}</p></article>
            @endforeach
            </div>
        </section>
    @else
        <article class="space-y-6">
            <a href="/#projeler">Tüm projeler</a>
            <h1 class="text-4xl font-black">{{ data_get($props, 'project.title') }}</h1>
            <p class="text-lg">{{ data_get($props, 'project.description') }}</p>
            <p>{{ data_get($props, 'project.category') }}</p>
            <ul>@foreach(data_get($props, 'project.technologies', []) ?? [] as $technology)<li>{{ $technology }}</li>@endforeach</ul>
        </article>
        <section class="space-y-4"><h2 class="text-2xl font-bold">Diğer örnek çalışmalar</h2>
            @foreach($props['relatedProjects'] ?? [] as $project)
                <a class="block" href="{{ '/projeler/'.rawurlencode(data_get($project, 'slug')) }}">{{ data_get($project, 'title') }}</a>
            @endforeach
        </section>
    @endif
    <section id="iletisim" class="space-y-4">
        <h2 class="text-3xl font-bold">Projeniz için iletişime geçin</h2>
        <p>Mersin web tasarım, kurumsal web sitesi ve özel yazılım ihtiyaçlarınızı birlikte değerlendirelim.</p>
        <p>{{ $settings['phone'] ?? '0531 466 89 27' }}</p>
        <a href="mailto:{{ $settings['email'] ?? 'mehmetardad068@gmail.com' }}">{{ $settings['email'] ?? 'mehmetardad068@gmail.com' }}</a>
    </section>
</main>
<footer class="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200">Mehmet Arda Studio · ArdaCode · Web Tasarım ve Yazılım</footer>
