import { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "@/ApplicationComponents/TaskItem";
import TaskForm from "@/ApplicationComponents/TaskForm";

export default function Tasks({ tasks = [] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);

    // 📌 Gelen görevleri logla
    console.log("Görevler:", tasks);

    // 📌 Kategorileri API’den çek
    useEffect(() => {
        axios.get("/task-categories")
            .then((response) => {
                setCategories(response.data);
                setLoading(false);
                console.log("Kategoriler yüklendi:", response.data);
            })
            .catch((error) => {
                console.error("Kategori yüklenirken hata oluştu:", error);
                setLoading(false);
            });
    }, []);

    // 📌 Arama ve Kategoriye Göre Filtreleme
    const filteredTasks = tasks.filter((task) => {
        console.log("Görev Kategorisi:", task.taskCategory);
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" ||
            task.taskCategory?.id === selectedCategory ||
            task.taskCategory?.name === selectedCategory ||
            task.task_category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* 🔍 Search Bar ve Filtreleme */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="px-3 py-2 border rounded-md w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* 📂 Kategori Butonları */}
                <div className="space-x-2">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-4 py-2 rounded-md ${selectedCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        All
                    </button>

                    {loading ? (
                        <span>Loading...</span>
                    ) : (
                        categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-md ${selectedCategory === cat.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                {cat.name}
                            </button>
                        ))
                    )}
                </div>

                {/* ➕ Yeni Görev Ekle Butonu */}
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    onClick={() => { setSelectedTask(null); setModalOpen(true); }}
                >
                    +
                </button>
            </div>

            {/* 📝 Görev Listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={() => { setSelectedTask(task); setModalOpen(true); }}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No tasks found.</p>
                )}
            </div>

            {/* 🏗️ Modal Bileşeni */}
            {modalOpen && (
                <TaskForm
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={selectedTask}
                />
            )}
        </div>
    );
}
