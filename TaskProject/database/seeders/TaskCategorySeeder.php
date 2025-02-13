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
        //
        TaskCategory::insert([
            ['name' => 'Personal'],
            ['name' => 'Work'],
            ['name' => 'Education'],
            ['name' => 'Other'],
        ]);
    }
}
