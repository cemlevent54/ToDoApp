<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\TaskCategory;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index() {
        return Inertia::render('Dashboard', [
            'tasks' => Task::where('user_id', Auth::id())->with('category')->get(),
            'categories' => TaskCategory::all()
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:task_categories,id'
        ]);

        Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => false,
            'user_id' => Auth::id(),
            'category_id' => $request->category_id
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:task_categories,id'
        ]);

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id
        ]);

        return redirect()->route('dashboard')->with('success', 'Task updated successfully!');
    }

    public function complete(Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        $task->update([
            'is_completed' => !$task->is_completed
        ]);
    
        return redirect()->route('dashboard')->with('success', 'Task status updated successfully!');
    }

    public function toggleComplete(Request $request, Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        $task->update([
            'is_completed' => $request->is_completed
        ]);
    
        return redirect()->route('dashboard')->with('success', 'Task status updated successfully!');
    }
    
    

    public function destroy(Task $task) {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $task->delete();

        return redirect()->route('dashboard')->with('success', 'Task deleted successfully!');
    }

    public function reorder(Request $request) {
        foreach ($request->tasks as $index => $task) {
            Task::where('id', $task['id'])->update(['order' => $index]);
        }
        return response()->json(['message' => 'Tasks reordered successfully'], 200);
    }
}
