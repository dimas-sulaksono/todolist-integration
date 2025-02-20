import React from "react";
import { useRouter } from "next/router";

export default function CardTodolist({ task }) {
    const router = useRouter();

    const toSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim();

    };

    const slug = toSlug(task.title);

    return (
        <div
            className="flex justify-between items-center p-4 bg-white text-gray-900 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
            onClick={() => router.push(`/todolist/${slug}`)}
        >
            {/* <div
            className="flex justify-between items-center p-4 bg-white text-gray-900 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
            onClick={() => router.push(`/todolist/${task.id}`)}
        >             */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                    onChange={() => console.log("Tandai selesai:", task.id)}
                />

                <div>
                    <h2 className="text-lg font-semibold">{task.title}</h2>
                    <p className="text-sm text-gray-800">{task.description || "Tidak ada deskripsi"}</p>
                </div>
            </div>

            {/* <button
                className="text-gray-400 hover:text-yellow-400 transition"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("Tandai sebagai penting:", task.id);
                }}
            >
                ⭐
            </button> */}
        </div>
    );
}
