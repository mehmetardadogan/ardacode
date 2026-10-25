<?php

namespace Tests\Feature;

use App\Models\SystemEvent;
use App\Models\User;
use App\Services\EventRecorder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Tests\TestCase;

class MonitoringTest extends TestCase
{
    use RefreshDatabase;

    private function admin(string $role = 'admin'): User
    {
        return User::factory()->create(['monitoring_role' => $role]);
    }

    private function event(string $type = 'page_viewed', array $extra = []): array
    {
        return array_merge(['id' => (string) Str::uuid(), 'type' => $type, 'path' => '/?email=private@example.com'], $extra);
    }

    private function send(array $events, ?string $session = null)
    {
        return $this->postJson('/izleme/olay', ['consent' => true, 'session_identifier' => $session ?? (string) Str::uuid(), 'events' => $events]);
    }

    public function test_consent_is_required_and_public_client_cannot_inject_privileged_events(): void
    {
        $this->postJson('/izleme/olay', ['consent' => false, 'session_identifier' => (string) Str::uuid(), 'events' => [$this->event()]])->assertUnprocessable();
        $this->send([$this->event('auth_login')])->assertUnprocessable();
        $this->assertDatabaseCount('system_events', 0);
    }

    public function test_visit_is_persistent_deduplicated_minimized_and_visible_to_admin(): void
    {
        $id = (string) Str::uuid();
        $event = $this->event('page_viewed', ['message' => 'secret', 'metadata' => ['password' => 'private'], 'actor_id' => 123]);
        $this->send([$event], $id)->assertNoContent();
        $this->send([$event], $id)->assertNoContent();
        $this->assertDatabaseCount('system_events', 2);
        $view = SystemEvent::where('event_type', 'page_viewed')->firstOrFail();
        $this->assertSame('/', $view->path);
        $this->assertNull($view->actor_id);
        $this->assertNotSame($id, $view->session_identifier);
        $this->assertStringNotContainsString('private', $view->toJson());
        $this->assertStringNotContainsString('secret', $view->toJson());
        $this->actingAs($this->admin())->getJson('/admin/izleme/events')->assertOk()->assertJsonPath('stats.page_views', 1)->assertJsonPath('stats.visits', 1)->assertJsonPath('stats.active_estimate', 1);
    }

    public function test_heartbeat_and_end_signal_are_honest_active_estimates(): void
    {
        $id = (string) Str::uuid();
        $this->send([], $id)->assertNoContent();
        $this->send([$this->event('session_ended')], $id)->assertNoContent();
        $this->actingAs($this->admin())->getJson('/admin/izleme/events')->assertJsonPath('stats.active_estimate', 0);
        $this->travel(31)->minutes();
        $this->send([$this->event()], $id)->assertNoContent();
        $this->assertSame(2, SystemEvent::where('event_type', 'session_started')->count());
    }

    public function test_anonymous_and_unprivileged_users_cannot_access_logs_or_exports(): void
    {
        $this->getJson('/admin/izleme/events')->assertUnauthorized();
        $this->getJson('/admin/izleme/export')->assertUnauthorized();
        $this->actingAs($this->admin('none'))->getJson('/admin/izleme/events')->assertForbidden();
        $this->getJson('/admin/izleme/export')->assertForbidden();
        $this->assertDatabaseHas('system_events', ['event_type' => 'http_403']);
    }

    public function test_analyst_can_read_but_cannot_export_or_change_resolution(): void
    {
        $event = EventRecorder::record('test_error', 'errors', 'ERROR', 'Güvenli hata özeti');
        $this->actingAs($this->admin('analyst'))->getJson('/admin/izleme/events')->assertOk();
        $this->getJson('/admin/izleme/export')->assertForbidden();
        $this->patchJson('/admin/izleme/events/'.$event->id, ['status' => 'resolved'])->assertForbidden();
    }

