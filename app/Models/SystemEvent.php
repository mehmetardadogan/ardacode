<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemEvent extends Model
{
    public $timestamps = false;
    protected $guarded = [];
    protected $hidden = ['fingerprint', 'event_identifier'];

    protected function casts(): array
    {
        return ['metadata' => 'array', 'occurred_at' => 'datetime', 'created_at' => 'datetime', 'last_seen_at' => 'datetime'];
    }
}
