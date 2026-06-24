<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login — {{ config('app.name', 'Scheduler') }}</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
    @vite(['resources/css/app.css'])
</head>
<body class="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 antialiased px-4">
    <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 class="mb-6 text-center text-xl font-semibold tracking-tight">Log in to your account</h1>

        @if ($errors->any())
            <div class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('login.attempt') }}" class="space-y-4">
            @csrf

            <div class="flex flex-col gap-1.5">
                <label for="email" class="text-sm font-medium text-slate-700">Email</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus
                       class="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="password" class="text-sm font-medium text-slate-700">Password</label>
                <input id="password" type="password" name="password" required
                       class="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
            </div>

            <div class="flex items-center gap-2">
                <input id="remember" type="checkbox" name="remember"
                       class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                <label for="remember" class="text-sm text-slate-600">Remember me</label>
            </div>

            <button type="submit"
                    class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Log in
            </button>
        </form>

        <div class="mt-6 space-y-2 text-center text-sm">
            <p class="text-slate-600">
                Don't have an account?
                <a href="{{ route('register') }}" class="font-medium text-blue-600 hover:underline">Sign up</a>
            </p>
            <p>
                <a href="{{ url('/') }}" class="text-slate-500 hover:underline">&larr; Back to home</a>
            </p>
        </div>
    </div>
</body>
</html>
