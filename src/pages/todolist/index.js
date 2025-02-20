import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import API from "@/services/api";
import { authAtom } from "@/store/authAtom";
import useAuthRedirect from "@/middleware/authMiddleware";
import MainLayout from "@/components/templates/MainLayout";

export default function Todolist() {
    useAuthRedirect();
    const [auth] = useAtom(authAtom);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!auth.user?.id) {
            console.log("User ID tidak ditemukan!");
            return;
        }

        const userId = auth.user.id;
        console.log("Fetching todolist for user ID:", userId); // Debugging

        API.get(`/todolist/user/${userId}`)
            .then((res) => {
                console.log("API Response:", res.data); // Debugging response API

                if (Array.isArray(res.data.data)) {
                    setTasks(res.data.data);
                } else {
                    setError("Data tidak berbentuk array");
                    setTasks([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching todolist:", err);
                setError("Gagal mengambil data todolist.");
            });
    }, [auth.user]);

    return (
        <MainLayout>
            <h1 className="text-2xl font-bold text-gray-900">Todolist</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <li key={task.id} className="p-2 border-b text-gray-800">
                            <strong>{task.title}</strong> - {task.category.name}
                        </li>
                    ))
                ) : (
                    <p className="text-gray-700">Tidak ada todo ditemukan.</p>
                )}
            </ul>
        </MainLayout>
    );
}
