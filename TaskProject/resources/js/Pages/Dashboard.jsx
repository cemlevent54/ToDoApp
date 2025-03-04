import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Tasks from "@/Pages/Tasks";
import TaskForm from "@/ApplicationComponents/TaskForm";
import TaskCategoryForm from "@/ApplicationComponents/TaskCategoryForm";


export default function Dashboard() {
    const { tasks: initialTasks = [], categories = [] } = usePage().props;
    const [tasks, setTasks] = useState(initialTasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false); // ✅ Yeni state
    const [selectedCategoryEdit, setSelectedCategoryEdit] = useState(null);

    // ✅ Arama ve Kategoriye Göre Filtreleme
    const [filteredTasks, setFilteredTasks] = useState(initialTasks);

    useEffect(() => {
        const newFilteredTasks = tasks.filter((task) => {
            const category = categories.find((c) => c.id === task.category_id);
            const categoryName = category ? category.name.toLowerCase() : "";
    
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                categoryName.includes(searchQuery.toLowerCase()) || // ✅ Kategori adında arama
                searchQuery === "";
    
            const matchesCategory = selectedCategory === "All" || Number(task.category_id) === Number(selectedCategory);
    
            return matchesSearch && matchesCategory;
        });
    
        setFilteredTasks(newFilteredTasks);
    }, [searchQuery, selectedCategory, tasks, categories]);
    
    // ✅ Görevlerin Drag & Drop sonrası state’ini güncelle
    const updateTasks = (updatedTasks) => {
        setTasks(updatedTasks);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
                    🗂️ Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-5xl px-6">
                    
                    {/* ✅ Welcome Back + Add Task Button */}
                    <div className="bg-white shadow-sm rounded-xl p-6 mb-6 flex justify-between items-center">
                        <p className="text-gray-700 text-lg font-medium">
                            ✅ Welcome back! Manage your tasks efficiently.
                        </p>
                        <button
                            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                            onClick={() => { setSelectedTask(null); setModalOpen(true); }}
                        >
                            ➕ Add Task
                        </button>
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
                                    .filter(category => tasks.some(task => task.category_id === category.id)) // ✅ Görevi olan kategorileri filtrele
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

                                
                                {/* ✅ Add Category Button */}
                                <button
                                    className="px-4 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-200"
                                    onClick={() => { setSelectedCategoryEdit(null); setCategoryModalOpen(true); }}
                                >
                                    ➕ Add Category
                                </button>
                            </div>
                        </div>

                        <Tasks tasks={filteredTasks} categories={categories} updateTasks={updateTasks} />

                        {modalOpen && (
                            <TaskForm
                                isOpen={modalOpen}
                                onClose={() => setModalOpen(false)}
                                task={selectedTask}
                            />
                        )}

                        {categoryModalOpen && (
                            <TaskCategoryForm
                                isOpen={categoryModalOpen}
                                onClose={() => setCategoryModalOpen(false)}
                                category={selectedCategoryEdit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
