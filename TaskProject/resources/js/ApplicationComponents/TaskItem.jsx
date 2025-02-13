import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function TaskItem({ task, categoryName, onEdit }) {
    const [isCompleted, setIsCompleted] = useState(task.is_completed);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ✅ Görevi Silme (Onay Modallı)
    const confirmDelete = () => {
        setShowDeleteModal(true);
    };

    const deleteTask = () => {
        setShowDeleteModal(false);
        Inertia.delete(`/tasks/${task.id}`, {
            onSuccess: () => {
                console.log("Task deleted successfully!");
            },
        });
    };

    return (
        <div className={`p-5 rounded-lg shadow-md transition duration-300 ${isCompleted ? "bg-green-100" : "bg-white"} hover:shadow-lg border border-gray-200`}>
            {/* 📌 Kategori */}
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">
                {categoryName}
            </p>

            {/* 📝 Başlık ve Açıklama */}
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <p className="text-gray-600 mt-1 text-sm">{task.description || "No description provided."}</p>

            {/* 🎛️ Butonlar */}
            <div className="flex justify-between mt-4">
                <button 
                    onClick={() => onEdit(task)} 
                    className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-200"
                >
                    ✏️ Edit
                </button>
                <button 
                    onClick={confirmDelete} 
                    className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition duration-200"
                >
                    🗑️ Delete
                </button>
            </div>

            {/* 📌 Silme Onay Modali */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-800">Are you sure?</h2>
                        <p className="text-gray-600 text-sm mt-2">This action cannot be undone.</p>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button 
                                onClick={() => setShowDeleteModal(false)} 
                                className="px-4 py-2 text-sm font-semibold bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={deleteTask} 
                                className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition duration-200"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
