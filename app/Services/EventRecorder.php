<?php

namespace App\Services;

use App\Models\SystemEvent;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class EventRecorder
{
    // Descriptions are authored here, never copied from exceptions or request data.
    public const CLIENT_EVENTS = [
        'session_started' => ['analytics', 'INFO', 'Onaylı ziyaretçi oturumu başladı'],
        'session_ended' => ['analytics', 'INFO', 'Oturum kapanış sinyali alındı (kesin bitiş değildir)'],
        'page_viewed' => ['analytics', 'INFO', 'Sayfa görüntülendi'],
        'project_viewed' => ['analytics', 'INFO', 'Proje detay sayfası görüntülendi'],
        'services_viewed' => ['analytics', 'INFO', 'Hizmetler bölümü görüntülendi'],
        'service_viewed' => ['analytics', 'INFO', 'Hizmet detayı açıldı'],
        'contact_clicked' => ['analytics', 'INFO', 'İletişim bağlantısına tıklandı'],
        'whatsapp_clicked' => ['analytics', 'INFO', 'WhatsApp bağlantısına tıklandı'],
        'form_started' => ['forms', 'INFO', 'Form gönderimi başlatıldı'],
        'form_response' => ['forms', 'INFO', 'Formspree HTTP yanıtı alındı'],
        'form_accepted' => ['forms', 'SUCCESS', 'Formspree gönderimi kabul etti (teslimat doğrulanmadı)'],
        'form_failed' => ['errors', 'ERROR', 'Formspree gönderimi başarısız oldu'],
        'javascript_error' => ['errors', 'ERROR', 'JavaScript çalışma zamanı hatası'],
        'promise_rejection' => ['errors', 'ERROR', 'İşlenmemiş JavaScript promise hatası'],
        'api_failed' => ['errors', 'ERROR', 'Tarayıcı API isteği başarısız oldu'],
    ];

    public static function safePath(?string $path): string
    {
        $path = explode('?', explode('#', $path ?? '/')[0])[0];
        if ($path === '/') return '/';
        if (preg_match('~^/projeler/[a-z0-9-]{1,120}/?$~D', $path)) return $path;
        if (preg_match('~^/admin(?:/(?:login|logout|projeler|hizmetler|mesajlar|ayarlar|izleme)(?:/[0-9]+)?(?:/toggle)?)?/?$~D', $path)) return $path;
        if (in_array($path, ['/iletisim', '/sitemap.xml', '/robots.txt', '/up'])) return $path;
        return '/[diğer]';
    }

    public static function sessionHash(string $identifier): string
    {
        return hash_hmac('sha256', $identifier, config('app.key'));
    }

    public static function record(string $type, string $category, string $severity, string $message, array $context = []): ?SystemEvent
    {
        if (!config('monitoring.enabled')) return null;
        try {
            $now = now();
            $data = [
                'event_type' => $type, 'category' => $category, 'severity' => $severity,
                'message' => $message, 'source' => $context['source'] ?? 'server',
                'actor_id' => $context['actor_id'] ?? null,
                'event_identifier' => $context['event_identifier'] ?? null,
                'session_identifier' => $context['session_identifier'] ?? null,
                'resource_type' => $context['resource_type'] ?? null,
                'resource_id' => isset($context['resource_id']) ? (string) $context['resource_id'] : null,
                'path' => isset($context['path']) ? self::safePath($context['path']) : null,
                'http_status' => $context['http_status'] ?? null,
                'metadata' => array_intersect_key($context['metadata'] ?? [], array_flip(['outcome', 'section', 'provider', 'delivery', 'exception_type', 'reported_by', 'previous_role', 'new_role', 'changed_fields', 'result', 'attempt_identifier', 'unconfirmed'])),
                'occurred_at' => $now, 'created_at' => $now, 'last_seen_at' => $now,
            ];
            if ($severity === 'ERROR' || $severity === 'CRITICAL' || ($category === 'security' && $type !== 'auth_failed')) {
                $fingerprint = hash('sha256', implode('|', [$type, $data['path'], $data['http_status'], $data['source'], $data['session_identifier'], $data['resource_type'], $data['resource_id'], $now->format('Y-m-d-H')]));
                $event = SystemEvent::firstOrCreate(['fingerprint' => $fingerprint], $data);
                if (!$event->wasRecentlyCreated) {
                    $event->increment('occurrences', 1, ['last_seen_at' => $now, 'status' => 'open']);
                    $event->refresh();
                }
            } else {
                if ($data['event_identifier'] && SystemEvent::where('event_identifier', $data['event_identifier'])->exists()) return null;
                $event = SystemEvent::create($data);
            }
            self::pruneWhenDue();
            return $event;
        } catch (Throwable) {
            // Monitoring cannot break the site or recursively log its own failure.
            // DB outages are still reported by Laravel's configured stderr logger.
            return null;
        }
    }

    public static function reportException(Throwable $e, ?Request $request = null, ?int $responseStatus = null): void
    {
        if ($request?->attributes->get('monitoring_error_recorded')) return;
        $status = $responseStatus ?? ($e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500);
        if ($request && str_starts_with($request->path(), 'izleme/') && $status >= 500) return;
        if (!in_array($status, [401, 403, 404, 419, 429, 500, 502, 503])) return;
        $request?->attributes->set('monitoring_error_recorded', true);
        $database = $e instanceof QueryException;
        self::record($database ? 'database_error' : 'http_'.$status, in_array($status, [401, 403, 419, 429]) ? 'security' : 'errors', $status >= 500 ? 'ERROR' : 'WARNING', match ($status) {
            401 => 'Kimlik doğrulama gerektiren API erişimi engellendi',
            403 => 'Yetkisiz erişim engellendi', 404 => 'İstenen sayfa bulunamadı',
            419 => 'CSRF veya oturum doğrulaması başarısız', 429 => 'İstek sınırına ulaşıldı',
            default => $database ? 'Veritabanı işlemi başarısız' : 'Beklenmeyen uygulama hatası',
        }, ['path' => $request?->getPathInfo(), 'http_status' => $status, 'metadata' => ['exception_type' => $database ? 'database' : 'application', 'outcome' => 'failed']]);
    }

    public static function pruneWhenDue(): void
    {
        // Atomic, persistent lease: no scheduler or PHP worker is required.
        if (DB::table('monitoring_maintenance')->where('id', 1)->where('checked_at', '<', now()->subMinutes(10))->update(['checked_at' => now()])) self::prune();
    }

    public static function prune(): int
    {
        $removed = SystemEvent::where('last_seen_at', '<', now()->subDays(config('monitoring.retention_days')))->delete();
        $cutoff = SystemEvent::orderByDesc('id')->skip(config('monitoring.max_events'))->value('id');
        if ($cutoff) $removed += SystemEvent::where('id', '<=', $cutoff)->delete();
        DB::table('monitoring_sessions')->where('last_seen_at', '<', now()->subDays(config('monitoring.retention_days')))->delete();
        DB::table('monitoring_receipts')->where('created_at', '<', now()->subDays(config('monitoring.retention_days')))->delete();
        DB::table('monitoring_revocations')->where('created_at', '<', now()->subDays(config('monitoring.retention_days')))->delete();
        $sessionCutoff = DB::table('monitoring_sessions')->orderByDesc('last_seen_at')->skip(config('monitoring.max_events'))->value('last_seen_at');
        if ($sessionCutoff) DB::table('monitoring_sessions')->where('last_seen_at', '<=', $sessionCutoff)->delete();
        $receiptCutoff = DB::table('monitoring_receipts')->orderByDesc('created_at')->skip(config('monitoring.max_events') * 2)->value('created_at');
        if ($receiptCutoff) DB::table('monitoring_receipts')->where('created_at', '<=', $receiptCutoff)->delete();
        return $removed;
    }
}
