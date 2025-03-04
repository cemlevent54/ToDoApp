<?php

namespace App\Services;

use App\Models\TaskCategory;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;

class TaskCategoryService {

    public function getUserCategories(): Collection {
        return TaskCategory::where ("user_id", Auth::user()->id)->get();
    }

    public function createCategory(array $data): TaskCategory {
        return TaskCategory::create([
            'name' => $data['name'],
            'user_id' => Auth::id(),
        ]);
    }

    public function updateCategory(TaskCategory $category, array $data): TaskCategory {
        $category->update([
            'name'=> $data['name'],
        ]);

        return $category;
    }

    public function deleteCategory(TaskCategory $category): void
    {
        $category->delete();
    }

}