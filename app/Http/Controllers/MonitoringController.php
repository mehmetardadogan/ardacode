<?php

namespace App\Http\Controllers;

use App\Models\SystemEvent;
use App\Services\EventRecorder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MonitoringController extends Controller
{
    public function index(Request $request)
    {
        EventRecorder::record('monitoring_accessed', 'audit', 'INFO', 'Yetkili kullanıcı log merkezini açtı', ['actor_id' => $request->user()->id]);
        return Inertia::render('Admin/Monitoring', ['canManage' => Gate::allows('manage-monitoring'), 'pollSeconds' => config('monitoring.poll_seconds')]);
    }

    private function filtered(Request $request)
    {
        $filters = $request->validate([
            'category' => ['nullable', Rule::in(['analytics', 'forms', 'admin', 'errors', 'security', 'audit'])],
            'severity' => ['nullable', Rule::in(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'CRITICAL'])],
            'status' => ['nullable', Rule::in(['open', 'investigating', 'resolved'])],
            'search' => ['nullable', 'string', 'max:100'],
            'from' => ['nullable', 'date_format:Y-m-d'], 'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
            'before' => ['nullable', 'integer', 'min:1'],
        ]);
        $query = SystemEvent::query()->where('last_seen_at', '>=', now()->subDays(config('monitoring.retention_days')));
        foreach (['category', 'severity', 'status'] as $key) if (!empty($filters[$key])) $query->where($key, $filters[$key]);
        if (!empty($filters['from'])) $query->where('occurred_at', '>=', \Carbon\Carbon::parse($filters['from'], 'Europe/Istanbul')->utc());
        if (!empty($filters['to'])) $query->where('occurred_at', '<', \Carbon\Carbon::parse($filters['to'], 'Europe/Istanbul')->addDay()->utc());
        if (!empty($filters['search'])) {
            $search = '%'.str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $filters['search']).'%';
            $query->where(fn ($q) => $q->where('message', 'like', $search)->orWhere('event_type', 'like', $search)->orWhere('path', 'like', $search));
        }
        if (!empty($filters['before'])) $query->where('id', '<', $filters['before']);
        return $query;
    }

    public function events(Request $request)
    {
        EventRecorder::pruneWhenDue();
        $events = $this->filtered($request)->orderByDesc('id')->limit(51)->get();
        $more = $events->count() > 50;
        $events = $events->take(50)->values();
        return response()->json(['events' => $events, 'next_cursor' => $more ? $events->last()->id : null, 'stats' => $this->stats(), 'server_time' => now()->toIso8601String(), 'retention_days' => config('monitoring.retention_days')])->header('Cache-Control', 'private, no-store');
    }

    private function stats(): array
    {
        // Indexed aggregates, bounded to the most recent 7 days / retained rows.
        $since = now()->subDay();
        $query = SystemEvent::where('occurred_at', '>=', $since);
        $types = (clone $query)->select('event_type', DB::raw('SUM(occurrences) as total'))->groupBy('event_type')->pluck('total', 'event_type');
        $categories = (clone $query)->select('category', DB::raw('SUM(occurrences) as total'))->groupBy('category')->pluck('total', 'category');
        $hourly = array_fill(0, 24, 0);
        $daily = array_fill(0, 7, 0);
        $startHour = now()->startOfHour()->subHours(23);
        $startDay = now('Europe/Istanbul')->startOfDay()->subDays(6)->utc();
        $views = SystemEvent::where('event_type', 'page_viewed')->where('occurred_at', '>=', $startDay)->select('occurred_at')->get();
        foreach ($views as $view) {
            $h = (int) floor($startHour->diffInSeconds($view->occurred_at, false) / 3600);
            if ($h >= 0 && $h < 24) $hourly[$h]++;
            $d = (int) $startDay->copy()->timezone('Europe/Istanbul')->diffInDays($view->occurred_at->copy()->timezone('Europe/Istanbul')->startOfDay(), false);
            if ($d >= 0 && $d < 7) $daily[$d]++;
        }
        $active = DB::table('monitoring_sessions')->whereNull('ended_at')->where('last_seen_at', '>=', now()->subMinutes(config('monitoring.active_minutes')))->count();
        return [
            'visits' => (int) ($types['session_started'] ?? 0), 'active_estimate' => $active,
            'page_views' => (int) ($types['page_viewed'] ?? 0),
            'form_accepted' => (int) ($types['form_accepted'] ?? 0), 'form_failed' => (int) ($types['form_failed'] ?? 0),
            'form_started' => (int) ($types['form_started'] ?? 0), 'form_archived' => (int) ($types['form_archived'] ?? 0),
            'errors' => (int) ($categories['errors'] ?? 0), 'security' => (int) ($categories['security'] ?? 0),
            'hourly' => array_map(fn ($i) => ['label' => $startHour->copy()->addHours($i)->timezone('Europe/Istanbul')->format('H:i'), 'count' => $hourly[$i]], range(0, 23)),
            'daily' => array_map(fn ($i) => ['label' => $startDay->copy()->timezone('Europe/Istanbul')->addDays($i)->format('d.m'), 'count' => $daily[$i]], range(0, 6)),
            'top_pages' => (clone $query)->where('event_type', 'page_viewed')->select('path', DB::raw('COUNT(*) as total'))->groupBy('path')->orderByDesc('total')->limit(5)->get(),
            'error_distribution' => (clone $query)->whereIn('category', ['errors', 'security'])->select('event_type', DB::raw('SUM(occurrences) as total'))->groupBy('event_type')->orderByDesc('total')->limit(6)->get(),
            'recent_admin' => SystemEvent::where('category', 'admin')->orderByDesc('id')->limit(5)->get(),
        ];
    }

    public function show(SystemEvent $event, Request $request)
    {
        abort_if($event->last_seen_at->lt(now()->subDays(config('monitoring.retention_days'))), 404);
        EventRecorder::record('event_inspected', 'audit', 'INFO', 'Olay ayrıntısı görüntülendi', ['actor_id' => $request->user()->id, 'resource_type' => 'system_event', 'resource_id' => $event->id]);
        return response()->json($event)->header('Cache-Control', 'private, no-store');
    }

    public function update(SystemEvent $event, Request $request)
    {
        Gate::authorize('manage-monitoring');
        abort_if($event->last_seen_at->lt(now()->subDays(config('monitoring.retention_days'))), 404);
        $data = $request->validate(['status' => ['required', Rule::in(['open', 'investigating', 'resolved'])]]);
        $event->update($data);
        EventRecorder::record('event_status_changed', 'audit', 'INFO', 'Olayın inceleme durumu güncellendi', ['actor_id' => $request->user()->id, 'resource_type' => 'system_event', 'resource_id' => $event->id, 'metadata' => ['result' => $data['status']]]);
        return response()->json($event)->header('Cache-Control', 'private, no-store');
    }

    public function export(Request $request)
    {
        Gate::authorize('manage-monitoring');
        $events = $this->filtered($request)->orderByDesc('id')->limit(5000)->get();
        EventRecorder::record('events_exported', 'audit', 'INFO', 'Filtrelenmiş olaylar CSV olarak dışa aktarıldı (en çok 5000 kayıt)', ['actor_id' => $request->user()->id]);
        return response()->streamDownload(function () use ($events) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, ['ID', 'Zaman (UTC)', 'Kategori', 'Seviye', 'Olay', 'Kaynak', 'Aktör ID', 'Kaynak türü', 'Kayıt ID', 'Sayfa', 'HTTP', 'Tekrar', 'Durum', 'Açıklama'], ',', '"', '');
            foreach ($events as $e) {
                $cells = [$e->id, $e->occurred_at->toIso8601String(), $e->category, $e->severity, $e->event_type, $e->source, $e->actor_id, $e->resource_type, $e->resource_id, $e->path, $e->http_status, $e->occurrences, $e->status, $e->message];
                fputcsv($out, array_map(fn ($v) => preg_match('/^[=+@\-\t\r]/u', (string) $v) ? "'".$v : $v, $cells), ',', '"', '');
            }
            fclose($out);
        }, 'system-events-'.now()->format('Ymd-His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8', 'Cache-Control' => 'private, no-store', 'X-Content-Type-Options' => 'nosniff']);
    }

    public function prune(Request $request)
    {
        $secret = config('monitoring.cron_secret');
        abort_unless(is_string($secret) && strlen($secret) >= 32 && hash_equals($secret, $request->bearerToken() ?? ''), 403);
        return response()->json(['removed' => EventRecorder::prune()])->header('Cache-Control', 'no-store');
    }
}
