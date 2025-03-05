import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";

export default function TaskForm({ isOpen, onClose, task }) {
    const { categories = [] } = usePage().props;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState(0);
    const [startDate, setStartDate] = useState("");  
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");  // 🕒 Başlangıç Saati
    const [endTime, setEndTime] = useState("");  // 🕒 Bitiş Saati
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title ?? "");
            setDescription(task.description ?? "");
            setCategory(task.category_id ?? categories?.[0]?.id ?? "");
            setStatus(task.status ?? 0);

            // 📅 Tarihleri formatla
            setStartDate(task.start_date ? task.start_date.split(" ")[0] : "");
            setEndDate(task.end_date ? task.end_date.split(" ")[0] : "");

            // 🕒 Saatleri formatla (Eğer saat bilgisi varsa)
            setStartTime(task.start_date ? task.start_date.split(" ")[1]?.slice(0, 5) : "");
            setEndTime(task.end_date ? task.end_date.split(" ")[1]?.slice(0, 5) : "");
        } else {
            setTitle("");
            setDescription("");
            setCategory(categories?.[0]?.id ?? "");
            setStatus(0);
            setStartDate("");
            setEndDate("");
            setStartTime("");
            setEndTime("");
        }
    }, [task, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedStartDate = startDate && startTime ? `${startDate} ${startTime}:00` : null;
        const formattedEndDate = endDate && endTime ? `${endDate} ${endTime}:00` : null;

        const data = { 
            title, 
            description, 
            category_id: category, 
            status,
            start_date: formattedStartDate, // 📅🕒 Tarih + Saat
            end_date: formattedEndDate // 📅🕒 Tarih + Saat
        };

        if (task) {
            Inertia.put(`/tasks/${task.id}`, data, {
                onSuccess: () => showSuccessMessage(),
            });
        } else {
            Inertia.post("/tasks", data, {
                onSuccess: () => showSuccessMessage(),
            });
        }
    };

    const showSuccessMessage = () => {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            onClose();
            Inertia.visit("/dashboard");
        }, 2000);
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 transition-all">
                <h2 className="text-xl font-semibold text-gray-800">
                    {task ? "Edit Task" : "New Task"}
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <textarea
                        placeholder="Take a note..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    ></textarea>

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

                    {/* 📅 Tarih & Saat Seçimi */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-gray-700 font-medium">Start Date & Time</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-1/2 p-3 text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-1/2 p-3 text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <label className="text-gray-700 font-medium">End Date & Time</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-1/2 p-3 text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-1/2 p-3 text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

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
            </div>

            {showToast && (
                <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg animate-bounce">
                    {task ? "Task Updated!" : "Task Created!"}
                </div>
            )}
        </div>
    ) : null;
}
