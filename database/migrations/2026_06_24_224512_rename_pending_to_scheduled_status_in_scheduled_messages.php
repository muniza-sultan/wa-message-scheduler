<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE scheduled_messages MODIFY status ENUM('pending', 'scheduled', 'sent', 'failed', 'cancelled') NOT NULL DEFAULT 'pending'");
        DB::statement("UPDATE scheduled_messages SET status = 'scheduled' WHERE status = 'pending'");
        DB::statement("ALTER TABLE scheduled_messages MODIFY status ENUM('scheduled', 'sent', 'failed', 'cancelled') NOT NULL DEFAULT 'scheduled'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE scheduled_messages MODIFY status ENUM('scheduled', 'pending', 'sent', 'failed', 'cancelled') NOT NULL DEFAULT 'scheduled'");
        DB::statement("UPDATE scheduled_messages SET status = 'pending' WHERE status = 'scheduled'");
        DB::statement("ALTER TABLE scheduled_messages MODIFY status ENUM('pending', 'sent', 'failed', 'cancelled') NOT NULL DEFAULT 'pending'");
    }
};
