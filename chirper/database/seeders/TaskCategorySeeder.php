<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TaskCategory;


class TaskCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Work', 'Personal', 'Other'];

        foreach ($categories as $category) {
            TaskCategory::create(['name' => $category]);
        }
    }
}
