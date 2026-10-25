<?php

namespace Tests\Feature;

use App\Models\Project;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_has_crawlable_content_and_consistent_metadata_without_javascript(): void
    {
        $this->seed(DatabaseSeeder::class);
        $response = $this->get('/?utm_source=test');
        $response->assertOk()
            ->assertSee('<title data-inertia="">Mersin Web Tasarım', false)
            ->assertSee('rel="canonical" href="https://ardacode.com.tr/"', false)
            ->assertSee('name="google-site-verification"', false)
            ->assertSee('Mersin’deki işletmeler')
            ->assertDontSee('mehmetarda.studio');
        $html = $response->getContent();
        $this->assertSame(1, substr_count($html, 'rel="canonical"'));
        $dom = new \DOMDocument();
        @$dom->loadHTML($html);
        $this->assertSame(1, $dom->getElementsByTagName('h1')->length);
        $this->assertGreaterThanOrEqual(6, $dom->getElementsByTagName('article')->length);
        foreach (Project::all() as $project) {
            $response->assertSee('href="/projeler/'.$project->slug.'"', false);
        }
        $xpath = new \DOMXPath($dom);
        $schema = json_decode($xpath->query('//script[@type="application/ld+json"]')->item(0)->textContent, true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame('Mersin', $schema['areaServed'][0]['name']);
        $this->assertSame('https://ardacode.com.tr/', $schema['url']);
    }

    public function test_projects_have_their_own_canonical_and_escaped_server_content(): void
    {
        $this->seed(DatabaseSeeder::class);
        $project = Project::firstOrFail();
        $project->update(['title' => '<script>alert("x")</script> & Proje']);
        $response = $this->get('/projeler/'.$project->slug);
        $response->assertOk()->assertSee('rel="canonical" href="https://ardacode.com.tr/projeler/'.$project->slug.'"', false)
            ->assertDontSee('<script>alert("x")</script>', false)
            ->assertSee('&lt;script&gt;', false);
    }

    public function test_sitemap_and_robots_always_use_the_canonical_host(): void
    {
        $this->seed(DatabaseSeeder::class);
        $response = $this->get('http://other.example/sitemap.xml')->assertOk();
        $xml = simplexml_load_string($response->getContent());
        $this->assertCount(7, $xml->url);
        foreach ($xml->url as $entry) {
            $this->assertStringStartsWith('https://ardacode.com.tr/', (string) $entry->loc);
            $this->assertStringNotContainsString('/admin', (string) $entry->loc);
        }
        $this->assertFalse(isset($xml->url[0]->lastmod));
        $this->get('/robots.txt')->assertOk()->assertSee('Sitemap: https://ardacode.com.tr/sitemap.xml', false);
    }

    public function test_admin_login_is_not_indexable(): void
    {
        $this->get('/admin/login')->assertOk()->assertHeader('X-Robots-Tag', 'noindex, nofollow')->assertSee('content="noindex, nofollow"', false);
    }
}
