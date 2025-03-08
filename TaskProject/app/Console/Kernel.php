<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Artisan komutlarının kaydı için kullanılır.
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }

    /**
     * Uygulamanın zamanlanmış görevlerini tanımlar.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('tasks:send-reminders')->everyThreeHours();
    }
}
