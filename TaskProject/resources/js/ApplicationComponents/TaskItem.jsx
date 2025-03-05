import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import TaskDeleteForm from "@/ApplicationComponents/TaskDeleteForm"; // 📌 Silme Modalı

export default function TaskItem({ task, categoryName, onEdit }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 📌 Bugünün tarihini ve saatini al
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    // 📅 Tarih ve saat bilgisini ayrıştırma
    const formatDate = (dateTime) => dateTime ? dateTime.split(" ")[0] : "N/A"; // Sadece tarih
    const formatTime = (dateTime) => dateTime && dateTime.includes(" ") ? dateTime.split(" ")[1].slice(0, 5) : "N/A"; // Sadece saat

    // 📌 Status'e ve end_date'e göre class belirleme
    const getStatusClass = () => {
        if (task.status === 2) return "bg-green-100"; // ✅ Completed (Tamamlanan görevler)

        // Eğer görev pending (0) veya ongoing (1) ise ve süresi dolmuşsa -> Kırmızı yap
        if (
            (task.status === 0 || task.status === 1) && 
            task.end_date &&
            (
                task.end_date.split(" ")[0] < today || // Tarih geçmişse
                (task.end_date.split(" ")[0] === today && task.end_date.split(" ")[1]?.slice(0, 5) < currentTime) // Bugünse ve saat geçmişse
            )
        ) {
            return "bg-red-200"; // 🔴 Gecikmiş görevler
        }

        if (task.status === 0) return "bg-yellow-100"; // ⏳ Pending
        if (task.status === 1) return "bg-blue-100"; // 🔄 Ongoing
        
        return "bg-gray-100"; // Varsayılan
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

                {/* 📅 Başlangıç ve Bitiş Tarihleri */}
                <p className="text-gray-500 text-xs mt-1">
                    <strong>Start:</strong> {formatDate(task.start_date)} - {formatTime(task.start_date)} <br />
                    <strong>End:</strong> {formatDate(task.end_date)} - {formatTime(task.end_date)}
                </p>


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
