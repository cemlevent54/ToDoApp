import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function TaskItem({ task, onEdit }) {
    const [isCompleted, setIsCompleted] = useState(task.is_completed);

    // ✅ Görevi Tamamlandı Olarak İşaretleme
    const toggleComplete = () => {
        Inertia.put(`/tasks/${task.id}`, { is_completed: !isCompleted }, {
            onSuccess: () => setIsCompleted(!isCompleted),
        });
    };

    // ❌ Görevi Silme
    const deleteTask = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            Inertia.delete(`/tasks/${task.id}`);
        }
    };

    return (
        <div className={`p-4 border rounded-md shadow-md ${isCompleted ? "bg-green-200" : "bg-white"}`}>
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <button
                    onClick={toggleComplete}
                    className={`px-2 py-1 text-sm rounded-md ${isCompleted ? "bg-gray-400" : "bg-green-500 text-white"}`}
                >
                    {isCompleted ? "Undo" : "Complete"}
                </button>
            </div>
            <p className="text-gray-600 mt-2">{task.description}</p>

            {/* 📌 Düzenle & Sil Butonları */}
            <div className="flex justify-between mt-4">
                <button onClick={onEdit} className="px-3 py-1 bg-blue-500 text-white rounded-md">Edit</button>
                <button onClick={deleteTask} className="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
            </div>
        </div>
    );
}
