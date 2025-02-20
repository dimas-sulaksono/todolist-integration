import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import API from "@/services/api";
import useAuthRedirect from "@/middleware/authMiddleware";
import MainLayout from "@/components/templates/MainLayout";


const toTitleCase = (slug) => {
    return slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function TodolistDetailByTitle() {
    useAuthRedirect();
    const router = useRouter();
    const { title } = router.query;
    const [auth] = useAtom(authAtom);
    const [task, setTask] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!title || !auth.user?.id) return;
        const formattedTitle = toTitleCase(title);
        fetchTodolistByTitle(auth.user.id, formattedTitle);
    }, [title, auth.user]);

    const fetchTodolistByTitle = async (userId, searchTitle) => {
        try {
            const res = await API.get(`/todolist/user/${userId}/search?title=${encodeURIComponent(searchTitle)}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (res.data.data.length > 0) {
                setTask(res.data.data[0]);
            } else {
                setTask(null);
                setError("Todolist tidak ditemukan.");
            }
        } catch (err) {
            setError("Gagal mengambil data todolist.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-gray-700">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!task) return <p className="text-gray-700">Todolist tidak ditemukan.</p>;

    const handleMarkCompleted = async () => {
        try {
            await API.put(
                `/todolist/${id}/complete`,
                {},
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setTask((prev) => ({ ...prev, completed: true }));
        } catch (err) {
            setError("Gagal menyelesaikan tugas.");
        }
    };

    const handleDeleteTodolist = async () => {
        try {
            await API.delete(`/todolist/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            router.push("/todolist");
        } catch (err) {
            setError("Gagal menghapus todolist.");
        }
    };

    const handleBack = () => {
        router.back();
    };


    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Detail Todolist</h1>
                <button
                    onClick={handleBack}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Back
                </button>
            </div>
            <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <p className="text-gray-700">{task.description || "Tidak ada deskripsi"}</p>
                <p className="text-sm text-gray-600 mt-2">Kategori: {task.category?.name || "Tanpa Kategori"}</p>
                <p className={`text-sm mt-2 ${task.completed ? "text-green-400" : "text-yellow-400"}`}>
                    Status: {task.completed ? "Selesai" : "Belum Selesai"}
                </p>

                {/* task gambar */}
                {/* {task.imagePath && (
                <img
                    src={`C:/_vavi/_bootcamp/_mainClass/todolist/src/main/resources/static/images/${task.imagePath}`}
                    alt={task.title}
                    className="mt-4 w-full h-48 object-cover rounded-lg shadow-md"
                />
            )} */}

                <div className="flex gap-3 mt-4">
                    {!task.completed && (
                        <button
                            onClick={handleMarkCompleted}
                            className="bg-green-600 font-medium px-4 py-2 rounded-md hover:bg-green-600 transition text-white"
                        >
                            Tandai Selesai
                        </button>
                    )}
                    <button
                        onClick={handleDeleteTodolist}
                        className="bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600 transition"
                    >
                        Hapus Todolist
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
