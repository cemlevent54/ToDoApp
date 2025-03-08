<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Services\TaskService;
use App\Services\TaskReorderService;
use App\Services\TaskArchiveService;

class TaskController extends Controller
{
    protected $taskService;
    protected $taskReorderService;
    protected $taskArchiveService;

    public function __construct(TaskService $taskService, TaskReorderService $taskReorderService, TaskArchiveService $taskArchiveService) {
        $this->taskService = $taskService;
        $this->taskReorderService = $taskReorderService;
        $this->taskArchiveService = $taskArchiveService;
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
        // dd($request->all());
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:task_categories,id',
            'status' => 'required|integer|min:0|max:2',
            'is_archived' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'nullable|integer|min:0', 
        ]);
        
        $validatedData['status'] = intval($validatedData['status']);
        $validatedData['is_archived'] = $request->has('is_archived') ? boolval($request->is_archived) : false;
        // dd($validatedData);
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
            'status' => 'required|integer|min:0|max:2',
            'is_archived' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'nullable|integer|min:0',
        ]);

        $validatedData['status'] = intval($validatedData['status']);
        $validatedData['is_archived'] = $request->has('is_archived') ? boolval($request->is_archived) : false;
        

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
        dd($request->all());
        $validatedData = $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.priority' => 'required|integer|min:0',
            'tasks.*.status' => 'required|integer|in:0,1,2',
        ]);
    
        $this->taskReorderService->reorderTasks($validatedData['tasks']);
    
        return redirect()->route('dashboard')->with('success', 'Task reordered successfully!');
    }

    /**
     * Görevi arşivle / arşivden çıkar.
     */
    public function archiveTask(Request $request, Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'archive' => 'required|boolean'
        ]);

        $updatedTask = $this->taskArchiveService->archiveTask($task, $validatedData['archive']);

        return redirect()->route('dashboard')->with('success', 'Task archived successfully!');
    }
}
