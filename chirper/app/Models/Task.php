<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TaskCategory;
use App\Models\User;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'description', 'is_completed', 'task_category_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function taskCategory() { // 🔥 BU KISMI EKLE, ÇALIŞMIYORSA BÜYÜK HARF-KÜÇÜK HARF KONTROL ET!
        return $this->belongsTo(TaskCategory::class, 'task_category_id');
    }
}
