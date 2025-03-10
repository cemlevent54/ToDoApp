<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskCategoryController;
use App\Http\Controllers\SocialiteController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 📌 Dashboard artık `TaskController@index` üzerinden verileri alacak
Route::get('/dashboard', [TaskController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::controller(SocialiteController::class)->group(function() {
    Route::get('auth/google', [SocialiteController::class, 'googleLogin'])->name('auth.google');
    Route::get('auth/google-callback', [SocialiteController::class, 'googleAuthentication']);
});

Route::middleware('auth')->group(function () {
    // 📌 Profil Yönetimi
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 📌 Görev Yönetimi
    Route::resource('tasks', TaskController::class)->except(['show', 'edit', 'create']);
    Route::put('/tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
    Route::put('/tasks/{task}/toggle-archive', [TaskController::class, 'archiveTask'])->name('tasks.archive');
    Route::put('/tasks/{task}/toggle-status', [TaskController::class, 'toggleStatus'])->name('tasks.toggleStatus');

    // 📌 Kategori Yönetimi
    Route::get('/categories', [TaskCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [TaskCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [TaskCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [TaskCategoryController::class, 'destroy'])->name('categories.destroy');

    // 📌 Google Takvim Entegrasyonu
    Route::post('/profile/toggle-google-sync', [ProfileController::class, 'toggleGoogleSync'])->name('profile.toggleGoogleSync');
    Route::post('/tasks/sync-google', [TaskController::class, 'syncGoogleTasks'])->name('tasks.syncGoogle'); // ✅ Yeni route eklendi
});

require __DIR__.'/auth.php';
