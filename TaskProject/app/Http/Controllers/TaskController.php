<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\TaskCategory;
use Illuminate\Support\Facades\Auth;
use App\Services\TaskService;
use Illuminate\Database\Eloquent\Collection;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService) {
        $this->taskService = $taskService;
    }

    /**
     * Kullanıcının tüm görevlerini ve kategorilerini getir.
     */
    public function index() {
        return Inertia::render('Dashboard', [
            'tasks' => $this->taskService->getTasks(),
            'categories' => $this->taskService->getAllCategories()
        ]);
    }

    /**
     * Yeni bir görev oluştur.
     */
    public function store(Request $request) {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:task_categories,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        

        $task = $this->taskService->createTask($validatedData);

        return redirect()->back();
    }

    /**
     * Belirli bir görevi güncelle.
     */
    public function update(Request $request, Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:task_categories,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        

        $updatedTask = $this->taskService->updateTask($task, $validatedData);

        return redirect()->route('dashboard')->with('success', 'Task updated successfully!');
    }

    /**
     * Görev durumunu (status) güncelle.
     */
    public function toggleStatus(Request $request, Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        $validatedData = $request->validate([
            'status' => 'required|integer|in:0,1,2'
        ]);
    
        $updatedTask = $this->taskService->toggleStatus($task, $validatedData['status']);
    
        return redirect()->route('dashboard')->with('success', 'Task status updated successfully!');
    }

    /**
     * Görevi veritabanından kaldır.
     */
    public function destroy(Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $this->taskService->deleteTask($task);

        return redirect()->route('dashboard')->with('success', 'Task deleted successfully!');
    }

    /**
     * Görevlerin sırasını güncelle.
     */
    public function reorder(Request $request) {
        $this->taskService->reorderTasks($request->tasks);
        
        return redirect()->route('dashboard')->with('success', 'Tasks reordered successfully!');
    }

    public function archiveTask(Request $request, Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'archive' => 'required|boolean'
        ]);

        $updatedTask = $this->taskService->archiveTask($task, $validatedData['archive']);

        return redirect()->route('dashboard')->with('success', 'Task archived successfully!');
        // bu kısımda kaldık. archive için hem frontende hem backend'e eklenecek özellikler var. toggle
    }
}
