<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ScheduledMessageController;
use App\Http\Controllers\SettingsController;

Route::get('/', function () {
    return view('home');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');

    Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.attempt');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Catch-all so React Router can handle client-side routes under /dashboard.
    Route::get('/dashboard/{any?}', function () {
        return view('dashboard');
    })->where('any', '.*')->name('dashboard');

    // JSON endpoints consumed by the React admin app. These live under the
    // "web" middleware group (not "api") so they share the logged-in user's
    // session — that's what lets us scope contacts/messages per user.
    Route::prefix('api')->group(function () {
        Route::apiResource('contacts', ContactController::class);

        Route::get('messages', [ScheduledMessageController::class, 'index']);
        Route::post('messages', [ScheduledMessageController::class, 'store']);
        Route::get('messages/{message}', [ScheduledMessageController::class, 'show']);
        Route::put('messages/{message}', [ScheduledMessageController::class, 'update']);
        Route::get('messages/{message}/logs', [ScheduledMessageController::class, 'logs']);
        Route::post('messages/{message}/regenerate', [ScheduledMessageController::class, 'regenerate']);
        Route::post('messages/{message}/cancel', [ScheduledMessageController::class, 'cancel']);

        Route::get('settings/twilio', [SettingsController::class, 'show']);
        Route::put('settings/twilio', [SettingsController::class, 'update']);
    });
});
