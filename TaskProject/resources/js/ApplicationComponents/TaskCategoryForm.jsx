import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import useDarkMode from "@/Theme/useDarkMode"; // ✅ Dark Mode Hook eklendi

export default function CategoryForm({ isOpen, onClose, category }) {
    const { categories = [] } = usePage().props;
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [theme] = useDarkMode(); // ✅ Dark mode state

    useEffect(() => {
        if (category) {
            setName(category.name ?? "");
        } else {
            setName("");
        }
        setError(""); 
    }, [category]);

    const handleInputChange = (e) => {
        const newName = e.target.value.trim(); 
        setName(e.target.value); 

        if (categories.some(cat => cat.name.trim().toLowerCase() === newName.toLowerCase())) {
            setError("This category already exists.");
        } else {
            setError(""); 
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedName = name.trim(); 

        if (!trimmedName) {
            setError("Category name cannot be empty.");
            return;
        }

        if (categories.some(cat => cat.name.trim().toLowerCase() === trimmedName.toLowerCase())) {
            setError("This category already exists.");
            return; 
        }

        const data = { name: trimmedName }; 

        if (category) {
            Inertia.put(`/categories/${category.id}`, data, {
                onSuccess: () => showSuccessMessage("Category Updated!"),
            });
        } else {
            Inertia.post("/categories", data, {
                onSuccess: () => showSuccessMessage("Category Created!"),
            });
        }
    };

    const showSuccessMessage = (message) => {
        setShowToast(message);
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
                    {category ? "Edit Category" : "New Category"}
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={handleInputChange}
                        className={`w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 ${
                            error
                                ? "border-red-500 focus:ring-red-400 dark:border-red-400 dark:focus:ring-red-500 dark:text-gray-700"
                                : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-purple-400 dark:focus:ring-purple-500"
                        }`}
                        required
                    />

                    {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 text-md font-medium bg-gray-400 dark:bg-gray-600 text-white rounded-md shadow hover:bg-gray-500 dark:hover:bg-gray-500 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={`px-4 py-2 text-md font-medium rounded-md shadow transition ${
                                error
                                    ? "bg-gray-400 cursor-not-allowed dark:bg-gray-500"
                                    : "bg-purple-500 dark:bg-purple-600 text-white hover:bg-purple-600 dark:hover:bg-purple-700"
                            }`}
                            disabled={!!error} 
                        >
                            {category ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>

            {showToast && (
                <div className="fixed bottom-6 right-6 bg-purple-500 dark:bg-purple-700 text-white px-5 py-3 rounded-lg shadow-lg animate-bounce">
                    {showToast}
                </div>
            )}
        </div>
    ) : null;
}
