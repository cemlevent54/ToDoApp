import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";

export default function CategoryForm({ isOpen, onClose, category }) {
    const { categories = [] } = usePage().props; // ✅ Kullanıcının mevcut kategorilerini al
    const [name, setName] = useState("");
    const [error, setError] = useState(""); // ❌ Hata mesajı için state
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name ?? "");
        } else {
            setName("");
        }
        setError(""); // Form açıldığında hatayı temizle
    }, [category]);

    // ✅ Kullanıcı inputa yazarken anlık hata kontrolü
    const handleInputChange = (e) => {
        const newName = e.target.value.trim(); // 🟢 Baştaki ve sondaki boşlukları temizle
        setName(e.target.value); // Kullanıcının girdiğini normal olarak sakla

        if (categories.some(cat => cat.name.trim().toLowerCase() === newName.toLowerCase())) {
            setError("This category already exists.");
        } else {
            setError(""); // Hata yoksa temizle
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedName = name.trim(); // 🟢 Form gönderilirken de boşlukları temizle

        if (!trimmedName) {
            setError("Category name cannot be empty.");
            return;
        }

        if (categories.some(cat => cat.name.trim().toLowerCase() === trimmedName.toLowerCase())) {
            setError("This category already exists.");
            return; // ❌ Eğer hata varsa formu göndermeyi engelle
        }

        const data = { name: trimmedName }; // 🟢 Veriyi boşluksuz kaydet

        if (category) {
            // ✅ Kategori Güncelleme
            Inertia.put(`/categories/${category.id}`, data, {
                onSuccess: () => showSuccessMessage("Category Updated!"),
            });
        } else {
            // ✅ Yeni Kategori Ekleme
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
            <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 transition-all">
                <h2 className="text-xl font-semibold text-gray-800">
                    {category ? "Edit Category" : "New Category"}
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={handleInputChange} // ✅ Anlık hata kontrolü
                        className={`w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 ${
                            error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-purple-400"
                        }`}
                        required
                    />

                    {/* ❌ Hata Mesajı (Anlık Gösterim) */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

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
                            className={`px-4 py-2 text-md font-medium rounded-md shadow transition ${
                                error ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 text-white hover:bg-purple-600"
                            }`}
                            disabled={!!error} // ❌ Hata varsa butonu devre dışı bırak
                        >
                            {category ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>

            {showToast && (
                <div className="fixed bottom-6 right-6 bg-purple-500 text-white px-5 py-3 rounded-lg shadow-lg animate-bounce">
                    {showToast}
                </div>
            )}
        </div>
    ) : null;
}
