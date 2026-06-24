<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ScheduledMessage;
use App\Models\User;

class Contact extends Model
{
    protected $fillable = ['user_id', 'name', 'phone_number', 'birthday'];

    protected $casts = [
        'birthday' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scheduledMessages()
    {
        return $this->hasMany(ScheduledMessage::class);
    }
}