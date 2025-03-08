<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Task;
use Carbon\Carbon;

class TaskReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;

    /**
     * Yeni bildirim örneği oluştur.
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Bildirim hangi kanallarla gönderilecek?
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Bildirimin e-posta olarak gönderilmesi.
     */
    public function toMail($notifiable)
    {
        $dueDate = Carbon::parse($this->task->end_date)->format('d/m/Y H:i');
        $timeLeft = Carbon::parse($this->task->end_date)->diffForHumans(['parts' => 2]); // Örn: "11 saat sonra"

        return (new MailMessage)
            ->subject('⏳ Task Reminder: ' . $this->task->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('You have an upcoming task that is due soon.')
            ->line('🔹 **Task:** ' . $this->task->title)
            ->line('📅 **Due Date:** ' . $dueDate . ' (' . $timeLeft . ')')
            ->action('✅ View Task', url('/dashboard?task_id=' . $this->task->id))
            ->line('Make sure to complete your task on time!')
            ->line('If you have already completed this task, you can ignore this email.')
            ->salutation('🚀 Best Regards, Task Management System');
    }

    /**
     * Bildirimin array formatında temsil edilmesi.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'task_id' => $this->task->id,
            'title' => $this->task->title,
            'end_date' => $this->task->end_date,
        ];
    }
}
