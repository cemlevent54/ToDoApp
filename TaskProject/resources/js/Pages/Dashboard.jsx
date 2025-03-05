import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Tasks from "@/Pages/Tasks";
import TaskForm from "@/ApplicationComponents/TaskForm";
import TaskCategoryForm from "@/ApplicationComponents/TaskCategoryForm";
import { Inertia } from "@inertiajs/inertia"; // 📌 Arşivleme işlemi için gerekli

export default function Dashboard() {
    const { tasks: initialTasks = [], categories = [] } = usePage().props;
    const [tasks, setTasks] = useState(initialTasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [selectedCategoryEdit, setSelectedCategoryEdit] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // 🟢 Arşivlenmiş görevleri göster/gizle

    // ✅ Arama ve Kategoriye Göre Filtreleme
    const [filteredTasks, setFilteredTasks] = useState(initialTasks);

    useEffect(() => {
        const newFilteredTasks = tasks.filter((task) => {
            const category = categories.find((c) => c.id === task.category_id);
            const categoryName = category ? category.name.toLowerCase() : "";

            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                categoryName.includes(searchQuery.toLowerCase()) ||
                searchQuery === "";

            const matchesCategory = selectedCategory === "All" || Number(task.category_id) === Number(selectedCategory);

            const matchesArchiveStatus = showArchived ? task.is_archived : !task.is_archived; // ✅ Archive durumuna göre filtrele

            return matchesSearch && matchesCategory && matchesArchiveStatus;
        });

        setFilteredTasks(newFilteredTasks);
    }, [searchQuery, selectedCategory, tasks, categories, showArchived]);

    // ✅ Görevlerin Drag & Drop sonrası state’ini güncelle
    const updateTasks = (updatedTasks) => {
        setTasks(updatedTasks);
    };

    // ✅ Görev Arşivleme / Geri Yükleme İşlemi
    const handleArchiveToggle = (taskId, isArchived) => {
        Inertia.put(`/tasks/${taskId}/toggle-archive`, { archive: !isArchived }, {
            preserveScroll: true,
            onSuccess: () => {
                // Eğer görev arşivlendi ise, arşivlenmişleri göster
                if (!isArchived) {
                    setShowArchived(true);
                } else {
                    setShowArchived(false); // Eğer geri yüklendiyse normal listeyi göster
                }
            },
            onError: (error) => console.error("Error toggling archive status:", error),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
                    🗂️ Your Tasks
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-5xl px-6">
                    
                    {/* ✅ Welcome Back + Add Task + Archived Tasks Toggle */}
                    <div className="bg-white shadow-sm rounded-xl p-6 mb-6 flex justify-between items-center">
                        <div className="flex gap-4">
                            {/* 📌 Archive Toggle Butonu */}
                            <button
                                className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 ${
                                    showArchived ? "bg-yellow-600 text-white hover:bg-yellow-700" : "bg-gray-600 text-white hover:bg-gray-700"
                                }`}
                                onClick={() => setShowArchived(!showArchived)}
                            >
                                {showArchived ? "📂 Show Tasks" : "🗃️ Show Archived"}
                            </button>

                            {/* 📌 Add Task Butonu */}
                            <button
                                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                                onClick={() => { setSelectedTask(null); setModalOpen(true); }}
                            >
                                ➕ Add Task
                            </button>

                            {/* ✅ Add Category Button */}
                            <button
                                className="px-4 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-200"
                                onClick={() => { setSelectedCategoryEdit(null); setCategoryModalOpen(true); }}
                            >
                                ➕ Add Category
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-xl p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="🔍 Search tasks..."
                                className="w-full md:w-1/3 p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {/* ✅ Kategoriler + Add Category Button */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <button
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        selectedCategory === "All"
                                            ? "bg-blue-500 text-white shadow-md"
                                            : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                    onClick={() => setSelectedCategory("All")}
                                >
                                    All
                                </button>
                                {categories
                                    .filter(category => tasks.some(task => task.category_id === category.id))
                                    .map((category) => (
                                        <button
                                            key={category.id}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                selectedCategory === category.id
                                                    ? "bg-blue-500 text-white shadow-md"
                                                    : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                            onClick={() => setSelectedCategory(category.id)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}

                                
                            </div>
                        </div>

                        <Tasks tasks={filteredTasks} categories={categories} updateTasks={updateTasks} onArchiveToggle={handleArchiveToggle} />

                        {modalOpen && <TaskForm isOpen={modalOpen} onClose={() => setModalOpen(false)} task={selectedTask} />}
                        {categoryModalOpen && <TaskCategoryForm isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} category={selectedCategoryEdit} />}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
