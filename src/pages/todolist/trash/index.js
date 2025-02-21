import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import API from "@/services/api";
import { authAtom } from "@/store/authAtom";
import useAuthRedirect from "@/middleware/authMiddleware";
import MainLayout from "@/components/templates/MainLayout";

export default function TrashPage() {
    useAuthRedirect();
    const [auth] = useAtom(authAtom);
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!auth.user?.id) return;
        fetchDeletedTodolist(auth.user.id, currentPage);
    }, [auth.user, currentPage]);

    const fetchDeletedTodolist = async (userId, page) => {
        try {
            const res = await API.get(`/todolist/${userId}/trash?page=${page}&size=5`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (Array.isArray(res.data.data)) {
                setDeletedTasks(res.data.data);
                setTotalPages(res.data.totalPages);
            } else {
                setError("Data tidak berbentuk array");
                setDeletedTasks([]);
            }
        } catch (err) {
            setError("Gagal mengambil data todolist yang dihapus.");
        }
    };

    const handleRestoreTodolist = async (id) => {
        try {
            await API.put(`/todolist/restore/${id}`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setDeletedTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } catch (err) {
            setError("Gagal mengembalikan todolist.");
        }
    };

    const handleHardDeleteTodolist = async (id) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus todolist ini secara permanen?");
        if (!confirmDelete) return;

        try {
            await API.delete(`/todolist/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setSuccessMessage("Todolist berhasil dihapus secara permanen!");
            setTimeout(() => {
                setSuccessMessage("");
                fetchDeletedTodolist(auth.user.id, currentPage);
            }, 1000);
        } catch (err) {
            setError("Gagal menghapus todolist secara permanen.");
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
                <button
                    onClick={handleBack}
                    className="bg-blue-500 min-w-32 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Back
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {successMessage && (
                <div className="p-3 mb-4 text-green-700 bg-green-200 border border-green-400 rounded">
                    {successMessage}
                </div>
            )}

            <ul className="space-y-2">
                {deletedTasks.length > 0 ? (
                    deletedTasks.map((task) => (
                        <li key={task.id}>
                            <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold">{task.title}</h1>
                                    <p className="text-gray-700">{task.description || "Tidak ada deskripsi"}</p>
                                    <p className="text-sm text-gray-600 mt-2">Kategori: {task.category?.name || "Tanpa Kategori"}</p>
                                </div>

                                {/* Posisi tombol diperbaiki (vertikal dan sejajar di sisi kanan) */}
                                <div className="flex flex-col items-end gap-2">
                                    {/* <button
                                        onClick={() => handleRestoreTodolist(task.id)}
                                        className="bg-green-500 min-w-40 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                    >
                                        Pulihkan
                                    </button> */}
                                    <button
                                        onClick={() => handleHardDeleteTodolist(task.id)}
                                        className="bg-red-500 text-white min-w-40 px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Hapus Permanen
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-400">Tidak ada todolist di trash.</p>
                )}
            </ul>

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
