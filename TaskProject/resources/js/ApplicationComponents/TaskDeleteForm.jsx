import { Inertia } from "@inertiajs/inertia";

export default function TaskDeleteForm({ isOpen, onClose, taskId, isArchived }) {
    if (!isOpen) return null;

    // 📌 Görevi Silme İşlemi
    const handleDelete = () => {
        onClose();
        Inertia.delete(`/tasks/${taskId}`, {
            onSuccess: () => console.log("Task deleted successfully!"),
            onError: (error) => console.error("Error deleting task:", error),
        });
    };

    // 📌 Görevi Arşivleme İşlemi
    const handleArchive = () => {
        onClose();
        Inertia.put(`/tasks/${taskId}/toggle-archive`, { archive: !isArchived }, {
            onSuccess: () => console.log(`Task ${isArchived ? "restored" : "archived"} successfully!`),
            onError: (error) => console.error("Error archiving task:", error),
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
            <div className="bg-white w-[350px] rounded-lg shadow-lg p-4 transition-all">
                <h2 className="text-lg font-semibold text-gray-800 text-center">
                    {isArchived ? "Restore Task?" : "Are you sure?"}
                </h2>
                <p className="text-gray-600 text-xs mt-2 text-center">
                    {isArchived 
                        ? "This will restore the task from the archive."
                        : "This action cannot be undone."}
                </p>

                <div className="flex justify-center gap-2 mt-4">
                    {/* ❌ İptal Butonu */}
                    <button 
                        onClick={onClose} 
                        className="px-3 py-1 text-sm font-medium bg-gray-400 text-white rounded shadow hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>

                    {/* 📂 Arşivleme Butonu SADECE Arşivlenmemiş Görevler İçin */}
                    {isArchived === false && (
                        <button 
                            onClick={handleArchive} 
                            className="px-3 py-1 text-sm font-medium bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 transition"
                        >
                            Archive
                        </button>
                    )}

                    {/* 🗑️ Silme Butonu */}
                    <button 
                        onClick={handleDelete} 
                        className="px-3 py-1 text-sm font-medium bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
