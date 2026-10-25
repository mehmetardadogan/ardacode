<?php

namespace App\Http\Controllers;

use App\Services\EventRecorder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Throwable;

class TelemetryController extends Controller
{
    public function store(Request $request)
    {
        if (!config('monitoring.enabled')) return response()->noContent();
        abort_if(strlen($request->getContent()) > 12000, 413);
        // First-party CSRF-protected endpoint. Never accepts arbitrary log text.
        $data = $request->validate([
            'consent' => ['required', 'accepted'],
            'session_identifier' => ['required', 'uuid'],
            'events' => ['present', 'array', 'max:12'],
            'events.*.id' => ['required', 'uuid'],
            'events.*.type' => ['required', Rule::in(array_keys(EventRecorder::CLIENT_EVENTS))],
            'events.*.path' => ['required', 'string', 'max:200'],
            'events.*.section' => ['nullable', Rule::in(['hizmetler', 'iletisim', 'projeler'])],
            'events.*.http_status' => ['nullable', 'integer', 'between:100,599'],
            'events.*.attempt_identifier' => ['nullable', 'uuid'],
        ]);
        $identifier = EventRecorder::sessionHash($data['session_identifier']);
        try {
            return DB::transaction(function () use ($data, $identifier) {
            if (DB::table('monitoring_revocations')->where('identifier', $identifier)->exists()) return response()->noContent();
            $created = DB::table('monitoring_sessions')->insertOrIgnore(['identifier' => $identifier, 'started_at' => now(), 'last_seen_at' => now(), 'ended_at' => null]);
            $existing = DB::table('monitoring_sessions')->where('identifier', $identifier)->lockForUpdate()->first();
            if (DB::table('monitoring_revocations')->where('identifier', $identifier)->exists()) {
                DB::table('monitoring_sessions')->where('identifier', $identifier)->delete();
                return response()->noContent();
            }
            DB::table('monitoring_sessions')->where('identifier', $identifier)->update(['last_seen_at' => now(), 'ended_at' => null]);
            if ($created || now()->diffInSeconds($existing->last_seen_at, true) > 1800) {
                $start = EventRecorder::record('session_started', 'analytics', 'INFO', 'Onaylı ziyaretçi oturumu başladı', ['source' => 'browser', 'session_identifier' => $identifier]);
                if (!$start) throw new \RuntimeException('Event write unavailable');
            }
            foreach ($data['events'] as $event) {
                if ($event['type'] === 'session_started') continue;
                // Globally unique event ids suppress retries, including grouped errors.
                if (!DB::table('monitoring_receipts')->insertOrIgnore(['id' => $event['id'], 'created_at' => now()])) continue;
                [$category, $severity, $message] = EventRecorder::CLIENT_EVENTS[$event['type']];
                $recorded = EventRecorder::record($event['type'], $category, $severity, $message, [
                    'source' => 'browser', 'event_identifier' => $event['id'], 'session_identifier' => $identifier,
                    'path' => $event['path'], 'http_status' => $event['http_status'] ?? null,
                    'metadata' => array_filter([
                        'section' => $event['section'] ?? null,
                        'attempt_identifier' => $event['attempt_identifier'] ?? null,
                        'reported_by' => 'browser_unverified',
                        'delivery' => str_starts_with($event['type'], 'form_') ? 'not_verified' : null,
                    ]),
                ]);
                if (!$recorded) throw new \RuntimeException('Event write unavailable');
                if ($event['type'] === 'session_ended') DB::table('monitoring_sessions')->where('identifier', $identifier)->update(['ended_at' => now()]);
            }
            return response()->noContent()->header('Cache-Control', 'no-store');
            });
        } catch (Throwable) {
            // Error details remain private; the frontend backs off on this status.
            return response()->json(['message' => 'Olay alımı geçici olarak kullanılamıyor.'], 503);
        }
    }

    public function revoke(Request $request)
    {
        $data = $request->validate(['session_identifier' => ['required', 'uuid']]);
        $identifier = EventRecorder::sessionHash($data['session_identifier']);
        DB::transaction(function () use ($identifier) {
            DB::table('monitoring_revocations')->insertOrIgnore(['identifier' => $identifier, 'created_at' => now()]);
            DB::table('monitoring_sessions')->where('identifier', $identifier)->lockForUpdate()->first();
            DB::table('system_events')->where('session_identifier', $identifier)->delete();
            DB::table('monitoring_sessions')->where('identifier', $identifier)->delete();
        });
        return response()->noContent();
    }
}
