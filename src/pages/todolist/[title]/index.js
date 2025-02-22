import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import API from "@/services/api";
import useAuthRedirect from "@/middleware/authMiddleware";
import MainLayout from "@/components/templates/MainLayout";
import PageHeader from "@/components/molecules/PageHeader";

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
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        categoryId: "",
        image: null,
    });

    useEffect(() => {
        if (!title || !auth.user?.id) return;
        const formattedTitle = toTitleCase(title);
        fetchTodolistByTitle(auth.user.id, formattedTitle);
        fetchCategories();
    }, [title, auth.user]);

    const fetchTodolistByTitle = async (userId, searchTitle) => {
        try {
            const res = await API.get(`/todolist/user/${userId}/search?title=${encodeURIComponent(searchTitle)}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (res.data.data.length > 0) {
                setTask(res.data.data[0]);
                setFormData({
                    title: res.data.data[0].title,
                    description: res.data.data[0].description,
                    categoryId: res.data.data[0].category?.id || "",
                    image: null,
                });
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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const handleUpdateTodolist = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("username", auth.user.username);
        formDataToSend.append("categoryId", formData.categoryId);
        formDataToSend.append("isCompleted", false);
        if (formData.image) {
            formDataToSend.append("imagePath", formData.image);
        }

        // for (let pair of formDataToSend.entries()) {
        //     console.log(pair[0] + ": " + pair[1]);
        // }

        try {
            const response = await API.put(`/todolist/${task.id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMessage("Todolist berhasil diperbarui!");
            setTimeout(() => {
                router.push("/todolist");
            }, 1000);
        } catch (err) {
            setError("Gagal memperbarui todolist.");
        }
    };


    const handleMarkCompleted = async () => {
        try {
            await API.put(
                `/todolist/${task.id}/complete`,
                {},
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setTask((prev) => ({ ...prev, completed: true }));
        } catch (err) {
            setError("Gagal menyelesaikan tugas.");
        }
    };

    const handleSoftDeleteTodolist = async (id) => {
        try {
            await API.put(`/todolist/softdel/${id}`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setSuccessMessage("Todolist berhasil dipindahkan ke trash!");
            setTimeout(() => {
                router.push("/todolist");
            }, 1000);

        } catch (err) {
            setError("Gagal menghapus todolist.");
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) return <p className="text-gray-700">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!task) return <p className="text-gray-700">Todolist tidak ditemukan.</p>;

    return (
        <MainLayout>
            <PageHeader title={isEditing ? "Edit Todolist" : "Detail Todolist"} />

            {isEditing ? (
                <form onSubmit={handleUpdateTodolist} className="p-6 bg-white text-gray-800 rounded-lg shadow-lg space-y-4">
                    {successMessage && (
                        <div className="p-3 mb-4 text-green-700 bg-green-200 border border-green-400 rounded">
                            {successMessage}
                        </div>
                    )}
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded text-gray-700"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded text-gray-700"
                        required
                    />
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded text-gray-700"
                        required
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {/* <input type="file" name="imagePath" onChange={handleFileChange} className="w-full p-2 border rounded" /> */}
                    <div className="flex gap-3">
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                            Simpan
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            ) : (
                <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg">
                    {successMessage && (
                        <div className="p-3 mb-4 text-green-700 bg-green-200 border border-green-400 rounded">
                            {successMessage}
                        </div>
                    )}
                    <h1 className="text-2xl font-bold">{task.title}</h1>
                    <p className="text-gray-700">{task.description || "Tidak ada deskripsi"}</p>
                    <p className="text-sm text-gray-600 mt-2">Kategori: {task.category?.name || "Tanpa Kategori"}</p>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleEditClick}
                            className="bg-yellow-500 px-4 py-2 text-white rounded-md hover:bg-yellow-600 transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleSoftDeleteTodolist(task.id)}
                            className="bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600 transition"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
