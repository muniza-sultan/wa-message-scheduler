<?php

namespace App\Services;

use App\Models\User;
use RuntimeException;
use Twilio\Rest\Api\V2010\Account\MessageInstance;
use Twilio\Rest\Client;

class WhatsAppService
{
    protected Client $client;
    protected string $from;

    /**
     * Build a WhatsApp sender for a specific user, using that user's own
     * Twilio credentials so messages always come from their own number.
     */
    public static function forUser(User $user): self
    {
        if (! $user->hasTwilioConfigured()) {
            throw new RuntimeException("User #{$user->id} has not configured their Twilio account.");
        }

        return new self($user->twilio_sid, $user->twilio_auth_token, $user->twilio_whatsapp_number);
    }

    public function __construct(string $sid, string $token, string $from)
    {
        $this->client = new Client($sid, $token);

        // Stored without the "whatsapp:" prefix; Twilio requires it on the "from" address.
        $this->from = str_starts_with($from, 'whatsapp:') ? $from : 'whatsapp:'.$from;
    }

    /**
     * Send a WhatsApp message to the given phone number.
     *
     * @return MessageInstance The Twilio API response, including the SID and delivery status.
     */
    public function send(string $toPhoneNumber, string $body): MessageInstance
    {
        return $this->client->messages->create(
            'whatsapp:'.$toPhoneNumber,
            [
                'from' => $this->from,
                'body' => $body,
            ]
        );
    }
}
