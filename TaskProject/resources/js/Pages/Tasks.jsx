import { useState, useEffect } from "react";
import TaskItem from "@/ApplicationComponents/TaskItem";
import TaskForm from "@/ApplicationComponents/TaskForm";
import { Inertia } from "@inertiajs/inertia";

export default function Tasks({ tasks = [], categories = [] }) {
    const [taskList, setTaskList] = useState(tasks);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setTaskList(tasks);
    }, [tasks]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {taskList.length > 0 ? (
                    taskList.map((task) =>
                        task && task.id ? (
                            <TaskItem
                                key={task.id}
                                task={task}
                                categoryName={categories.find((c) => c.id === task.category_id)?.name || "Uncategorized"}
                                onEdit={(task) => {
                                    setSelectedTask(task);
                                    setModalOpen(true);
                                }}
                            />
                        ) : null
                    )
                ) : (
                    <p className="text-gray-500">No tasks found.</p>
                )}
            </div>

            {/* 📌 Edit Modal */}
            {modalOpen && (
                <TaskForm
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={selectedTask}
                />
            )}
        </>
    );
}
