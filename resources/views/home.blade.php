<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Scheduler') }}</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
    @vite(['resources/css/app.css'])
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
    <header class="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
        <h2 class="text-lg font-semibold tracking-tight">WhatsApp Scheduler</h2>
        <a href="{{ route('login') }}"
           class="inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700">
            Login
        </a>
    </header>

    <main class="flex flex-col items-center justify-center text-center px-6 py-28">
        <span class="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Never miss a moment
        </span>
        <h1 class="max-w-2xl text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Schedule WhatsApp messages, effortlessly
        </h1>
        <p class="mt-5 max-w-xl text-lg text-slate-600">
            Add your contacts, write a message, pick a date and time —
            we'll deliver it over WhatsApp right when you want it sent,
            from your own number.
        </p>
        <a href="{{ route('register') }}"
           class="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
            Get started — it's free
        </a>
    </main>
</body>
</html>
