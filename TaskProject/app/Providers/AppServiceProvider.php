<?php

namespace App\Providers;

use App\Services\TaskArchiveService;
use App\Services\TaskCategoryService;
use App\Services\TaskReorderService;
use App\Services\TaskService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Services\CalendarService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TaskService::class, function ($app) {
            return new TaskService();
        });

        $this->app->singleton(TaskCategoryService::class, function ($app): TaskCategoryService {
            return new TaskCategoryService();
        });

        $this->app->singleton(TaskReorderService::class, function ($app): TaskReorderService {
            return new TaskReorderService();
        });

        $this->app->singleton(TaskArchiveService::class, function ($app): TaskArchiveService {
            return new TaskArchiveService();
        });

        $this->app->singleton(CalendarService::class, function ($app): CalendarService {
            return new CalendarService();
        });



    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
