<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    /**
     * List all contacts belonging to the current user. Response shape
     * matches the React admin app (id, name, phone, birthday).
     */
    public function index(Request $request)
    {
        return Auth::user()->contacts()->orderBy('name')->get()->map(fn (Contact $contact) => $this->transform($contact));
    }

    /**
     * Show a single contact (used by the Edit Contact page).
     */
    public function show(Contact $contact)
    {
        $this->authorizeContact($contact);

        return $this->transform($contact);
    }

    /**
     * Create a new contact.
     */
    public function store(Request $request)
    {
        $data = $this->validateContact($request);

        $contact = Auth::user()->contacts()->create([
            'name' => $data['name'],
            'phone_number' => $data['phone'],
            'birthday' => $data['birthday'] ?? null,
        ]);

        return response()->json($this->transform($contact), 201);
    }

    /**
     * Update an existing contact.
     */
    public function update(Request $request, Contact $contact)
    {
        $this->authorizeContact($contact);

        $data = $this->validateContact($request, $contact->id);

        $contact->update([
            'name' => $data['name'],
            'phone_number' => $data['phone'],
            'birthday' => $data['birthday'] ?? null,
        ]);

        return $this->transform($contact->fresh());
    }

    /**
     * Delete a contact (and its scheduled messages, via cascade).
     */
    public function destroy(Contact $contact)
    {
        $this->authorizeContact($contact);

        $contact->delete();

        return response()->json(null, 204);
    }

    /**
     * Make sure the authenticated user owns this contact.
     */
    protected function authorizeContact(Contact $contact): void
    {
        abort_unless($contact->user_id === Auth::id(), 404);
    }

    protected function validateContact(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => [
                'required',
                'string',
                'max:30',
                Rule::unique('contacts', 'phone_number')
                    ->where('user_id', Auth::id())
                    ->ignore($ignoreId),
            ],
            'birthday' => ['nullable', 'date'],
        ]);
    }

    /**
     * Map the DB column names to the field names the frontend expects.
     */
    protected function transform(Contact $contact): array
    {
        return [
            'id' => $contact->id,
            'name' => $contact->name,
            'phone' => $contact->phone_number,
            'birthday' => $contact->birthday?->format('Y-m-d'),
        ];
    }
}
