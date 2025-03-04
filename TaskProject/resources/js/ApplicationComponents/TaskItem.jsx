import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function TaskItem({ task, categoryName, onEdit }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Status'e göre class belirleme
    const getStatusClass = () => {
        if (task.status === 0) return "bg-yellow-100"; // Pending
        if (task.status === 1) return "bg-blue-100"; // Ongoing
        return "bg-green-100"; // Completed
    };

    // Görev durumunu değiştir
    const toggleTaskStatus = () => {
        const newStatus = task.status === 2 ? 0 : task.status + 1;
        Inertia.put(`/tasks/${task.id}/toggle-status`, { status: newStatus }, {
            preserveScroll: true,
            onError: (errors) => console.error("Task status update failed:", errors),
        });
    };

    // Silme işlemi için modal aç/kapat
    const confirmDelete = () => setShowDeleteModal(true);
    const deleteTask = () => {
        setShowDeleteModal(false);
        Inertia.delete(`/tasks/${task.id}`, {
            onSuccess: () => console.log("Task deleted successfully!"),
        });
    };

    return (
        <div className={`p-5 rounded-lg shadow-md transition duration-300 ${getStatusClass()} hover:shadow-lg border border-gray-200`}>
            {/* 📌 Kategori Adı */}
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">
                {categoryName}
            </p>

            {/* 📌 Görev Başlık ve Açıklama */}
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <p className="text-gray-600 mt-1 text-sm">{task.description || "No description provided."}</p>

            {/* 📌 İşlemler */}
            <div className="flex justify-between mt-4">
                <button 
                    onClick={toggleTaskStatus} 
                    className={`px-4 py-2 text-sm font-semibold rounded-md shadow transition duration-200 ${
                        task.status === 2 ? "bg-green-500 hover:bg-green-600 text-white" : 
                        task.status === 1 ? "bg-blue-500 hover:bg-blue-600 text-white" :
                        "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                >
                    {task.status === 2 ? "✅ Completed" : task.status === 1 ? "🔄 Ongoing" : "⏳ Pending"}
                </button>
                
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
