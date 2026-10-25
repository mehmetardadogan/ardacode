<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->append(\App\Http\Middleware\RecordSystemActivity::class);
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (\Throwable $exception) {
            \App\Services\EventRecorder::reportException($exception, app()->bound('request') ? request() : null);
            // Keep the durable fallback safe too: no SQL bindings, trace or raw exception message.
            \Illuminate\Support\Facades\Log::error('Application exception; inspect the private monitoring center.', [
                'category' => $exception instanceof \Illuminate\Database\QueryException ? 'database' : 'application',
                'path' => app()->bound('request') ? \App\Services\EventRecorder::safePath(request()->getPathInfo()) : '[console]',
            ]);
            return false;
        });
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $exception, \Illuminate\Http\Request $request) {
            \App\Services\EventRecorder::reportException($exception, $request, $response->getStatusCode());
            if ($request->routeIs('contact.submit') && $response->getStatusCode() === 422) {
                \App\Services\EventRecorder::record('form_validation_failed', 'forms', 'WARNING', 'Sunucu iletişim formunu doğrulama nedeniyle reddetti', ['path' => '/iletisim', 'http_status' => 422, 'metadata' => ['outcome' => 'rejected']]);
            }
            return $response;
        });
    })->create();
