<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TaskController;

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

Route::middleware('auth')->group(function () {
    // 📌 Profil Yönetimi
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 📌 Görev Yönetimi - Daha temiz bir yapı için `resource` kullanıldı
    Route::resource('tasks', TaskController::class)->except(['show', 'edit', 'create']);
    Route::put('/tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
    Route::put('/tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::put('/tasks/{task}/toggle-complete', [TaskController::class, 'toggleComplete']);

});

require __DIR__.'/auth.php';
