<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task;
use Carbon\Carbon;
use App\Notifications\TaskReminderNotification;
use Illuminate\Support\Facades\Log;

class SendTaskReminders extends Command
{
    protected $signature = 'tasks:send-reminders';
    protected $description = 'Send reminders for tasks that are due soon';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $now = Carbon::now();
        $tasks = Task::whereNotNull('end_date')
                     ->where('end_date', '>=', $now) // Henüz bitmemiş görevleri al
                     ->where(function ($query) use ($now) {
                         $query->whereBetween('end_date', [$now, $now->copy()->addHours(12)]) // 12 saat içinde bitecek olanlar
                               ->orWhereBetween('end_date', [$now, $now->copy()->addDay()]);  // 1 gün içinde bitecek olanlar
                     })
                     ->get();

        foreach ($tasks as $task) {
            if ($task->user()->exists()) {
                $task->user->notify(new TaskReminderNotification($task));

                // Log kaydı ekleyerek hangi görevler için e-posta gittiğini takip et
                Log::info('Task reminder sent to: ' . $task->user->email . ' for task: ' . $task->title);
            }
        }

        $this->info('Task reminders sent successfully.');
    }
}
