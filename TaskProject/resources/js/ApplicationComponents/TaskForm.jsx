import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import useDarkMode from "@/Theme/useDarkMode"; 

export default function TaskForm({ isOpen, onClose, task, defaultStatus = 0, isArchived = false }) {
    const { categories = [] } = usePage().props;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState(defaultStatus);
    const [startDate, setStartDate] = useState("");  
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [theme] = useDarkMode();

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setCategory(task.category_id || (categories.length > 0 ? categories[0].id : ""));
            setStatus(task.status ?? defaultStatus);
            setStartDate(task.start_date ? task.start_date.split(" ")[0] : "");
            setEndDate(task.end_date ? task.end_date.split(" ")[0] : "");
            setStartTime(task.start_date ? task.start_date.split(" ")[1]?.slice(0, 5) : "");
            setEndTime(task.end_date ? task.end_date.split(" ")[1]?.slice(0, 5) : "");
        } else {
            setTitle("");
            setDescription("");
            setCategory(categories.length > 0 ? categories[0].id : "");
            setStatus(defaultStatus);
            setStartDate("");
            setEndDate("");
            setStartTime("");
            setEndTime("");
        }
    }, [task, categories, defaultStatus]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedStartDate = startDate && startTime ? `${startDate} ${startTime}:00` : null;
        const formattedEndDate = endDate && endTime ? `${endDate} ${endTime}:00` : null;

        // ✅ Konsolda gönderilen verileri kontrol et
        console.log("🚀 Gönderilen Status:", status);
        console.log("📦 Gönderilen Task Verisi:", { title, description, category_id: category, status, is_archived: isArchived, start_date: formattedStartDate, end_date: formattedEndDate });

        const data = { 
            title, 
            description, 
            category_id: category, 
            status: Number(status),
            is_archived: isArchived, // ✅ Görev arşivli mi değil mi bilgisini ekledik
            start_date: formattedStartDate,
            end_date: formattedEndDate
        };

        if (task) {
            Inertia.put(`/tasks/${task.id}`, data, {
                onSuccess: showSuccessMessage,
            });
        } else {
            Inertia.post("/tasks", data, {
                onSuccess: showSuccessMessage,
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
            <div className="w-[400px] rounded-xl shadow-lg p-6 transition-all bg-white dark:bg-gray-800">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {task ? "Edit Task" : "New Task"}
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 text-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <textarea
                        placeholder="Take a note..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 text-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    ></textarea>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 text-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex flex-col space-y-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium">Start Date & Time</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-1/2 p-3 text-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-1/2 p-3 text-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <label className="text-gray-700 dark:text-gray-300 font-medium">End Date & Time</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-1/2 p-3 text-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-1/2 p-3 text-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
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
