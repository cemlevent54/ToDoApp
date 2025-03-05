<?php

namespace App\Services;

use App\Models\Task;

class TaskReorderService {

    public function reorderTasks(array $tasks): void {
        foreach ($tasks as $index => $taskData) {
            $task = Task::find($taskData['id']);

            if (!$task) {
                continue;
            }

            // Önceki ve sonraki görevleri bul
            $previousTask = $index > 0 ? Task::find($tasks[$index - 1]['id']) : null;
            $nextTask = $index < count($tasks) - 1 ? Task::find($tasks[$index + 1]['id']) : null;

            // Yeni priority hesaplama
            if ($previousTask && $nextTask) {
                $newPriority = ($previousTask->priority + $nextTask->priority) / 2;
            } elseif ($previousTask) {
                $newPriority = $previousTask->priority + 10;
            } elseif ($nextTask) {
                $newPriority = $nextTask->priority - 10;
            } else {
                $newPriority = 10;
            }

            // Yeni priority'yi ata
            $task->update([
                'priority' => $newPriority,
                'status' => $taskData['status'] ?? $task->status
            ]);
        }

        // Eğer priority değerleri çok sıkıştıysa, yeniden düzenleme yap
        $this->normalizePriorities();
    }

    private function normalizePriorities(): void {
        $tasks = Task::orderBy('priority')->get();
        $priority = 10;
        foreach ($tasks as $task) {
            $task->update(['priority' => $priority]);
            $priority += 10;
        }
    }
}
