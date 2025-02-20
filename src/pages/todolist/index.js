import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import API from "@/services/api";
import { authAtom } from "@/store/authAtom";
import useAuthRedirect from "@/middleware/authMiddleware";
import MainLayout from "@/components/templates/MainLayout";
import { useRouter } from "next/router";
import { debounce } from "lodash"; // 🔥 lodash buat cegah repeat request

export default function Todolist() {
    useAuthRedirect();
    const router = useRouter();
    const [auth] = useAtom(authAtom);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState(router.query.search || ""); // state search

    useEffect(() => {
        if (!auth.user?.id) return;
        const userId = auth.user.id;

        //  debounce untuk menghindari terlalu banyak request saat mengetik
        const debouncedSearch = debounce(() => {
            fetchTodolist(userId, searchQuery);
        }, 500); // delay 500ms sebelum request

        debouncedSearch(); // jalanin search setelah delay
        return () => debouncedSearch.cancel(); // cleanup biar ngga memory leak
    }, [auth.user, searchQuery]); // jalanin ulang setiap kali user atau searchQuery berubah

    const fetchTodolist = async (userId, search) => {
        try {
            let endpoint = `/todolist/user/${userId}`;
            if (search) {
                endpoint = `/todolist/user/${userId}/search?title=${encodeURIComponent(search)}`;
            }

            const res = await API.get(endpoint);

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

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Todolist</h1>
                {/* 🔥 Tombol Add Todo */}
                <button
                    onClick={() => router.push("/todolist/add")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    + Add Todo
                </button>
            </div>


            <input
                type="text"
                placeholder="Cari todolist..."
                className="w-full p-2 border rounded text-gray-700 placeholder-gray-500 mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // 🔥 Mencari otomatis saat mengetik
            />

            {error && <p className="text-red-500">{error}</p>}

            <ul>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <li key={task.id} className="p-2 border-b text-gray-800">
                            <strong>{task.title}</strong> - {task.category?.name || "Tanpa Kategori"}
                        </li>
                    ))
                ) : (
                    <p className="text-gray-700">Tidak ada todo ditemukan.</p>
                )}
            </ul>
        </MainLayout>
    );
}
