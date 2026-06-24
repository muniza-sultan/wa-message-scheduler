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
        DB::statement("ALTER TABLE scheduled_messages MODIFY status ENUM('pending', 'sent', 'failed', 'cancelled') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("UPDATE scheduled_messages SET status = 'failed' WHERE status = 'cancelled'");
        DB::statement("ALTER TABLE scheduled_messages MODIFY status ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending'");
    }
};
