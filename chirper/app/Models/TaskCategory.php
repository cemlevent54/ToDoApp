<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Task;


class TaskCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function tasks() {
        return $this->hasMany(Task::class, 'task_category_id'); // Bir kategoriye bağlı birden fazla görev olabilir
    }
}
