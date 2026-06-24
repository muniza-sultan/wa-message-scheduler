<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('scheduled_messages', function (Blueprint $table) {
            // Explicit constraint name: the auto-generated name
            // ("scheduled_messages_user_id_foreign") collides with the index of
            // the same name still backing the contact_id foreign key (a leftover
            // from when that column was originally named user_id).
            $table->foreignId('user_id')
                ->nullable()
                ->after('contact_id')
                ->constrained(indexName: 'scheduled_messages_added_by_foreign')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scheduled_messages', function (Blueprint $table) {
            $table->dropForeign('scheduled_messages_added_by_foreign');
            $table->dropColumn('user_id');
        });
    }
};
