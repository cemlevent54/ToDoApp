<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Services\TaskService;
use App\Services\TaskReorderService;
use App\Services\TaskArchiveService;
use App\Services\CalendarService;

class TaskController extends Controller
{
    protected $taskService;
    protected $taskReorderService;
    protected $taskArchiveService;
    protected $calendarService;

    public function __construct(
        TaskService $taskService,
        TaskReorderService $taskReorderService,
        TaskArchiveService $taskArchiveService,
        CalendarService $calendarService
    ) {
        $this->taskService = $taskService;
        $this->taskReorderService = $taskReorderService;
        $this->taskArchiveService = $taskArchiveService;
        $this->calendarService = $calendarService;
    }

    public function index()
    {
        return Inertia::render('Dashboard', [
            'tasks' => $this->taskService->getTasks(),
            'categories' => $this->taskService->getAllCategories(),
            'user' => Auth::user()
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $this->validateTask($request);
        $task = $this->taskService->createTask($validatedData);

        // ✅ Google Sync Açıksa Görevi Google Calendar'a da Ekle
        if ($this->isGoogleSyncEnabled()) {
            $this->calendarService->addTaskToCalendar($task);
        }

        return redirect()->back()->with('success', 'Task created successfully!');
    }

    public function update(Request $request, Task $task)
    {
        if (!$this->isAuthorized($task)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $this->validateTask($request);
        $updatedTask = $this->taskService->updateTask($task, $validatedData);

        // ✅ Google Sync Açıksa Görevi Google Calendar'da da Güncelle
        if ($this->isGoogleSyncEnabled()) {
            $this->calendarService->updateTaskInCalendar($updatedTask);
        }

        return redirect()->route('dashboard')->with('success', 'Task updated successfully!');
    }

    public function destroy(Task $task)
    {
        if (!$this->isAuthorized($task)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // ✅ Google Sync Açıksa Görevi Google Calendar'dan da Sil
        if ($this->isGoogleSyncEnabled()) {
            $this->calendarService->deleteTaskFromCalendar($task);
        }

        $this->taskService->deleteTask($task);

        return redirect()->route('dashboard')->with('success', 'Task deleted successfully!');
    }

    public function archiveTask(Request $request, Task $task)
    {
        if (!$this->isAuthorized($task)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'archive' => 'required|boolean'
        ]);

        $updatedTask = $this->taskArchiveService->archiveTask($task, $validatedData['archive']);

        // ✅ Google Sync Açıksa Görevi Google Calendar'da da Güncelle
        if ($this->isGoogleSyncEnabled()) {
            $this->calendarService->updateTaskInCalendar($updatedTask);
        }

        return redirect()->route('dashboard')->with('success', 'Task archived successfully!');
    }

    public function syncGoogleTasks()
    {
        if (!$this->isGoogleSyncEnabled()) {
            return response()->json(['error' => 'Google Sync is disabled.'], 403);
        }

        $this->calendarService->syncTasksFromGoogleCalendar();

        return redirect()->route('dashboard')->with('success', 'Google Calendar sync completed.');
    }

    private function isGoogleSyncEnabled()
    {
        return Auth::check() && Auth::user()->google_sync;
    }

    private function validateTask(Request $request)
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:task_categories,id',
            'status' => 'required|integer|min:0|max:2',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);
    }

    private function isAuthorized(Task $task)
    {
        return $task->user_id === Auth::id();
    }
}
