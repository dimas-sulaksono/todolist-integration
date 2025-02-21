import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import API from "@/services/api";
import { authAtom } from "@/store/authAtom";
import MainLayout from "@/components/templates/MainLayout";

export default function CategoryDashboard() {
    const [auth] = useAtom(authAtom);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!auth.token) return;
        fetchCategories();
    }, [auth.token]);

    const fetchCategories = async () => {
        try {
            const res = await API.get("/todolist/category", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (Array.isArray(res.data.data)) {
                setCategories(res.data.data);
            } else {
                setError("Data tidak berbentuk array");
                setCategories([]);
            }
        } catch (err) {
            setError("Gagal mengambil data kategori.");
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            await API.post(
                "/todolist/category",
                { name: newCategory },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );

            setSuccessMessage("Kategori berhasil ditambahkan!");
            setNewCategory("");
            fetchCategories();
        } catch (err) {
            setError("Gagal menambahkan kategori.");
        }
    };

    const handleDeleteCategory = async (id) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus kategori ini?");
        if (!confirmDelete) return;

        try {
            await API.delete(`/todolist/category/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setSuccessMessage("Kategori berhasil dihapus!");
            fetchCategories();
        } catch (err) {
            setError("Gagal menghapus kategori.");
        }
    };

    const handleEditCategory = async (e) => {
        e.preventDefault();
        if (!editCategoryName.trim()) return;

        try {
            await API.put(
                `/todolist/category/${editingCategory.id}`,
                { name: editCategoryName },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );

            setSuccessMessage("Kategori berhasil diperbarui!");
            setEditingCategory(null);
            setEditCategoryName("");
            fetchCategories();
        } catch (err) {
            setError("Gagal memperbarui kategori.");
        }
    };

    return (
        <MainLayout>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Dashboard - Kategori</h1>

                {successMessage && <p className="p-3 text-green-700 bg-green-200 border border-green-400 rounded">{successMessage}</p>}
                {error && <p className="p-3 text-red-700 bg-red-200 border border-red-400 rounded">{error}</p>}

                <form onSubmit={handleAddCategory} className="mb-4 flex gap-3">
                    <input
                        type="text"
                        placeholder="Nama Kategori"
                        className="w-full p-2 border rounded text-gray-700"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        Tambah
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-gray-800">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left">Nama Kategori</th>
                                <th className="border p-2 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-100">
                                        <td className="border p-2">
                                            {editingCategory?.id === category.id ? (
                                                <input
                                                    type="text"
                                                    value={editCategoryName}
                                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                                    className="p-1 border rounded"
                                                />
                                            ) : (
                                                category.name
                                            )}
                                        </td>
                                        <td className="border p-2 text-center">
                                            {editingCategory?.id === category.id ? (
                                                <button
                                                    onClick={handleEditCategory}
                                                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 mr-2"
                                                >
                                                    Simpan
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        setEditCategoryName(category.name);
                                                    }}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="border p-2 text-center text-gray-500">
                                        Tidak ada kategori ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
