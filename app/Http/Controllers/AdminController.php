<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use App\Services\PublicImageStorage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $stats = [
            'total_projects' => Project::count(),
            'total_services' => Service::count(),
            'total_messages' => Message::count(),
            'unread_messages' => Message::where('is_read', false)->count(),
        ];

        $latestMessages = Message::latest()->take(5)->get();
        $recentProjects = Project::latest()->take(4)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'latestMessages' => $latestMessages,
            'recentProjects' => $recentProjects,
        ]);
    }

    // --- PROJELER ---
    public function projects(): Response
    {
        $projects = Project::orderBy('order', 'asc')->latest()->get();
        return Inertia::render('Admin/Projects', [
            'projects' => $projects,
        ]);
    }

    public function storeProject(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'technologies' => 'nullable',
            'live_url' => 'nullable|url',
            'is_demo' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'integer|min:0',
            'image_file' => 'nullable|image|max:4096',
        ]);

        $imagePath = '/images/projects/project-1.svg';
        if ($request->hasFile('image_file')) {
            $imagePath = PublicImageStorage::store($request->file('image_file'));
        }

        $technologies = is_array($request->technologies) 
            ? $request->technologies 
            : array_filter(array_map('trim', explode(',', (string)$request->technologies)));

        Project::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(4),
            'category' => $validated['category'],
            'description' => $validated['description'],
            'image' => $imagePath,
            'technologies' => $technologies,
            'live_url' => $validated['live_url'] ?? null,
            'is_demo' => $request->boolean('is_demo', true),
            'is_featured' => $request->boolean('is_featured', true),
            'order' => (int)($validated['order'] ?? 0),
        ]);

        return back()->with('success', 'Yeni proje başarıyla eklendi.');
    }

    public function updateProject(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'technologies' => 'nullable',
            'live_url' => 'nullable',
            'is_demo' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'integer|min:0',
            'image_file' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image_file')) {
            $project->image = PublicImageStorage::store($request->file('image_file'));
        }

        $technologies = is_array($request->technologies) 
            ? $request->technologies 
            : array_filter(array_map('trim', explode(',', (string)$request->technologies)));

        $project->title = $validated['title'];
        $project->category = $validated['category'];
        $project->description = $validated['description'];
        $project->technologies = $technologies;
        $project->live_url = $validated['live_url'] ?? null;
        $project->is_demo = $request->boolean('is_demo', true);
        $project->is_featured = $request->boolean('is_featured', true);
        $project->order = (int)($validated['order'] ?? 0);
        $project->save();

        return back()->with('success', 'Proje başarıyla güncellendi.');
    }

    public function destroyProject($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return back()->with('success', 'Proje silindi.');
    }

    // --- HİZMETLER ---
    public function services(): Response
    {
        $services = Service::orderBy('order', 'asc')->get();
        return Inertia::render('Admin/Services', [
            'services' => $services,
        ]);
    }

    public function storeService(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'icon' => 'nullable|string|max:50',
            'short_description' => 'required|string',
            'full_description' => 'nullable|string',
            'features' => 'nullable',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $features = is_array($request->features) 
            ? $request->features 
            : array_filter(array_map('trim', explode(',', (string)$request->features)));

        Service::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'icon' => $validated['icon'] ?? 'Layout',
            'short_description' => $validated['short_description'],
            'full_description' => $validated['full_description'] ?? null,
            'features' => $features,
            'order' => (int)($validated['order'] ?? 0),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Hizmet başarıyla eklendi.');
    }

    public function updateService(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'icon' => 'nullable|string|max:50',
            'short_description' => 'required|string',
            'full_description' => 'nullable|string',
            'features' => 'nullable',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $features = is_array($request->features) 
            ? $request->features 
            : array_filter(array_map('trim', explode(',', (string)$request->features)));

        $service->title = $validated['title'];
        $service->icon = $validated['icon'] ?? $service->icon;
        $service->short_description = $validated['short_description'];
        $service->full_description = $validated['full_description'] ?? null;
        $service->features = $features;
        $service->order = (int)($validated['order'] ?? 0);
        $service->is_active = $request->boolean('is_active', true);
        $service->save();

        return back()->with('success', 'Hizmet güncellendi.');
    }

    public function destroyService($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return back()->with('success', 'Hizmet silindi.');
    }

    // --- MESAJLAR ---
    public function messages(): Response
    {
        $messages = Message::latest()->get();
        return Inertia::render('Admin/Messages', [
            'messages' => $messages,
        ]);
    }

    public function toggleMessageRead($id)
    {
        $msg = Message::findOrFail($id);
        $msg->is_read = !$msg->is_read;
        $msg->save();

        return back()->with('success', 'Mesaj durumu güncellendi.');
    }

    public function destroyMessage($id)
    {
        $msg = Message::findOrFail($id);
        $msg->delete();

        return back()->with('success', 'Mesaj silindi.');
    }

    // --- AYARLAR ---
    public function settings(): Response
    {
        $settings = SiteSetting::getAllSettings();
        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'profile_image_file' => 'nullable|image|max:4096',
            'site_logo_file' => 'nullable|image|max:4096',
        ]);
        $data = $request->except(['_token', 'profile_image_file', 'site_logo_file']);

        // Profil fotoğrafı yükleme
        if ($request->hasFile('profile_image_file')) {
            SiteSetting::set('profile_image', PublicImageStorage::store($request->file('profile_image_file')));
        }

        // Logo yükleme
        if ($request->hasFile('site_logo_file')) {
            SiteSetting::set('site_logo', PublicImageStorage::store($request->file('site_logo_file')));
        }

        foreach ($data as $key => $value) {
            SiteSetting::set($key, (string)$value);
        }

        return back()->with('success', 'Site ayarları ve SEO bilgileri başarıyla güncellendi.');
    }
}
