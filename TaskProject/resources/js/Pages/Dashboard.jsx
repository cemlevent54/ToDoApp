import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Tasks from "@/Pages/Tasks";
import TaskForm from "@/ApplicationComponents/TaskForm";

export default function Dashboard() {
    const { tasks: initialTasks = [], categories = [] } = usePage().props;
    const [tasks, setTasks] = useState(initialTasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // ✅ Arama ve Kategoriye Göre Filtreleme
    const [filteredTasks, setFilteredTasks] = useState(initialTasks);

    useEffect(() => {
        const newFilteredTasks = tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === "";
            const matchesCategory = selectedCategory === "All" || Number(task.category_id) === Number(selectedCategory);
            return matchesSearch && matchesCategory;
        });

        setFilteredTasks(newFilteredTasks);
    }, [searchQuery, selectedCategory, tasks]);

    // ✅ Görevlerin Drag & Drop sonrası state’ini güncelle
    const updateTasks = (updatedTasks) => {
        setTasks(updatedTasks);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* 📌 Kullanıcı Bilgisi */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6 mb-6">
                        <p className="text-gray-900">You're logged in!</p>
                    </div>

                    {/* 📌 Görev Yönetim Alanı */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {/* 🔍 Search Bar ve Kategori Butonları */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="p-2 border rounded-md w-full md:w-1/3"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {/* 🏷️ Kategori Butonları */}
                            <div className="flex space-x-2 overflow-auto mt-2 md:mt-0">
                                <button
                                    className={`px-3 py-1 border rounded-md ${selectedCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                    onClick={() => setSelectedCategory("All")}
                                >
                                    All
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        className={`px-3 py-1 border rounded-md ${selectedCategory === category.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            {/* ➕ Yeni Görev Ekle Butonu */}
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-md ml-2"
                                onClick={() => { setSelectedTask(null); setModalOpen(true); }}
                            >
                                +
                            </button>
                        </div>

                        {/* 📝 Görev Listesi */}
                        <Tasks tasks={filteredTasks} categories={categories} updateTasks={updateTasks} />

                        {/* 🏗️ Modal Bileşeni */}
                        {modalOpen && (
                            <TaskForm
                                isOpen={modalOpen}
                                onClose={() => setModalOpen(false)}
                                task={selectedTask}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
