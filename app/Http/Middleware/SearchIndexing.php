<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SearchIndexing
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        if ($request->is('admin', 'admin/*', 'login', 'internal/*', 'izleme/*', 'up') || $response->getStatusCode() >= 400) {
            $response->headers->set('X-Robots-Tag', 'noindex, nofollow');
        }
        return $response;
    }
}
