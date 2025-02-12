<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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

// 🏠 Dashboard (Sadece Giriş Yapmış Kullanıcılar Erişebilir)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'tasks' => \App\Models\Task::with('taskCategory')->where('user_id', Auth::id())->get(),
        ]);
    })->name('dashboard');

    // 👤 Profil Yönetimi
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ✅ Görev Yönetimi (Kategori Dahil) - Sadece Giriş Yapmış Kullanıcılar
    Route::post('/tasks', [TaskController::class, 'createNewTask'])->name('tasks.store');
    Route::put('/tasks/{task}', [TaskController::class, 'updateTask'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'deleteTask'])->name('tasks.destroy');

    // 📂 Kategori Getirme
    Route::get('/task-categories', [TaskController::class, 'getCategories'])->name('categories.index');
});

require __DIR__.'/auth.php';
