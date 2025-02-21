import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import API from "@/services/api";
import useAuthRedirect from "@/middleware/authMiddleware";
import MainLayout from "@/components/templates/MainLayout";
import { logout } from "@/store/authActions";

export default function ProfilePage() {
    useAuthRedirect();
    const router = useRouter();
    const { username } = router.query;
    const [auth, setAuth] = useAtom(authAtom);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("userDetail");
    const [confirmUsernameChange, setConfirmUsernameChange] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [newUsername, setNewUsername] = useState(username || "");

    useEffect(() => {
        if (!username) return;
        fetchUserProfile(username);
    }, [username]);

    const fetchUserProfile = async (username) => {
        try {
            const res = await API.get(`/user/${username}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setProfile(res.data.data);
        } catch (err) {
            // setError("Gagal mengambil data profil.");
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError("");

        if (passwordData.newPassword.length < 8) {
            setError("Password baru minimal 8 karakter.");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Password baru tidak cocok.");
            return;
        }

        try {
            await API.put(`/user/update/${auth.user.id}`, passwordData, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setSuccessMessage("Password berhasil diperbarui!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setError("Gagal memperbarui password.");
        }
    };

    const updateUsername = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError("");

        if (!confirmUsernameChange) {
            setConfirmUsernameChange(true);
            return;
        }

        try {
            const res = await API.put(`/user/update/${auth.user.id}`, { username: newUsername }, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            // await setAuth((prev) => ({
            //     ...prev,
            //     user: { ...prev.user, username: newUsername },
            // }));

            // localStorage.setItem("username", newUsername);

            setSuccessMessage("Username berhasil diperbarui! Anda akan dialihkan ke halaman login.");
            // setConfirmUsernameChange(false);

            setTimeout(() => {
                logout(setAuth, router)
            }, 3000);

        } catch (err) {
            setError("Gagal memperbarui username.");
        }
    };

    if (!profile) return <p className="text-gray-800">Loading...</p>;

    return (
        <MainLayout>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Profile</h1>

                <div className="border-b mb-4 flex space-x-6">
                    <button
                        onClick={() => setActiveTab("userDetail")}
                        className={`pb-2 ${activeTab === "userDetail" ? "border-b-2 border-blue-500 font-bold text-gray-900" : "text-gray-900"}`}
                    >
                        User Detail
                    </button>
                    <button
                        onClick={() => setActiveTab("ubahPassword")}
                        className={`pb-2 ${activeTab === "ubahPassword" ? "border-b-2 border-blue-500 font-bold  text-gray-900" : " text-gray-900"}`}
                    >
                        Ubah Password
                    </button>
                    <button
                        onClick={() => setActiveTab("ubahUsername")}
                        className={`pb-2 ${activeTab === "ubahUsername" ? "border-b-2 border-blue-500 font-bold  text-gray-900" : " text-gray-900"}`}
                    >
                        Ubah Username
                    </button>
                </div>

                {successMessage && <p className="p-3 text-green-700 bg-green-200 border border-green-400 rounded mb-3 mt-2">{successMessage}</p>}
                {error && <p className="p-3 text-red-700 bg-red-200 border border-red-400 rounded">{error}</p>}

                {activeTab === "userDetail" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Username</label>
                                <input type="text" value={profile.username} className="w-full p-2 border rounded bg-gray-100  text-gray-700" disabled />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input type="text" value={profile.email} className="w-full p-2 border rounded bg-gray-100 text-gray-700" disabled />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700">Role</label>
                            <input type="text" value={profile.role} className="w-full p-2 border rounded bg-gray-100 text-gray-700" disabled />
                        </div>
                    </div>
                )}

                {activeTab === "ubahPassword" && (
                    <form onSubmit={updatePassword} className="space-y-4">
                        <input type="password" name="currentPassword" placeholder="Current Password" onChange={handlePasswordChange} className="w-full p-2 border rounded text-gray-700" required />
                        <input type="password" name="newPassword" placeholder="New Password" onChange={handlePasswordChange} className="w-full p-2 border rounded text-gray-700" required />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handlePasswordChange} className="w-full p-2 border rounded text-gray-700" required />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Ubah Password</button>
                    </form>
                )}

                {activeTab === "ubahUsername" && (
                    <form onSubmit={updateUsername} className="space-y-4">
                        <input type="text" name="newUsername" placeholder="New Username" value={newUsername} onChange={handleUsernameChange} className="w-full p-2 border rounded text-gray-700" required />
                        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition">
                            {confirmUsernameChange ? "Konfirmasi Ubah Username" : "Ubah Username"}
                        </button>
                    </form>
                )}
            </div>
        </MainLayout>
    );
}
