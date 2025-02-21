import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import API from "@/services/api";
import MainLayout from "@/components/templates/MainLayout";

export default function UsersDashboard() {
    const [auth] = useAtom(authAtom);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

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

    return (
        <MainLayout>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Dashboard - Users</h1>

                {error && <p className="text-red-500">{error}</p>}

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
                                    <th className="border p-2 text-center">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <td className="border p-2">{user.username}</td>
                                            <td className="border p-2">{user.email}</td>
                                            <td className="border p-2">{user.role}</td>
                                            <td className="border p-2 text-center">
                                                {new Date(user.createdAt.join("-")).toLocaleDateString()}
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

                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 mx-2 border rounded-md ${currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2">
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        className={`px-4 py-2 mx-2 border rounded-md ${currentPage >= totalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
