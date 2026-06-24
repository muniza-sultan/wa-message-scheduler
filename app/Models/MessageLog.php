<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageLog extends Model
{
    protected $fillable = [
        'scheduled_message_id',
        'owner_id',
        'added_by_id',
        'to_number',
        'success',
        'error',
        'response_message',
    ];

    protected $casts = [
        'success' => 'boolean',
    ];

    public function scheduledMessage()
    {
        return $this->belongsTo(ScheduledMessage::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by_id');
    }
}
