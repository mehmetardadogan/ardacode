<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicImageController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\TelemetryController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/internal/monitoring/prune', [MonitoringController::class, 'prune'])->middleware('throttle:5,1')->name('monitoring.prune');
Route::post('/izleme/olay', [TelemetryController::class, 'store'])->middleware('throttle:telemetry')->name('telemetry.store');
Route::post('/izleme/iptal', [TelemetryController::class, 'revoke'])->middleware('throttle:telemetry')->name('telemetry.revoke');
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/media/{id}', [PublicImageController::class, 'show'])->whereUuid('id')->name('media.show');
Route::get('/projeler/{slug}', [HomeController::class, 'projectDetail'])->name('project.detail');
Route::post('/iletisim', [HomeController::class, 'contact'])
    ->middleware('throttle:10,1')
    ->name('contact.submit');

Route::get('/sitemap.xml', [HomeController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [HomeController::class, 'robots'])->name('robots');

// Admin Auth Routes
Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/login', fn () => redirect()->route('login'))->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1')
    ->name('admin.login.submit');
Route::post('/admin/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('admin.logout');

// Admin Protected Area
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::middleware(['can:view-monitoring', 'throttle:monitoring'])->group(function () {
        Route::get('/izleme', [MonitoringController::class, 'index'])->name('monitoring');
        Route::get('/izleme/events', [MonitoringController::class, 'events'])->name('monitoring.events');
        Route::get('/izleme/export', [MonitoringController::class, 'export'])->name('monitoring.export');
        Route::get('/izleme/events/{event}', [MonitoringController::class, 'show'])->whereNumber('event')->name('monitoring.show');
        Route::patch('/izleme/events/{event}', [MonitoringController::class, 'update'])->whereNumber('event')->name('monitoring.update');
    });
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    // Projects
    Route::get('/projeler', [AdminController::class, 'projects'])->name('projects');
    Route::post('/projeler', [AdminController::class, 'storeProject'])->name('projects.store');
    Route::post('/projeler/{id}', [AdminController::class, 'updateProject'])->name('projects.update');
    Route::delete('/projeler/{id}', [AdminController::class, 'destroyProject'])->name('projects.destroy');

    // Services
    Route::get('/hizmetler', [AdminController::class, 'services'])->name('services');
    Route::post('/hizmetler', [AdminController::class, 'storeService'])->name('services.store');
    Route::put('/hizmetler/{id}', [AdminController::class, 'updateService'])->name('services.update');
    Route::delete('/hizmetler/{id}', [AdminController::class, 'destroyService'])->name('services.destroy');

    // Messages
    Route::get('/mesajlar', [AdminController::class, 'messages'])->name('messages');
    Route::post('/mesajlar/{id}/toggle', [AdminController::class, 'toggleMessageRead'])->name('messages.toggle');
    Route::delete('/mesajlar/{id}', [AdminController::class, 'destroyMessage'])->name('messages.destroy');

    // Settings & SEO
    Route::get('/ayarlar', [AdminController::class, 'settings'])->name('settings');
    Route::post('/ayarlar', [AdminController::class, 'updateSettings'])->name('settings.update');
});
