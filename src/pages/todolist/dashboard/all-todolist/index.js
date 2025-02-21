import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import API from "@/services/api";
import useAuthRedirect from "@/middleware/authMiddleware";
import MainLayout from "@/components/templates/MainLayout";
import { useRouter } from "next/router";
import CardTodolist from "@/components/molecules/CardTodolist";


export default function AllTodolistPage() {
    useAuthRedirect();
    const [auth] = useAtom(authAtom);
    const router = useRouter();

    const [todolists, setTodolists] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState(router.query.search || "");


    useEffect(() => {
        if (!auth.user?.username) return;
        fetchCategories();
        fetchUserRole(auth.user.username);
    }, [auth]);

    useEffect(() => {
        if (userRole === "ADMIN") {
            fetchAllTodolist(currentPage);
        } else if (userRole === "USER") {
            router.push("/todolist"); // Redirect user biasa ke halaman Todolist
        }
    }, [userRole, currentPage]);

    const fetchUserRole = async (username) => {
        try {
            const res = await API.get(`/user/${username}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setUserRole(res.data?.data?.role || "USER");
        } catch (err) {
            setUserRole("USER");
        }
    };

    const fetchAllTodolist = async (page) => {
        try {
            const res = await API.get(`/todolist?page=${page}&size=5`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setTodolists(res.data.data);
            setTotalPages(res.data.totalPages);
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

    const handleBack = () => {
        router.back();
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">All Todolist</h1>
                <button
                    onClick={handleBack}
                    className="bg-blue-500 min-w-32 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Kembali
                </button>
            </div>

            {/* <div className="flex gap-4 mb-4">
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
            </div> */}

            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-2">
                {todolists.length > 0 ? (
                    todolists.map((task) => (
                        <CardTodolist key={task.id} task={task} />
                    ))
                ) : (
                    <p className="text-gray-400">Tidak ada todolist yang ditemukan.</p>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 mx-2 border rounded-md ${currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    Prev
                </button>
                <span className="px-4 py-2">{currentPage + 1} / {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
                    className={`px-4 py-2 mx-2 border rounded-md ${currentPage >= totalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    Next
                </button>
            </div>
        </MainLayout>
    );
}
