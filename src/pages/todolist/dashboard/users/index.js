import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import API from "@/services/api";
import MainLayout from "@/components/templates/MainLayout";
import { useRouter } from "next/router";
import PageHeader from "@/components/molecules/PageHeader";

export default function UsersDashboard() {
    const [auth] = useAtom(authAtom);
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        if (!auth.token) return;
        fetchUsers(currentPage);
    }, [auth.token, currentPage]);

    const fetchUsers = async (page) => {
        try {
            const res = await API.get(`/user?page=${page}&size=5`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (Array.isArray(res.data.data)) {
                setUsers(res.data.data);
                setTotalPages(res.data.totalPages);
            } else {
                setError("Data tidak berbentuk array");
                setUsers([]);
            }
        } catch (err) {
            setError("Gagal mengambil data user.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId, currentRole) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        const confirmChange = window.confirm(
            `Apakah Anda yakin ingin mengubah role user ini menjadi ${newRole}?`
        );

        if (!confirmChange) return;

        try {
            await API.put(
                `/user/update/${userId}`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );

            setSuccessMessage(`Role berhasil diubah menjadi ${newRole}`);
            setTimeout(() => {
                setSuccessMessage("");
            }, 1500);

            fetchUsers(currentPage);
        } catch (err) {
            setError("Gagal memperbarui role user.");
        }
    };

    const handleDeleteUser = async (userId, username) => {
        const confirmDelete = window.confirm(
            `Apakah Anda yakin ingin menghapus user ${username} secara permanen?`
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/user/delete/${userId}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setSuccessMessage(`User ${username} berhasil dihapus!`);
            setTimeout(() => {
                setSuccessMessage("");
            }, 1500);

            fetchUsers(currentPage);
        } catch (err) {
            setError("Gagal menghapus user.");
        }
    };

    const handleEditUser = (user) => {
        setEditUser({ ...user, password: "" });
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();

        if (!editUser.username) {
            setError("Username tidak boleh kosong.");
            return;
        }

        try {
            await API.put(`/user/update/${editUser.uuid}`, editUser, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setSuccessMessage("User berhasil diperbarui!");
            setTimeout(() => {
                setSuccessMessage("");
                setEditUser(null);
            }, 1500);

            fetchUsers(currentPage);
        } catch (err) {
            setError("Gagal memperbarui user.");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery) {
            fetchUsers(currentPage);
            return;
        }

        try {
            setLoading(true);
            const res = await API.get(`/user/search/${searchQuery}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (res.data.data.content.length > 0) {
                setUsers(res.data.data.content);
                setTotalPages(res.data.data.totalPages);
            } else {
                setUsers([]);
                setTotalPages(1);
            }
        } catch (err) {
            setError("Gagal mencari user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <PageHeader title="Dashboard - Users" />

                {successMessage && (
                    <p className="p-3 mb-4 text-green-700 bg-green-200 border border-green-400 rounded">
                        {successMessage}
                    </p>
                )}
                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
                    <input
                        type="text"
                        placeholder="Cari username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded text-gray-700"
                    />
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    >
                        Cari
                    </button>
                </form>

                {loading ? (
                    <p className="text-gray-700">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-gray-800">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2 text-left">Username</th>
                                    <th className="border p-2 text-left">Email</th>
                                    <th className="border p-2 text-left">Role</th>
                                    <th className="border p-2 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <td className="border p-2">{user.username}</td>
                                            <td className="border p-2">{user.email}</td>
                                            <td className="border p-2">{user.role}</td>
                                            <td className="border p-2 text-center space-x-2">
                                                <button
                                                    onClick={() => handleUpdateRole(user.uuid, user.role)}
                                                    className={`px-3 py-1 rounded-md transition text-white ${user.role === "ADMIN"
                                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                                        : "bg-green-500 hover:bg-green-600"
                                                        }`}
                                                >
                                                    Ganti Role
                                                    {/* Jadikan {user.role === "ADMIN" ? "User" : "Admin"} */}
                                                </button>
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.uuid, user.username)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="border p-2 text-center text-gray-500">
                                            Tidak ada user ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {editUser && (
                    <div className="mt-6 p-4 bg-gray-100 border rounded">
                        <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                        <form onSubmit={handleSaveUser} className="space-y-3">
                            <input
                                type="text"
                                name="username"
                                value={editUser.username}
                                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                className="w-full p-2 border rounded text-gray-700"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password (opsional)"
                                value={editUser.password}
                                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                className="w-full p-2 border rounded text-gray-700"
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                            >
                                Simpan
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditUser(null)}
                                className="bg-blue-500 text-white ml-4 px-4 py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                Batal
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 mx-2 border rounded-md ${currentPage === 0 ? "bg-gray-300 text-gray-800" : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 text-gray-800">{currentPage + 1} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        className={`px-4 py-2 mx-2 border rounded-md ${currentPage >= totalPages - 1 ? "bg-gray-300  text-gray-800" : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Next
                    </button>
                </div>

            </div>
        </MainLayout>
    );
}
