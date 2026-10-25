<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Services\EventRecorder;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('view-monitoring', fn (User $user) => in_array($user->monitoring_role, ['admin', 'analyst'], true));
        Gate::define('manage-monitoring', fn (User $user) => $user->monitoring_role === 'admin');
        RateLimiter::for('telemetry', fn (Request $request) => [
            Limit::perMinute(90)->by(hash_hmac('sha256', (string) $request->ip(), config('app.key'))),
            Limit::perMinute(600)->by('monitoring-global-ingest'),
        ]);
        RateLimiter::for('monitoring', fn (Request $request) => Limit::perMinute(60)->by((string) $request->user()?->id));
        Event::listen(Login::class, fn ($event) => EventRecorder::record('auth_login', 'admin', 'SUCCESS', 'Yönetici oturum açtı', ['actor_id' => $event->user->id, 'metadata' => ['outcome' => 'success']]));
        Event::listen(Failed::class, fn ($event) => EventRecorder::record('auth_failed', 'security', 'WARNING', 'Giriş denemesi başarısız oldu; tek başına saldırı göstergesi değildir', ['actor_id' => $event->user?->id, 'metadata' => ['outcome' => 'failed']]));
        Event::listen(Logout::class, fn ($event) => EventRecorder::record('auth_logout', 'admin', 'INFO', 'Yönetici oturumu kapattı', ['actor_id' => $event->user?->id]));
        User::updated(function (User $user) {
            if ($user->wasChanged('monitoring_role')) {
                EventRecorder::record('permission_changed', 'security', 'CRITICAL', 'İzleme erişim yetkisi değiştirildi; yetkili değişiklik olduğunu doğrulayın', [
                    'actor_id' => auth()->id(), 'resource_type' => 'user', 'resource_id' => $user->id,
                    'metadata' => ['previous_role' => in_array($user->getOriginal('monitoring_role'), ['none', 'analyst', 'admin']) ? $user->getOriginal('monitoring_role') : 'unknown', 'new_role' => in_array($user->monitoring_role, ['none', 'analyst', 'admin']) ? $user->monitoring_role : 'unknown'],
                ]);
            }
        });
    }
}
