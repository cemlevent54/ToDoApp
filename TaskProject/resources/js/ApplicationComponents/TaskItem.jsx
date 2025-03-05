import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import TaskDeleteForm from "@/ApplicationComponents/TaskDeleteForm"; // 📌 Silme Modalı

export default function TaskItem({ task, categoryName, onEdit }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 📌 Status'e göre class belirleme
    const getStatusClass = () => {
        if (task.status === 0) return "bg-yellow-100"; // Pending
        if (task.status === 1) return "bg-blue-100"; // Ongoing
        return "bg-green-100"; // Completed
    };

    // 📌 Görev durumunu değiştir
    const toggleTaskStatus = () => {
        const newStatus = task.status === 2 ? 0 : task.status + 1;
        Inertia.put(`/tasks/${task.id}/toggle-status`, { status: newStatus }, {
            preserveScroll: true,
            onError: (errors) => console.error("Task status update failed:", errors),
        });
    };

    // 📌 Görevi Arşivleme / Geri Yükleme
    const toggleArchiveStatus = () => {
        Inertia.put(route('tasks.archive', { task: task.id }), { archive: !task.is_archived }, {
            preserveScroll: true,
            onError: (errors) => console.error("Task archive update failed:", errors),
        });
    };

    return (
        <>
            <div className={`p-4 rounded-lg shadow-md transition duration-300 ${getStatusClass()} hover:shadow-lg border border-gray-200`}>
                {/* 📌 Kategori Adı */}
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 mb-1">
                    {categoryName}
                </p>

                {/* 📌 Görev Başlık ve Açıklama */}
                <h3 className="text-md font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-1 text-xs">{task.description || "No description provided."}</p>

                {/* 📌 İşlemler */}
                <div className="flex justify-between mt-3">
                    {!task.is_archived ? (
                        <>
                            {/* 🔄 Durum Değiştirme Butonu */}
                            <button 
                                onClick={toggleTaskStatus} 
                                className={`px-3 py-1 text-xs font-semibold rounded shadow transition duration-200 ${
                                    task.status === 2 ? "bg-green-500 hover:bg-green-600 text-white" : 
                                    task.status === 1 ? "bg-blue-500 hover:bg-blue-600 text-white" :
                                    "bg-yellow-500 hover:bg-yellow-600 text-white"
                                }`}
                            >
                                {task.status === 2 ? "✅" : task.status === 1 ? "🔄" : "⏳"}
                            </button>

                            {/* ✏️ Düzenleme Butonu */}
                            <button 
                                onClick={() => onEdit(task)} 
                                className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-200"
                            >
                                ✏️
                            </button>

                            {/* 📂 Arşive Al Butonu */}
                            <button 
                                onClick={toggleArchiveStatus} 
                                className="px-3 py-1 text-xs font-semibold bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition duration-200"
                            >
                                📂
                            </button>

                            {/* 🗑️ Silme Butonu */}
                            <button 
                                onClick={() => setShowDeleteModal(true)} 
                                className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-200"
                            >
                                🗑️
                            </button>
                        </>
                    ) : (
                        <>
                            {/* 🔄 Restore Butonu */}
                            <button 
                                onClick={toggleArchiveStatus} 
                                className="px-3 py-1 text-xs font-semibold bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition duration-200"
                            >
                                ♻️
                            </button>

                            {/* 🗑️ Silme Butonu */}
                            <button 
                                onClick={() => setShowDeleteModal(true)} 
                                className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-200"
                            >
                                🗑️
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 📌 Task Delete Modal */}
            <TaskDeleteForm 
                isOpen={showDeleteModal} 
                onClose={() => setShowDeleteModal(false)} 
                taskId={task.id} 
            />
        </>
    );
}
