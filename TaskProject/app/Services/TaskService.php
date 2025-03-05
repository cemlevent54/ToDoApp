<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TaskCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TaskService {

    public function getTasks(): Collection {
        return Task::where('user_id', Auth::id())
                    ->with('category')
                    ->orderBy('priority','asc')
                    ->get();
    }

    public function getTasksByStatus(int $status): Collection {
        return Task::where('user_id', Auth::id())
                    ->where('status', $status)
                    ->with('category')
                    ->orderBy('priority', 'asc')
                    ->get();
    }

    public function getAllCategories(): Collection {
        return TaskCategory::where('user_id', Auth::id())->get();
    }

    public function createTask(array $data): Task {
        if (!TaskCategory::where('id', $data['category_id'])->where('user_id', Auth::id())->exists()) {
            throw new \Exception("Unauthorized category selection.");
        }

        return Task::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => 0, // Varsayılan olarak "pending"
            'user_id' => Auth::id(),
            'category_id' => $data['category_id'] ?? null,
            'start_date' => isset($data['start_date']) ? Carbon::parse($data['start_date']) : null,
            'end_date' => isset($data['end_date']) ? Carbon::parse($data['end_date']) : null,
            'priority' => $data['priority'] ?? 0,
        ]);
    }

    public function updateTask(Task $task, array $data): Task {
        if (isset($data['category_id']) && !TaskCategory::where('id', $data['category_id'])->where('user_id', Auth::id())->exists()) {
            throw new \Exception("Unauthorized category selection.");
        }

        $task->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'start_date' => isset($data['start_date']) ? Carbon::parse($data['start_date']) : null,
            'end_date' => isset($data['end_date']) ? Carbon::parse($data['end_date']) : null,
            'priority' => $data['priority'] ?? $task->priority,
        ]);
        return $task;
    }

    public function toggleStatus(Task $task, int $status): Task {
        $task->update(['status' => $status]);
        return $task;
    }

    public function deleteTask(Task $task): void {
        $task->delete();
    }
}
