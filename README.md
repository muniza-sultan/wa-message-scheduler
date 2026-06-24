# WhatsApp Scheduler

A Laravel + React platform for scheduling WhatsApp messages to your contacts —
birthday reminders, follow-ups, or anything else you'd rather not forget to send
by hand. Each user connects their **own** Twilio WhatsApp account, so messages
go out from a number your contacts actually recognize as yours.

## Features

- **Authentication** — register/login with a simple homepage; the dashboard lives
  behind a login wall.
- **Contacts** — create, edit, and delete contacts (name, phone number, birthday),
  scoped privately to your account.
- **Scheduled messages** — compose a WhatsApp message, pick a contact and a
  send time, and let the scheduler deliver it automatically. Includes a
  one-click birthday-message suggestion. Messages can be edited or cancelled
  any time before they're sent.
- **Send logs** — every Twilio send attempt (success or failure) is recorded
  per message, including the owner, who scheduled it, the destination number,
  and Twilio's response or error — viewable from the message's detail page.
- **Per-user Twilio settings** — each user enters their own Twilio Account SID,
  Auth Token, and WhatsApp number under *Settings*, so messages are sent from
  their own number rather than a shared one. The "Schedule Message" action is
  disabled until this is configured.
- **Admin dashboard** — a React (Vite-powered) SPA mounted directly inside the
  Laravel app, covering Contacts, Messages, and Settings.

## Tech stack

- **Backend:** Laravel 12 (Eloquent, session-based auth, queued jobs, task
  scheduling)
- **Frontend:** React (Create React App-based admin SPA, mounted via Vite),
  React Router
- **Messaging:** Twilio WhatsApp API (`twilio/sdk`)

## Getting started

### 1. Install dependencies

```bash
composer install
npm install
```

### 2. Configure your environment

```bash
cp .env.example .env
php artisan key:generate
```

Set up your database connection in `.env`, then run the migrations:

```bash
php artisan migrate
```

### 3. Run the app

```bash
php artisan serve
npm run dev
```

Visit `http://127.0.0.1:8000`. Register an account, log in, and you'll land on
the dashboard at `/dashboard`.

### 4. Connect your Twilio WhatsApp account

From the dashboard, open **Settings** and enter:

- **Account SID** — found on your Twilio Console dashboard
- **Auth Token** — found on your Twilio Console dashboard (stored encrypted,
  never shown again once saved)
- **WhatsApp Number** — your Twilio WhatsApp sender, e.g.
  `whatsapp:+14155238886`

Once all three are filled in, the "+ Schedule Message" action becomes available.

### 5. Run the scheduler & queue worker

Scheduled messages are picked up by Laravel's task scheduler and sent through a
queued job:

```bash
php artisan schedule:work
php artisan queue:work
```

(In production, configure these via cron and a process manager such as
Supervisor instead.)

## How it works

1. You add contacts and schedule WhatsApp messages for them (status:
   `scheduled`). You can edit or cancel a message any time before it sends;
   cancelling sets it to `cancelled` and the scheduler skips it.
2. Every minute, the scheduler checks for `scheduled` messages whose send
   time has arrived and dispatches a queued job for each one.
3. The job looks up the contact's owner, builds a Twilio client from *that
   user's* stored credentials, and sends the message from their configured
   WhatsApp number — marking the message as `sent` or `failed` accordingly,
   and recording the attempt (success/error, Twilio response, to-number,
   owner, who scheduled it) in the message's send log.

## Project structure highlights

- `app/Http/Controllers` — `AuthController`, `ContactController`,
  `ScheduledMessageController`, `SettingsController`
- `app/Services/WhatsAppService.php` — wraps the Twilio SDK; built per-user via
  `WhatsAppService::forUser($user)`
- `app/Jobs/SendWhatsAppMessage.php` — queued job that sends a single message
  and logs the attempt
- `app/Models/MessageLog.php` — audit trail of Twilio send attempts per
  scheduled message
- `resources/js/admin` — the React admin SPA (Contacts, Messages, Settings)
- `routes/web.php` — page routes plus the `/api/*` JSON endpoints consumed by
  the SPA (kept in the `web`/`auth` middleware group so they share the user's
  session)
