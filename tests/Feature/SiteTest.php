<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_homepage_loads_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('MEHMET ARDA STUDIO');
    }

    public function test_project_detail_loads_successfully(): void
    {
        $project = Project::first();
        $this->assertNotNull($project);

        $response = $this->get('/projeler/' . $project->slug);
        $response->assertStatus(200);
        $response->assertSee($project->title);
    }

    public function test_sitemap_returns_valid_xml(): void
    {
        $response = $this->get('/sitemap.xml');
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/xml; charset=UTF-8');
    }

    public function test_robots_txt_returns_proper_rules(): void
    {
        $response = $this->get('/robots.txt');
        $response->assertStatus(200);
        $response->assertSee("Disallow: /admin\n", false);
    }

    public function test_contact_form_submission_and_validation(): void
    {
        // 1. Boş istek validation hatası
        $badResponse = $this->post('/iletisim', []);
        $badResponse->assertSessionHasErrors(['name', 'email', 'details']);

        // 2. Geçerli form gönderimi
        $goodResponse = $this->post('/iletisim', [
            'name' => 'Caner Demir',
            'email' => 'caner@ornek.com',
            'phone' => '0532 111 22 33',
            'service' => 'Web Tasarım',
            'details' => 'Ajansınızla yeni projemizi hayata geçirmek istiyoruz.',
        ]);

        $goodResponse->assertSessionHas('success');
        $this->assertDatabaseHas('messages', [
            'email' => 'caner@ornek.com',
        ]);
    }

    public function test_admin_guest_redirected_to_login(): void
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/admin/login');
    }

    public function test_admin_can_login_and_access_dashboard(): void
    {
        $user = User::first();
        $this->assertNotNull($user);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertStatus(200);
        $response->assertSee('Mehmet Arda');
    }
}
