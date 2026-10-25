<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Str;

class Seo
{
    public static function url(string $path = ''): string
    {
        return rtrim(config('seo.url'), '/').'/'.ltrim($path, '/');
    }

    public static function page(array $settings, $services = [], ?Project $project = null): array
    {
        $title = $settings['meta_title'] ?? '';
        $description = $settings['meta_description'] ?? '';
        // Upgrade the original seed text while retaining subsequent custom SEO edits.
        if (!$title || $title === 'MEHMET ARDA STUDIO — Premium Web Tasarım ve Yazılım Ajansı') {
            $title = config('seo.title');
        }
        if (!$description || str_starts_with($description, 'Mehmet Arda Studio ile modern web tasarım, kurumsal web siteleri')) {
            $description = config('seo.description');
        }
        $canonical = self::url();
        $schema = [
            '@context' => 'https://schema.org', '@type' => 'ProfessionalService',
            '@id' => self::url('#studio'), 'name' => 'Mehmet Arda Studio',
            'alternateName' => ['ArdaCode', 'Arda Web Tasarım'],
            'url' => $canonical, 'logo' => self::url('images/logo.svg'),
            'description' => $description,
            'telephone' => $settings['phone'] ?? '0531 466 89 27',
            'email' => $settings['email'] ?? 'mehmetardad068@gmail.com',
            'areaServed' => [
                ['@type' => 'City', 'name' => 'Mersin'],
                ['@type' => 'Country', 'name' => 'Türkiye'],
            ],
            'founder' => ['@type' => 'Person', 'name' => 'Mehmet Arda'],
            'hasOfferCatalog' => [
                '@type' => 'OfferCatalog', 'name' => 'Web tasarım ve yazılım hizmetleri',
                'itemListElement' => collect($services)->map(fn ($service) => [
                    '@type' => 'Offer', 'itemOffered' => ['@type' => 'Service',
                        'name' => data_get($service, 'title'),
                        'description' => data_get($service, 'short_description'),
                    ],
                ])->values()->all(),
            ],
        ];
        if ($project) {
            $title = $project->title.' | Mehmet Arda Studio';
            $description = Str::limit(preg_replace('/\s+/u', ' ', strip_tags($project->description)), 160, '…');
            $canonical = self::url('projeler/'.rawurlencode($project->slug));
            $schema = [
                '@context' => 'https://schema.org', '@type' => 'CreativeWork',
                'name' => $project->title, 'description' => $description,
                'url' => $canonical, 'creator' => ['@id' => self::url('#studio')],
                'inLanguage' => 'tr-TR',
            ];
        }
        return compact('title', 'description', 'canonical', 'schema');
    }
}
