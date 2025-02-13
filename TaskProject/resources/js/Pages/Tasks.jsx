import { useState } from "react";
import TaskItem from "@/ApplicationComponents/TaskItem";
import TaskForm from "@/ApplicationComponents/TaskForm";

export default function Tasks({ tasks = [], categories = [] }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // ✅ Görevleri tamamlanma durumuna göre ayır
    const pendingTasks = tasks.filter((task) => !task.is_completed);
    const completedTasks = tasks.filter((task) => task.is_completed);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 📝 Yapılacak Görevler */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Pending Tasks</h3>
                    {pendingTasks.length > 0 ? (
                        <div className="space-y-4">
                            {pendingTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    categoryName={categories.find((c) => c.id === task.category_id)?.name || "Uncategorized"}
                                    onEdit={(task) => {
                                        setSelectedTask(task);
                                        setModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No pending tasks.</p>
                    )}
                </div>

                {/* ✅ Tamamlanmış Görevler */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Completed Tasks</h3>
                    {completedTasks.length > 0 ? (
                        <div className="space-y-4">
                            {completedTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    categoryName={categories.find((c) => c.id === task.category_id)?.name || "Uncategorized"}
                                    onEdit={(task) => {
                                        setSelectedTask(task);
                                        setModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No completed tasks.</p>
                    )}
                </div>
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
