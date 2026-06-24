<?php

namespace App\Jobs;

use App\Models\Contact;
use App\Models\MessageLog;
use App\Models\ScheduledMessage;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendWhatsAppMessage implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    protected ScheduledMessage $message;

    /**
     * Create a new job instance.
     */
    public function __construct(ScheduledMessage $message)
    {
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Skip if it's already been handled (e.g. duplicate dispatch).
        if ($this->message->status !== 'scheduled') {
            return;
        }

        $contact = $this->message->contact;

        if (! $contact || empty($contact->phone_number)) {
            $this->message->update(['status' => 'failed']);

            return;
        }

        $owner = $contact->user;

        if (! $owner || ! $owner->hasTwilioConfigured()) {
            Log::warning('Skipping WhatsApp message: owner has no Twilio account configured', [
                'scheduled_message_id' => $this->message->id,
            ]);

            $this->message->update(['status' => 'failed']);

            return;
        }

        try {
            $whatsApp = WhatsAppService::forUser($owner);
            $response = $whatsApp->send($contact->phone_number, $this->message->message_content);

            $this->message->update(['status' => 'sent']);

            $this->log($contact, $owner, success: true, responseMessage: "SID: {$response->sid}, status: {$response->status}");
        } catch (Throwable $e) {
            Log::error('Failed to send WhatsApp message', [
                'scheduled_message_id' => $this->message->id,
                'error' => $e->getMessage(),
            ]);

            $this->log($contact, $owner, success: false, error: $e->getMessage());

            throw $e;
        }
    }

    /**
     * Record the outcome of a Twilio send attempt for this message.
     */
    protected function log(
        Contact $contact,
        User $owner,
        bool $success,
        ?string $error = null,
        ?string $responseMessage = null
    ): void {
        MessageLog::create([
            'scheduled_message_id' => $this->message->id,
            'owner_id' => $owner->id,
            'added_by_id' => $this->message->user_id,
            'to_number' => $contact->phone_number,
            'success' => $success,
            'error' => $error,
            'response_message' => $responseMessage,
        ]);
    }

    /**
     * Handle a job failure after all retries are exhausted.
     */
    public function failed(?Throwable $exception): void
    {
        $this->message->update(['status' => 'failed']);
    }
}
