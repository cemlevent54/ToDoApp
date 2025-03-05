import { Inertia } from "@inertiajs/inertia";
import useDarkMode from "@/Theme/useDarkMode"; // ✅ Dark Mode Hook eklendi

export default function TaskDeleteForm({ isOpen, onClose, taskId, isArchived }) {
    if (!isOpen) return null;

    const [theme] = useDarkMode(); // ✅ Dark mode state

    const handleDelete = () => {
        onClose();
        Inertia.delete(`/tasks/${taskId}`, {
            onSuccess: () => console.log("Task deleted successfully!"),
            onError: (error) => console.error("Error deleting task:", error),
        });
    };

    const handleArchive = () => {
        onClose();
        Inertia.put(`/tasks/${taskId}/toggle-archive`, { archive: !isArchived }, {
            onSuccess: () => console.log(`Task ${isArchived ? "restored" : "archived"} successfully!`),
            onError: (error) => console.error("Error archiving task:", error),
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
            <div className="w-[350px] rounded-lg shadow-lg p-4 transition-all bg-white dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
                    {isArchived ? "Restore Task?" : "Are you sure?"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 text-center">
                    {isArchived 
                        ? "This will restore the task from the archive."
                        : "This action cannot be undone."}
                </p>

                <div className="flex justify-center gap-2 mt-4">
                    <button 
                        onClick={onClose} 
                        className="px-3 py-1 text-sm font-medium bg-gray-400 dark:bg-gray-600 text-white rounded shadow hover:bg-gray-500 dark:hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>

                    {isArchived === false && (
                        <button 
                            onClick={handleArchive} 
                            className="px-3 py-1 text-sm font-medium bg-yellow-500 dark:bg-yellow-600 text-white rounded shadow hover:bg-yellow-600 dark:hover:bg-yellow-700 transition"
                        >
                            Archive
                        </button>
                    )}

                    <button 
                        onClick={handleDelete} 
                        className="px-3 py-1 text-sm font-medium bg-red-500 dark:bg-red-600 text-white rounded shadow hover:bg-red-600 dark:hover:bg-red-700 transition"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
