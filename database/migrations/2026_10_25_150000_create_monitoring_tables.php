<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('monitoring_role', 20)->default('none');
        });
        // All pre-existing accounts belong to the existing admin-only application.
        // Future users receive no monitoring privileges unless explicitly assigned.
        DB::table('users')->update(['monitoring_role' => 'admin']);

        Schema::create('system_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('event_identifier')->nullable()->unique();
            $table->string('event_type', 80);
            $table->string('category', 24);
            $table->string('severity', 12);
            $table->string('source', 16)->default('server');
            $table->unsignedBigInteger('actor_id')->nullable();
            $table->string('session_identifier', 64)->nullable();
            $table->string('resource_type', 40)->nullable();
            $table->string('resource_id', 80)->nullable();
            $table->string('message', 240);
            $table->string('path', 200)->nullable();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->json('metadata')->nullable();
            $table->string('fingerprint', 64)->nullable()->unique();
            $table->unsignedInteger('occurrences')->default(1);
            $table->string('status', 20)->default('open');
            $table->timestamp('occurred_at');
            $table->timestamp('created_at');
            $table->timestamp('last_seen_at');
            $table->index(['category', 'id']);
            $table->index(['severity', 'id']);
            $table->index(['status', 'id']);
            $table->index(['event_type', 'occurred_at']);
            $table->index('occurred_at');
            $table->index('last_seen_at');
        });
        Schema::create('monitoring_sessions', function (Blueprint $table) {
            $table->string('identifier', 64)->primary();
            $table->timestamp('started_at');
            $table->timestamp('last_seen_at')->index();
            $table->timestamp('ended_at')->nullable();
        });
        Schema::create('monitoring_receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamp('created_at')->index();
        });
        Schema::create('monitoring_maintenance', function (Blueprint $table) {
            $table->unsignedInteger('id')->primary();
            $table->timestamp('checked_at');
        });
        DB::table('monitoring_maintenance')->insert(['id' => 1, 'checked_at' => now()->subHour()]);
    }

    public function down(): void
    {
        Schema::dropIfExists('monitoring_maintenance');
        Schema::dropIfExists('monitoring_sessions');
        Schema::dropIfExists('monitoring_receipts');
        Schema::dropIfExists('system_events');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('monitoring_role'));
    }
};
