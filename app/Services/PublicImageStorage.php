<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublicImageStorage
{
    public static function store(UploadedFile $file): string
    {
        $id = (string) Str::uuid();
        DB::table('public_images')->insert([
            'id' => $id,
            'mime_type' => $file->getMimeType(),
            'contents' => base64_encode($file->getContent()),
            'created_at' => now(),
        ]);

        return '/media/'.$id;
    }
}
