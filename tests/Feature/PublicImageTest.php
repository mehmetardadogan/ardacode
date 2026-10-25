<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class PublicImageTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_upload_survives_without_a_local_public_disk(): void
    {
        $file = UploadedFile::fake()->image('logo.png', 8, 8);
        $bytes = $file->getContent();
        $this->actingAs(User::factory()->create())->post('/admin/ayarlar', [
            'site_logo_file' => $file,
        ])->assertRedirect();

        $url = SiteSetting::get('site_logo');
        $this->assertStringStartsWith('/media/', $url);
        $this->get($url)->assertOk()->assertHeader('Content-Type', 'image/png')->assertContent($bytes);
    }

    public function test_non_images_cannot_be_published(): void
    {
        $this->actingAs(User::factory()->create())->post('/admin/ayarlar', [
            'site_logo_file' => UploadedFile::fake()->createWithContent('payload.html', '<script>alert(1)</script>'),
        ])->assertSessionHasErrors('site_logo_file');
        $this->assertDatabaseCount('public_images', 0);
    }
}
