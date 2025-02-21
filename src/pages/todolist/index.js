import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import API from "@/services/api";
import { authAtom } from "@/store/authAtom";
import useAuthRedirect from "@/middleware/authMiddleware";
import MainLayout from "@/components/templates/MainLayout";
import { useRouter } from "next/router";
import CardTodolist from "@/components/molecules/CardTodolist";

export default function Todolist() {
    useAuthRedirect();
    const router = useRouter();
    const [auth] = useAtom(authAtom);
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState(router.query.search || "");

    useEffect(() => {
        if (!auth.user?.id) return;
        fetchCategories();
        fetchTodolist(auth.user.id, searchQuery, selectedCategory);
    }, [auth.user, searchQuery, selectedCategory]);

    const fetchTodolist = async (userId, search, categoryId) => {
        try {
            let endpoint = `/todolist/user/${userId}`;
            if (search) {
                endpoint = `/todolist/user/${userId}/search?title=${encodeURIComponent(search)}`;
            } else if (categoryId) {
                endpoint = `/todolist/filter?userId=${userId}&categoryId=${categoryId}`;
            }

            const res = await API.get(endpoint, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (Array.isArray(res.data.data)) {
                setTasks(res.data.data);
            } else {
                setError("Data tidak berbentuk array");
                setTasks([]);
            }
        } catch (err) {
            setError("Gagal mengambil data todolist.");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await API.get("/todolist/category", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setCategories(res.data.data);
        } catch (err) {
            setError("Gagal mengambil kategori.");
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Todolist</h1>

                <button
                    onClick={() => router.push("/todolist/add")}
                    className="bg-blue-500 min-w-32 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Tambah Data
                </button>
            </div>

            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Cari todolist..."
                    className="w-full p-2 border rounded text-gray-700 placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    className="p-2 border rounded text-gray-700"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-2">
                {tasks.length > 0 ? (
                    tasks.map((task) => <CardTodolist key={task.id} task={task} />)
                ) : (
                    <p className="text-gray-400">Tidak ada todo ditemukan.</p>
                )}
            </div>
        </MainLayout>
    );
}
