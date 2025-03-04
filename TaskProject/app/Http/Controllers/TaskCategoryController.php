<?php

namespace App\Http\Controllers;

use App\Services\TaskCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\TaskCategory;

class TaskCategoryController extends Controller
{
    protected $taskCategoryService;

    public function __construct(TaskCategoryService $taskCategoryService) {
        $this->taskCategoryService = $taskCategoryService;
    }

    public function index() {
        return Inertia::render('Dashboard', [
            'categories' => $this->taskCategoryService->getUserCategories(),
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $this->taskCategoryService->createCategory($request->all());

        return redirect()->route('dashboard')->with('success', 'Category created successfully!');
    }

    public function update(Request $request, TaskCategory $category) {
        if ($category->user_id != Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $this->taskCategoryService->updateCategory($category, $request->all());

        return redirect()->route('dashboard')->with('success', 'Category updated successfully!');
    }

    public function destroy(TaskCategory $category) {
        if ($category->user_id != Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $this->taskCategoryService->deleteCategory($category);

        return redirect()->route('dashboard')->with('success', 'Category deleted successfully!');
    }


}
