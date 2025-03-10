import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Tasks from "@/Pages/Tasks";
import TaskForm from "@/ApplicationComponents/TaskForm";
import TaskCategoryForm from "@/ApplicationComponents/TaskCategoryForm";
import { Inertia } from "@inertiajs/inertia"; 
import useDarkMode from "@/Theme/useDarkMode"; 

export default function Dashboard() {
    const { tasks: initialTasks = [], categories = [], user } = usePage().props;
    const [tasks, setTasks] = useState(initialTasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [selectedCategoryEdit, setSelectedCategoryEdit] = useState(null);
    const [showArchived, setShowArchived] = useState(false);
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState(""); 
    const [theme] = useDarkMode(); 
    const [googleSync, setGoogleSync] = useState(user.google_sync);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isTogglingSync, setIsTogglingSync] = useState(false);

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
            const matchesArchiveStatus = showArchived ? task.is_archived : !task.is_archived;

            const taskStartDate = task.start_date ? task.start_date.split(" ")[0] : null;
            const taskEndDate = task.end_date ? task.end_date.split(" ")[0] : null;
            const matchesStartDate = !startDateFilter || (taskStartDate && taskStartDate >= startDateFilter);
            const matchesEndDate = !endDateFilter || (taskEndDate && taskEndDate <= endDateFilter);

            return matchesSearch && matchesCategory && matchesArchiveStatus && matchesStartDate && matchesEndDate;
        });

        setFilteredTasks(newFilteredTasks);
    }, [searchQuery, selectedCategory, tasks, categories, showArchived, startDateFilter, endDateFilter]);

    const updateTasks = (updatedTasks) => {
        setTasks(updatedTasks);
    };

    const handleArchiveToggle = (taskId, isArchived) => {
        Inertia.put(`/tasks/${taskId}/toggle-archive`, { archive: !isArchived }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowArchived(!isArchived);
            },
            onError: (error) => console.error("Error toggling archive status:", error),
        });
    };

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const toggleGoogleSync = async () => {
        if (!csrfToken || isTogglingSync) {
            return;
        }

        setIsTogglingSync(true);

        try {
            const response = await fetch('/profile/toggle-google-sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken, 
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error('Google Sync güncelleme başarısız!');
            }

            const data = await response.json();
            setGoogleSync(data.google_sync);
        } catch (error) {
            console.error("Google Sync güncelleme hatası:", error);
        } finally {
            setIsTogglingSync(false);
        }
    };

    const syncGoogleTasks = () => {
        if (isSyncing) return;

        setIsSyncing(true);

        Inertia.post('/tasks/sync-google', {}, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Google Tasks successfully synced!");
                setIsSyncing(false);
            },
            onError: (error) => {
                console.error("Google Sync hata:", error);
                setIsSyncing(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                    🗂️ Your Tasks
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-5xl px-6">
                    
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-6 flex justify-between items-center">
                        <div className="flex gap-4">
                            <button
                                className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 ${
                                    showArchived ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"
                                }`}
                                onClick={() => setShowArchived(!showArchived)}
                            >
                                {showArchived ? "📂 Show Tasks" : "🗃️ Show Archived"}
                            </button>

                            <button
                                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                                onClick={() => { setSelectedTask(null); setModalOpen(true); }}
                            >
                                ➕ Add Task
                            </button>

                            <button
                                className="px-4 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-200"
                                onClick={() => { setSelectedCategoryEdit(null); setCategoryModalOpen(true); }}
                            >
                                ✚ Add Category
                            </button>

                            <button
                                onClick={toggleGoogleSync}
                                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md transition duration-200 ${
                                    googleSync ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"
                                }`}
                                disabled={isTogglingSync}
                            >
                                {googleSync ? "✅ Google Sync Açık" : "❌ Google Sync Kapalı"}
                            </button>

                            <button
                                onClick={syncGoogleTasks}
                                className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg shadow-md hover:bg-indigo-600 transition duration-200"
                                disabled={isSyncing}
                            >
                                {isSyncing ? "🔄 Senkronizasyon Yapılıyor..." : "🔄 Google Takvim'den Senkronize Et"}
                            </button>
                        </div>
                    </div>

                    <Tasks tasks={filteredTasks} categories={categories} updateTasks={updateTasks} onArchiveToggle={handleArchiveToggle} />
                    
                    {modalOpen && <TaskForm isOpen={modalOpen} onClose={() => setModalOpen(false)} task={selectedTask} />}
                    {categoryModalOpen && <TaskCategoryForm isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} category={selectedCategoryEdit} />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