    public function test_filters_cursor_details_and_resolution_work(): void
    {
        for ($i = 0; $i < 55; $i++) EventRecorder::record('test', 'admin', 'INFO', 'Yönetici işlemi '.$i);
        $this->actingAs($this->admin());
        $first = $this->getJson('/admin/izleme/events?category=admin&search=Y%C3%B6netici')->assertOk()->assertJsonCount(50, 'events');
        $cursor = $first->json('next_cursor');
        $second = $this->getJson('/admin/izleme/events?category=admin&before='.$cursor)->assertOk()->assertJsonCount(5, 'events');
        $this->assertEmpty(array_intersect(array_column($first->json('events'), 'id'), array_column($second->json('events'), 'id')));
        $id = $first->json('events.0.id');
        $this->getJson('/admin/izleme/events/'.$id)->assertOk()->assertJsonPath('id', $id);
        $this->patchJson('/admin/izleme/events/'.$id, ['status' => 'resolved'])->assertOk()->assertJsonPath('status', 'resolved');
        $this->getJson('/admin/izleme/events?category=admin&status=resolved')->assertJsonCount(1, 'events');
        $this->getJson('/admin/izleme/events?from=2026-10-20&to=2026-10-01')->assertUnprocessable();
    }

    public function test_errors_are_aggregated_and_replayed_client_errors_are_not_double_counted(): void
    {
        $id = (string) Str::uuid();
        $first = $this->event('javascript_error');
        $second = $this->event('javascript_error');
        $this->send([$first, $second], $id)->assertNoContent();
        $this->send([$first, $second], $id)->assertNoContent();
        $error = SystemEvent::where('event_type', 'javascript_error')->firstOrFail();
        $this->assertSame(2, $error->occurrences);
        $error->update(['status' => 'resolved']);
        $this->send([$this->event('javascript_error')], $id)->assertNoContent();
        $this->assertSame('open', $error->fresh()->status);
    }

    public function test_http_errors_have_safe_summaries_without_exception_messages(): void
    {
        Route::get('/monitor-test-error', fn () => throw new \RuntimeException('password=secret; token=private; stack trace here'));
        $this->getJson('/monitor-test-error')->assertStatus(500);
        $event = SystemEvent::where('http_status', 500)->firstOrFail();
        $this->assertStringNotContainsString('secret', $event->toJson());
        $this->assertStringNotContainsString('private', $event->toJson());
        $this->assertSame('/[diğer]', $event->path);
        $this->get('/missing-secret-page?token=private')->assertNotFound();
        $this->assertDatabaseHas('system_events', ['event_type' => 'http_404']);
    }

    public function test_formspree_outcome_is_client_reported_not_email_delivery(): void
    {
        $attempt = (string) Str::uuid();
        $this->send([
            $this->event('form_started', ['attempt_identifier' => $attempt]),
            $this->event('form_response', ['http_status' => 200, 'attempt_identifier' => $attempt]),
            $this->event('form_accepted', ['http_status' => 200, 'attempt_identifier' => $attempt]),
            $this->event('form_failed', ['http_status' => 422, 'attempt_identifier' => (string) Str::uuid()]),
        ])->assertNoContent();
        $accepted = SystemEvent::where('event_type', 'form_accepted')->firstOrFail();
        $this->assertSame('browser', $accepted->source);
        $this->assertSame('not_verified', $accepted->metadata['delivery']);
        $this->actingAs($this->admin())->getJson('/admin/izleme/events')->assertJsonPath('stats.form_accepted', 1)->assertJsonPath('stats.form_failed', 1);
    }

