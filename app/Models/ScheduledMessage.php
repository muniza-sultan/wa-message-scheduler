<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Contact;

class ScheduledMessage extends Model
{
    protected $fillable = ['contact_id', 'user_id', 'message_content', 'send_at', 'status'];

    protected $casts = [
        'send_at' => 'datetime',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    /**
     * The user who scheduled (added) this message.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs()
    {
        return $this->hasMany(MessageLog::class);
    }
}
