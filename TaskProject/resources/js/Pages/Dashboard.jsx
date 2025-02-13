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
                <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
                    🗂️ Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
                        <p className="text-gray-700 text-lg font-medium">
                            ✅ Welcome back! Manage your tasks efficiently.
                        </p>
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

                            <div className="flex flex-wrap gap-2">
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
                                {categories.map((category) => (
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

                            <button
                                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                                onClick={() => { setSelectedTask(null); setModalOpen(true); }}
                            >
                                ➕ Add Task
                            </button>
                        </div>

                        <Tasks tasks={filteredTasks} categories={categories} updateTasks={updateTasks} />

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
