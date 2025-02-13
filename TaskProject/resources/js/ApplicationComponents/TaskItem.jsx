import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function TaskItem({ task, categoryName, onEdit }) {
    const [isCompleted, setIsCompleted] = useState(task.is_completed);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    if (!task || !task.id) {
        return null;
    }

    // ✅ Görevi Tamamlama (is_completed güncelleniyor)
    const toggleComplete = (event) => {
        event.preventDefault();
        Inertia.put(`/tasks/${task.id}/complete`, {}, {
            onSuccess: () => {
                setIsCompleted(!isCompleted);
                showToast(isCompleted ? "Task marked as incomplete." : "Task marked as complete.");
            },
        });
    };

    // ✅ Görevi Silme (Onay Modallı)
    const confirmDelete = () => {
        setShowDeleteModal(true);
    };

    const deleteTask = () => {
        setShowDeleteModal(false);
        Inertia.delete(`/tasks/${task.id}`, {
            onSuccess: () => {
                showToast("Task Deleted!");
            },
        });
    };

    // ✅ Toast Mesajını Gösterme Fonksiyonu
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage("");
        }, 2000);
    };

    return (
        <div className={`p-4 border rounded-lg shadow-md ${
            isCompleted ? "bg-green-100 text-gray-500" : "bg-white"
        }`}>
            {/* 📌 Kategori Bilgisi */}
            <p className="text-sm font-medium text-blue-500">Category: {categoryName}</p>

            {/* 📌 Başlık */}
            <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
            
            {/* 📌 Açıklama */}
            <p className="text-gray-600 mt-2">{task.description || "No description provided."}</p>

            {/* 📌 Butonlar */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => onEdit(task)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Edit
                </button>
                <button
                    onClick={toggleComplete}
                    className={`px-3 py-1 rounded-md ${
                        isCompleted ? "bg-gray-400" : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                    {isCompleted ? "Undo" : "Complete"}
                </button>
                <button
                    onClick={confirmDelete}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Delete
                </button>
            </div>

            {/* 📌 Silme Onay Modali */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <p className="mb-4">Are you sure you want to delete this task?</p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md">
                                No
                            </button>
                            <button onClick={deleteTask} className="px-4 py-2 bg-red-500 text-white rounded-md">
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 📌 Toast Mesajı */}
            {toastMessage && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
