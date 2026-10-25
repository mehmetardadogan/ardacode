<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('monitoring:prune', function () {
    $this->info(\App\Services\EventRecorder::prune().' event rows removed by the retention policy.');
})->purpose('Prune monitoring events older than 30 days and enforce the 50,000 row cap');
