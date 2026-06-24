<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    /**
     * Return the current user's Twilio WhatsApp settings. The auth token
     * is never sent back to the browser — only whether one is on file.
     */
    public function show(Request $request)
    {
        return $this->transform($request->user());
    }

    /**
     * Save the current user's Twilio WhatsApp credentials.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'twilio_sid' => ['required', 'string', 'max:255'],
            'twilio_auth_token' => ['nullable', 'string', 'max:255'],
            'twilio_whatsapp_number' => ['required', 'string', 'max:30'],
        ]);

        // Keep the existing token if the user leaves the field blank
        // (so they don't have to re-enter it just to change the number).
        if (blank($data['twilio_auth_token'] ?? null)) {
            unset($data['twilio_auth_token']);

            if (blank($user->twilio_auth_token)) {
                return response()->json([
                    'message' => 'Auth token is required.',
                    'errors' => ['twilio_auth_token' => ['The Twilio auth token field is required.']],
                ], 422);
            }
        }

        $user->update($data);

        return $this->transform($user->fresh());
    }

    protected function transform($user): array
    {
        return [
            'twilio_sid' => $user->twilio_sid,
            'twilio_whatsapp_number' => $user->twilio_whatsapp_number,
            'has_auth_token' => filled($user->twilio_auth_token),
            'configured' => $user->hasTwilioConfigured(),
        ];
    }
}
