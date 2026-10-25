<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'description',
        'image',
        'technologies',
        'live_url',
        'is_demo',
        'order',
        'is_featured',
    ];

    protected $casts = [
        'technologies' => 'array',
        'is_demo' => 'boolean',
        'is_featured' => 'boolean',
        'order' => 'integer',
    ];
}
