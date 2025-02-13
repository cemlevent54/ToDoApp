import { useState } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Tasks from "@/Pages/Tasks";
import TaskForm from "@/ApplicationComponents/TaskForm";

export default function Dashboard() {
    const { tasks = [], categories = [] } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // ✅ Arama ve Kategoriye Göre Filtreleme
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false;
        const matchesCategory = selectedCategory === "All" || task.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                    {/* 📌 Kullanıcı Bilgisi Ayrı Bir Alan */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6 mb-6">
                        <p className="text-gray-900">You're logged in!</p>
                    </div>

                    {/* 📌 Görev Yönetim Alanı */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {/* 🔍 Search Bar ve Filtreleme */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="px-3 py-2 border rounded-md w-full md:w-1/3"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {/* 📂 Kategori Butonları */}
                            <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className={`px-4 py-2 rounded-md ${
                                        selectedCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-200"
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-4 py-2 rounded-md ${
                                            selectedCategory === cat.id ? "bg-blue-500 text-white" : "bg-gray-200"
                                        }`}
                                    >
                                        {cat.name}
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
                        <Tasks tasks={filteredTasks} categories={categories} />

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
