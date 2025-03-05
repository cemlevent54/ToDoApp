<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TaskCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
class TaskService {

    public function getTasks(): Collection {
        return Task::where('user_id', Auth::id())
                    ->with('category')
                    ->get();
    }

    public function getTasksByStatus(int $status): Collection {
        return Task::where('user_id', Auth::id())
                    ->where('status', $status)
                    ->with('category')
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
            'category_id' => $data['category_id'] ?? null
        ]);
    }

    public function updateTask(Task $task, array $data): Task {
        if (isset($data['category_id']) && !TaskCategory::where('id', $data['category_id'])->where('user_id', Auth::id())->exists()) {
            throw new \Exception("Unauthorized category selection.");
        }

        $task->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'] ?? null
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

    public function reorderTasks(array $tasks): void {
        foreach ($tasks as $index => $task) {
            Task::where('id', $task['id'])->update(['order' => $index]);
        }
    }

    public function archiveTask(Task $task, bool $archive): Task {
        $task->update(['is_archived' => $archive]);
        return $task;
    }
}