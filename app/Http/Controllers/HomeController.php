<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Services\Seo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $services = Service::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();

        $projects = Project::orderBy('order', 'asc')
            ->get();

        $settings = SiteSetting::getAllSettings();

        // Ensure formspree endpoint is available in settings
        if (!isset($settings['formspree_endpoint']) || empty($settings['formspree_endpoint'])) {
            $settings['formspree_endpoint'] = env('FORMSPREE_ENDPOINT', 'https://formspree.io/f/xaeeqjdq');
        }

        return Inertia::render('Home', [
            'services' => $services,
            'projects' => $projects,
            'settings' => $settings,
            'seo' => Seo::page($settings, $services),
        ]);
    }

    public function projectDetail(string $slug): Response
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        $relatedProjects = Project::where('id', '!=', $project->id)
            ->where('category', $project->category)
            ->take(3)
            ->get();

        if ($relatedProjects->isEmpty()) {
            $relatedProjects = Project::where('id', '!=', $project->id)->take(3)->get();
        }

        $settings = SiteSetting::getAllSettings();

        return Inertia::render('ProjectDetail', [
            'project' => $project,
            'relatedProjects' => $relatedProjects,
            'settings' => $settings,
            'seo' => Seo::page($settings, [], $project),
        ]);
    }

    public function contact(Request $request)
    {
        // Support both 'message' and 'details' field names
        $detailsField = $request->has('message') ? 'message' : 'details';

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:30',
            'service' => 'nullable|string|max:100',
            $detailsField => 'required|string|min:10|max:4000',
        ], [
            'name.required' => 'Lütfen adınızı ve soyadınızı belirtin.',
            'email.required' => 'Lütfen geçerli bir e-posta adresi girin.',
            'email.email' => 'Geçerli bir e-posta formatı giriniz.',
            "{$detailsField}.required' => 'Lütfen projeniz hakkında kısa bir açıklama yazın.",
            "{$detailsField}.min' => 'Proje detayları en az 10 karakter olmalıdır.",
        ]);

        $messageContent = $validated[$detailsField];

        $message = Message::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'service' => $validated['service'] ?? null,
            'details' => $messageContent,
            'ip_address' => $request->ip(),
        ]);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Mesajınız başarıyla iletildi! Mehmet Arda Studio ile iletişime geçtiğiniz için teşekkür ederiz. En kısa sürede size dönüş yapacağız.',
                'id' => $message->id,
            ]);
        }

        return back()->with('success', 'Mesajınız başarıyla iletildi! Mehmet Arda Studio ile iletişime geçtiğiniz için teşekkür ederiz. En kısa sürede size dönüş yapacağız.');
    }

    public function sitemap()
    {
        $baseUrl = Seo::url();
        $projects = Project::all();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        
        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars($baseUrl, ENT_XML1, 'UTF-8') . '</loc>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>1.0</priority>';
        $xml .= '</url>';

        foreach ($projects as $project) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars(Seo::url('projeler/'.rawurlencode($project->slug)), ENT_XML1, 'UTF-8') . '</loc>';
            $xml .= '<lastmod>' . $project->updated_at->format('Y-m-d') . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }

    public function robots()
    {
        $content = "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /internal/\nDisallow: /izleme/\n\nSitemap: " . Seo::url('sitemap.xml')."\n";
        return response($content, 200)->header('Content-Type', 'text/plain');
    }
}
