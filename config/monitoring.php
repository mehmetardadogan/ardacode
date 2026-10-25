<?php

return [
    'enabled' => env('MONITORING_ENABLED', true),
    'retention_days' => 30,
    'max_events' => 50000,
    'poll_seconds' => 8,
    'active_minutes' => 5,
    'cron_secret' => env('CRON_SECRET'),
];
