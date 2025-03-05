import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import TaskDeleteForm from "@/ApplicationComponents/TaskDeleteForm";
import useDarkMode from "@/Theme/useDarkMode"; // ✅ Dark mode için hook eklendi

export default function TaskItem({ task, categoryName, onEdit }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [theme] = useDarkMode(); // ✅ Dark mode state

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    const formatDate = (dateTime) => dateTime ? dateTime.split(" ")[0] : "N/A";
    const formatTime = (dateTime) => dateTime && dateTime.includes(" ") ? dateTime.split(" ")[1].slice(0, 5) : "N/A";

    const getStatusClass = () => {
        if (task.status === 2) return "bg-green-100 dark:bg-green-700"; 

        if (
            (task.status === 0 || task.status === 1) && 
            task.end_date &&
            (
                task.end_date.split(" ")[0] < today || 
                (task.end_date.split(" ")[0] === today && task.end_date.split(" ")[1]?.slice(0, 5) < currentTime)
            )
        ) {
            return "bg-red-200 dark:bg-red-700"; 
        }

        if (task.status === 0) return "bg-yellow-100 dark:bg-yellow-700";
        if (task.status === 1) return "bg-blue-100 dark:bg-blue-700";
        
        return "bg-gray-100 dark:bg-gray-800"; 
    };

    const toggleTaskStatus = () => {
        const newStatus = task.status === 2 ? 0 : task.status + 1;
        Inertia.put(`/tasks/${task.id}/toggle-status`, { status: newStatus }, {
            preserveScroll: true,
            onError: (errors) => console.error("Task status update failed:", errors),
        });
    };

    const toggleArchiveStatus = () => {
        Inertia.put(route('tasks.archive', { task: task.id }), { archive: !task.is_archived }, {
            preserveScroll: true,
            onError: (errors) => console.error("Task archive update failed:", errors),
        });
    };

    return (
        <>
            <div className={`p-4 rounded-lg shadow-md transition duration-300 ${getStatusClass()} hover:shadow-lg border border-gray-200 dark:border-gray-600`}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300 mb-1">
                    {categoryName}
                </p>

                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">{task.title}</h3> 
                
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">{task.description || "No description provided."}</p>

                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    <strong>Start:</strong> {formatDate(task.start_date)} - {formatTime(task.start_date)} <br />
                    <strong>End:</strong> {formatDate(task.end_date)} - {formatTime(task.end_date)}
                </p>

                <div className="flex justify-between mt-3">
                    {!task.is_archived ? (
                        <>
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

                            <button 
                                onClick={() => onEdit(task)} 
                                className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-200"
                            >
                                ✏️
                            </button>

                            <button 
                                onClick={toggleArchiveStatus} 
                                className="px-3 py-1 text-xs font-semibold bg-gray-500 dark:bg-gray-700 text-white rounded shadow hover:bg-gray-600 dark:hover:bg-gray-500 transition duration-200"
                            >
                                📂
                            </button>

                            <button 
                                onClick={() => setShowDeleteModal(true)} 
                                className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-200"
                            >
                                🗑️
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={toggleArchiveStatus} 
                                className="px-3 py-1 text-xs font-semibold bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition duration-200"
                            >
                                ♻️
                            </button>

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

            <TaskDeleteForm 
                isOpen={showDeleteModal} 
                onClose={() => setShowDeleteModal(false)} 
                taskId={task.id} 
            />
        </>
    );
}
