import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";

export default function TaskForm({ isOpen, onClose, task }) {
    const { categories = [] } = usePage().props;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title ?? "");
            setDescription(task.description ?? "");
            setCategory(task.category_id ?? categories?.[0]?.id ?? "");
            setIsCompleted(task.is_completed);
        } else {
            setTitle("");
            setDescription("");
            setCategory(categories?.[0]?.id ?? "");
            setIsCompleted(false);
        }
    }, [task, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { title, description, category_id: category };

        if (task) {
            Inertia.put(`/tasks/${task.id}`, data, {
                onSuccess: () => {
                    setShowToast(true);
                    setTimeout(() => {
                        setShowToast(false);
                        onClose();
                        Inertia.visit("/dashboard");
                    }, 2000);
                }
            });
        } else {
            Inertia.post("/tasks", data, {
                onSuccess: () => {
                    setShowToast(true);
                    setTimeout(() => {
                        setShowToast(false);
                        onClose();
                        Inertia.visit("/dashboard");
                    }, 2000);
                }
            });
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 transition-all">
                <h2 className="text-xl font-semibold text-gray-800">
                    {task ? "Edit Task" : "New Task"}
                </h2>

                {/* Eğer görev tamamlandıysa, salt okunur göster */}
                {isCompleted ? (
                    <div className="mt-4">
                        <p className="text-gray-700 text-lg"><strong>Title:</strong> {title}</p>
                        <p className="text-gray-700 text-lg"><strong>Description:</strong> {description || "No description provided."}</p>
                        <p className="text-gray-700 text-lg"><strong>Category:</strong> {categories.find(cat => cat.id === category)?.name || "Uncategorized"}</p>
                        <button 
                            onClick={onClose} 
                            className="mt-4 w-full px-4 py-2 bg-gray-400 text-white font-medium rounded-md shadow hover:bg-gray-500 transition"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        {/* 📝 Başlık */}
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />

                        {/* ✍️ Açıklama */}
                        <textarea
                            placeholder="Take a note..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        ></textarea>

                        {/* 🏷️ Kategori Seçimi */}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* 📌 Butonlar */}
                        <div className="flex justify-end gap-2">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-4 py-2 text-md font-medium bg-gray-400 text-white rounded-md shadow hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="px-4 py-2 text-md font-medium bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                            >
                                {task ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* 📌 Toast Mesajı */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg animate-bounce">
                    {task ? "Task Updated!" : "Task Created!"}
                </div>
            )}
        </div>
    ) : null;
}
