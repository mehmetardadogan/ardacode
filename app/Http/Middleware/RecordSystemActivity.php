<?php

namespace App\Http\Middleware;

use App\Services\EventRecorder;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RecordSystemActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        if (str_starts_with($request->getPathInfo(), '/admin') && !$request->is('admin/login', 'admin/logout') && !$request->user() && $response->isRedirect()) {
            EventRecorder::record('unauthorized_access', 'security', 'WARNING', 'Kimlik doğrulama gerektiren yönetim sayfasına oturumsuz erişim; giriş ekranına yönlendirildi', ['path' => $request->getPathInfo(), 'http_status' => 302]);
        }
        if ($response->getStatusCode() >= 400 && !$request->attributes->get('monitoring_error_recorded')) {
            $status = $response->getStatusCode();
            if (in_array($status, [401, 403, 404, 419, 429, 500, 502, 503])) {
                EventRecorder::reportException(new \Symfony\Component\HttpKernel\Exception\HttpException($status), $request);
            }
        }
        $actions = [
            'admin.projects.store' => ['project_created', 'Yeni proje oluşturuldu', 'project'],
            'admin.projects.update' => ['project_updated', 'Proje güncellendi', 'project'],
            'admin.projects.destroy' => ['project_deleted', 'Proje silindi', 'project'],
            'admin.services.store' => ['service_created', 'Hizmet oluşturuldu', 'service'],
            'admin.services.update' => ['service_updated', 'Hizmet güncellendi', 'service'],
            'admin.services.destroy' => ['service_deleted', 'Hizmet silindi', 'service'],
            'admin.settings.update' => ['settings_updated', 'Site ayarları güncellendi', 'settings'],
            'admin.messages.toggle' => ['message_updated', 'Mesajın okunma durumu değiştirildi', 'message'],
            'admin.messages.destroy' => ['message_deleted', 'Mesaj silindi', 'message'],
        ];
        $action = $actions[$request->route()?->getName()] ?? null;
        if ($action && $request->user() && $response->getStatusCode() < 400 && !$request->session()->has('errors')) {
            $context = ['actor_id' => $request->user()->id, 'resource_type' => $action[2], 'resource_id' => $request->attributes->get('monitoring_resource_id', $request->route('id')), 'path' => $request->getPathInfo(), 'metadata' => ['outcome' => 'success']];
            EventRecorder::record($action[0], 'admin', 'SUCCESS', $action[1], $context);
            foreach (['image_file', 'profile_image_file', 'site_logo_file'] as $field) {
                if ($request->hasFile($field)) EventRecorder::record('image_uploaded', 'admin', 'SUCCESS', 'Görsel kalıcı depolamaya kaydedildi', $context);
            }
        }
        if ($request->routeIs('contact.submit') && $response->getStatusCode() < 400 && !$request->session()->has('errors')) {
            EventRecorder::record('form_archived', 'forms', 'SUCCESS', 'İletişim formu yönetim paneli arşivine kaydedildi', ['resource_type' => 'message', 'path' => '/iletisim', 'metadata' => ['outcome' => 'archived', 'delivery' => 'not_verified']]);
        }
        return $response;
    }
}