    public function test_admin_mutations_auth_failures_and_permission_changes_are_audited_without_secrets(): void
    {
        $this->post('/admin/login', ['email' => 'nobody@example.com', 'password' => 'do-not-log-me']);
        $failed = SystemEvent::where('event_type', 'auth_failed')->firstOrFail();
        $this->assertSame('WARNING', $failed->severity);
        $this->assertStringNotContainsString('nobody', $failed->toJson());
        $this->assertStringNotContainsString('do-not-log-me', $failed->toJson());
        $admin = $this->admin();
        $this->actingAs($admin)->post('/admin/hizmetler', ['title' => 'Deneme', 'short_description' => 'Güvenli hizmet', 'features' => 'test', 'order' => 1])->assertRedirect();
        $event = SystemEvent::where('event_type', 'service_created')->firstOrFail();
        $this->assertSame($admin->id, $event->actor_id);
        $this->assertNotNull($event->resource_id);
        $admin->forceFill(['monitoring_role' => 'analyst'])->save();
        $this->assertDatabaseHas('system_events', ['event_type' => 'permission_changed', 'severity' => 'CRITICAL']);
    }

    public function test_revocation_erases_only_the_given_pseudonymous_session(): void
    {
        $first = (string) Str::uuid(); $second = (string) Str::uuid();
        $this->send([$this->event()], $first); $this->send([$this->event()], $second);
        $this->postJson('/izleme/iptal', ['session_identifier' => $first])->assertNoContent();
        $this->assertDatabaseMissing('monitoring_sessions', ['identifier' => EventRecorder::sessionHash($first)]);
        $this->assertSame(2, SystemEvent::where('session_identifier', EventRecorder::sessionHash($second))->count());
        $this->assertSame(0, SystemEvent::where('session_identifier', EventRecorder::sessionHash($first))->count());
        $this->send([$this->event()], $first)->assertNoContent();
        $this->assertSame(0, SystemEvent::where('session_identifier', EventRecorder::sessionHash($first))->count());
    }

    public function test_retention_and_row_cap_are_enforced(): void
    {
        config(['monitoring.max_events' => 3]);
        for ($i = 0; $i < 5; $i++) EventRecorder::record('test', 'admin', 'INFO', 'İşlem');
        EventRecorder::prune();
        $this->assertDatabaseCount('system_events', 3);
        SystemEvent::query()->update(['last_seen_at' => now()->subDays(31)]);
        EventRecorder::prune();
        $this->assertDatabaseCount('system_events', 0);
    }

    public function test_export_is_private_audited_and_formula_safe(): void
    {
        EventRecorder::record('test', 'admin', 'INFO', '=HYPERLINK("https://example.invalid")');
        $response = $this->actingAs($this->admin())->get('/admin/izleme/export?category=admin')->assertOk();
        $this->assertStringContainsString("'=HYPERLINK", $response->streamedContent());
        $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));
        $this->assertDatabaseHas('system_events', ['event_type' => 'events_exported']);
    }

    public function test_monitoring_failure_does_not_break_public_pages(): void
    {
        DB::statement('DROP TABLE system_events');
        $this->get('/missing-page')->assertNotFound();
    }

    public function test_ingest_rate_limit_and_csrf_are_enforced(): void
    {
        for ($i = 0; $i < 90; $i++) $this->send([], (string) Str::uuid())->assertNoContent();
        $this->send([])->assertStatus(429);
        $this->assertDatabaseHas('system_events', ['event_type' => 'http_429']);
        $this->app->instance('env', 'local');
        try {
            $this->postJson('/izleme/olay', ['consent' => true])->assertStatus(419);
        } finally { $this->app->instance('env', 'testing'); }
    }

    public function test_cron_cleanup_requires_secret_and_expired_details_are_inaccessible(): void
    {
        config(['monitoring.cron_secret' => str_repeat('s', 48)]);
        $old = EventRecorder::record('expired', 'admin', 'INFO', 'Eski kayıt');
        $old->update(['occurred_at' => now()->subDays(31), 'last_seen_at' => now()->subDays(31)]);
        $this->actingAs($this->admin())->getJson('/admin/izleme/events/'.$old->id)->assertNotFound();
        $this->getJson('/internal/monitoring/prune')->assertForbidden();
        $this->withToken(str_repeat('s', 48))->getJson('/internal/monitoring/prune')->assertOk()->assertJsonPath('removed', 1);
    }
}
