import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function TaskForm({ isOpen, onClose, task }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Work");

    // 📌 Eğer düzenleme modundaysak mevcut görev verisini yükle
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setCategory(task.category || "Work");
        }
    }, [task]);

    // ✅ Form Gönderme (Ekleme/Güncelleme)
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const data = { title, description, category };
        console.log(data);

        if (task) {
            Inertia.put(`/tasks/${task.id}`, data, { onSuccess: () => onClose() });
        } else {
            Inertia.post("/tasks", data, { onSuccess: () => onClose() });
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">
                    {task ? "Edit Task" : "New Task"}
                </h2>

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
                        required
                    ></textarea>

                    {/* 📌 Kategori Seçimi */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2"
                    >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Other">Other</option>
                    </select>

                    <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            {task ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
}
