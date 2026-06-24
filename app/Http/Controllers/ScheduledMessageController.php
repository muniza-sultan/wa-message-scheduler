<?php

namespace App\Http\Controllers;

use App\Models\MessageLog;
use App\Models\ScheduledMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ScheduledMessageController extends Controller
{
    /**
     * List all scheduled messages (for the current user's contacts) with
     * their contact, in the shape the React admin app expects
     * (id, contact, content, scheduled_at, status).
     */
    public function index(Request $request)
    {
        return ScheduledMessage::with('contact')
            ->whereHas('contact', fn ($query) => $query->where('user_id', Auth::id()))
            ->orderByDesc('send_at')
            ->get()
            ->map(fn (ScheduledMessage $message) => $this->transform($message));
    }

    /**
     * Show a single scheduled message (used by the Message Details page).
     */
    public function show(ScheduledMessage $message)
    {
        $this->authorizeMessage($message);

        $message->load('contact');

        return $this->transform($message);
    }

    /**
     * Schedule a new WhatsApp message for a contact.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'contact_id' => [
                'required',
                'integer',
                Rule::exists('contacts', 'id')->where('user_id', Auth::id()),
            ],
            'content' => ['required', 'string'],
            'scheduled_at' => ['required', 'date', 'after_or_equal:now'],
        ]);

        if (! Auth::user()->hasTwilioConfigured()) {
            return response()->json([
                'message' => 'Set up your Twilio WhatsApp account in Settings before scheduling messages.',
            ], 422);
        }

        $message = ScheduledMessage::create([
            'contact_id' => $data['contact_id'],
            'user_id' => Auth::id(),
            'message_content' => $data['content'],
            'send_at' => $data['scheduled_at'],
            'status' => 'scheduled',
        ]);

        $message->load('contact');

        return response()->json($this->transform($message), 201);
    }

    /**
     * List the Twilio send logs for a scheduled message (used by the
     * "Show logs" button on the Message Details page).
     */
    public function logs(ScheduledMessage $message)
    {
        $this->authorizeMessage($message);

        return $message->logs()
            ->with('owner', 'addedBy')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (MessageLog $log) => [
                'id' => $log->id,
                'owner' => $log->owner?->name,
                'added_by' => $log->addedBy?->name,
                'to_number' => $log->to_number,
                'success' => $log->success,
                'error' => $log->error,
                'response_message' => $log->response_message,
                'created_at' => $log->created_at->toDateTimeString(),
            ]);
    }

    /**
     * Re-queue a message for sending (e.g. retry a failed message, or
     * push a message back to "scheduled" so the scheduler picks it up
     * again).
     */
    public function regenerate(ScheduledMessage $message)
    {
        $this->authorizeMessage($message);

        $message->update(['status' => 'scheduled']);

        $message->load('contact');

        return $this->transform($message);
    }

    /**
     * Update a scheduled message's contact, content or send time.
     */
    public function update(Request $request, ScheduledMessage $message)
    {
        $this->authorizeMessage($message);

        if ($message->status !== 'scheduled') {
            return response()->json([
                'message' => 'Only scheduled messages can be edited.',
            ], 422);
        }

        $data = $request->validate([
            'contact_id' => [
                'required',
                'integer',
                Rule::exists('contacts', 'id')->where('user_id', Auth::id()),
            ],
            'content' => ['required', 'string'],
            'scheduled_at' => ['required', 'date', 'after_or_equal:now'],
        ]);

        $message->update([
            'contact_id' => $data['contact_id'],
            'message_content' => $data['content'],
            'send_at' => $data['scheduled_at'],
        ]);

        $message->load('contact');

        return $this->transform($message);
    }

    /**
     * Cancel a scheduled message so it won't be sent.
     */
    public function cancel(ScheduledMessage $message)
    {
        $this->authorizeMessage($message);

        if ($message->status !== 'scheduled') {
            return response()->json([
                'message' => 'Only scheduled messages can be cancelled.',
            ], 422);
        }

        $message->update(['status' => 'cancelled']);

        $message->load('contact');

        return $this->transform($message);
    }

    /**
     * Make sure the authenticated user owns the contact this message belongs to.
     */
    protected function authorizeMessage(ScheduledMessage $message): void
    {
        abort_unless($message->contact && $message->contact->user_id === Auth::id(), 404);
    }

    /**
     * Map the DB column names to the field names the frontend expects.
     */
    protected function transform(ScheduledMessage $message): array
    {
        return [
            'id' => $message->id,
            'contact' => $message->contact ? [
                'id' => $message->contact->id,
                'name' => $message->contact->name,
                'phone' => $message->contact->phone_number,
            ] : null,
            'content' => $message->message_content,
            'scheduled_at' => optional($message->send_at)->toDateTimeString(),
            'status' => $message->status,
        ];
    }
}
