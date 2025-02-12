<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $tasks = Task::where('user_id', Auth::id())->get();
        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    public function createNewTask(Request $request) {
        $request->validate([
            'title' => 'required',
            'description' => 'required'
        ]);

        Task::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => false
        ]);

        return redirect()->back();
    }

    public function updateTask(Request $request, Task $task) {
        $this->authorize('update', $task);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean'
        ]);

        $task->update($request->only(['title', 'description', 'is_completed']));
        return redirect()->back();

    }

    public function deleteTask(Task $task) {
        $this->authorize('delete', $task);
        $task->delete();
        return redirect()->back();
    }
}
