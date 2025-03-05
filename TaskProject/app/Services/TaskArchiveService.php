<?php

namespace App\Services;

use App\Models\Task;

class TaskArchiveService {

    public function archiveTask(Task $task, bool $archive): Task {
        $task->update(['is_archived' => $archive]);
        return $task;
    }
}
