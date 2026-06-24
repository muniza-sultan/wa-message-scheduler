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
            $table->dropForeign('scheduled_messages_user_id_foreign');
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scheduled_messages', function (Blueprint $table) {
            $table->dropForeign(['contact_id']);
            $table->foreign('contact_id', 'scheduled_messages_user_id_foreign')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
