<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Contact;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'twilio_sid',
        'twilio_auth_token',
        'twilio_whatsapp_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'twilio_auth_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'twilio_auth_token' => 'encrypted',
        ];
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Whether the user has filled in all the fields needed to send
     * WhatsApp messages through their own Twilio account.
     */
    public function hasTwilioConfigured(): bool
    {
        return filled($this->twilio_sid)
            && filled($this->twilio_auth_token)
            && filled($this->twilio_whatsapp_number);
    }
}
