<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class TaskCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'user_id'];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'category_id');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    protected static function booted() {
        static::addGlobalScope('user', function ($query) {
            if (Auth::check()) {
                $query->where('user_id', Auth::id());
            }
        });
    }
}
