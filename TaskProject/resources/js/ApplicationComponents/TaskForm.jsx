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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">
                    {task ? "Edit Task" : "New Task"}
                </h2>

                {/* Eğer görev tamamlandıysa düzenlemeye kapalı hale getir */}
                {isCompleted ? (
                    <div>
                        <p className="text-gray-700"><strong>Title:</strong> {title}</p>
                        <p className="text-gray-700"><strong>Description:</strong> {description || "No description provided."}</p>
                        <p className="text-gray-700"><strong>Category:</strong> {categories.find(cat => cat.id === category)?.name || "Uncategorized"}</p>
                        <button onClick={onClose} className="px-4 py-2 mt-4 bg-gray-400 text-white rounded-md w-full">
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md mb-2"
                            required
                        />

                        <textarea
                            placeholder="Task Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded-md mb-2"
                        ></textarea>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border rounded-md mb-2"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                {task ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* 📌 Toast Mesajı */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg">
                    {task ? "Task Updated!" : "Task Created!"}
                </div>
            )}
        </div>
    ) : null;
}
