<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskCategoryController;

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

    // 📌 Görev Yönetimi
    Route::resource('tasks', TaskController::class)->except(['show', 'edit', 'create']);
    Route::put('/tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
    
    // 📌 Hatalı Route'lar kaldırıldı, yerine doğru route eklendi
    Route::put('/tasks/{task}/toggle-status', [TaskController::class, 'toggleStatus'])->name('tasks.toggleStatus');

    // Kategori Yönetimi
    Route::get('/categories', [TaskCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [TaskCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [TaskCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [TaskCategoryController::class, 'destroy'])->name('categories.destroy');
});


require __DIR__.'/auth.php';
