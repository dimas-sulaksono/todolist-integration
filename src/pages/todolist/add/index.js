import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import API from "@/services/api";
import MainLayout from "@/components/templates/MainLayout";
import { useRouter } from "next/router";
import useAuthRedirect from "@/middleware/authMiddleware";

export default function AddTodolist() {
    useAuthRedirect();
    const router = useRouter();
    const [auth] = useAtom(authAtom);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        API.get("/todolist/category")
            .then((res) => setCategories(res.data.data))
            .catch((err) => {
                setError("Gagal mengambil daftar kategori.");
            });
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!auth.user || !auth.user.username) {
            setError("User tidak ditemukan. Silakan login ulang.");
            return;
        }

        if (!title || !category) {
            setError("Judul dan kategori harus diisi.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("username", auth.user.username);
            formData.append("categoryId", category);
            formData.append("isCompleted", false);
            if (image) {
                formData.append("imagePath", image);
            }

            const res = await API.post("/todolist", formData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMessage("Todolist berhasil ditambahkan!");
            setTimeout(() => router.push("/todolist"), 1500);
        } catch (err) {
            setError("Gagal menambahkan todolist.");
        }
    };

    const handleBack = () => {
        router.back();
    };


    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Tambah Todolist</h1>
                <button
                    onClick={handleBack}
                    className="bg-blue-500 min-w-32 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Kembali
                </button>
            </div>

            {successMessage && <div className="p-3 mb-4 text-green-700 bg-green-200">{successMessage}</div>}
            {error && <div className="p-3 mb-4 text-red-700 bg-red-200">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Judul Todolist"
                    className="w-full p-2 border rounded text-gray-700"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Deskripsi"
                    className="w-full p-2 border rounded text-gray-700"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <select
                    className="w-full p-2 border rounded text-gray-700"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* <input
                    type="file"
                    accept="image/*"
                    className="w-full p-2 border rounded"
                    onChange={handleFileChange}
                /> */}

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Tambah Todolist
                </button>
            </form>
        </MainLayout>
    );
}
