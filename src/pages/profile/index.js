import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import API from "@/services/api";
import { authAtom } from "@/store/authAtom";
import MainLayout from "@/components/templates/MainLayout";

export default function Profile() {
    const [auth, setAuth] = useAtom(authAtom);
    const [name, setName] = useState(auth.user?.name || "");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!auth.user) return;
        setName(auth.user.name);
    }, [auth.user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put("/auth/profile", { name, password });
            setAuth({ ...auth, user: res.data.user });
            setMessage("Profile updated successfully!");
        } catch (err) {
            setMessage("Failed to update profile.");
        }
    };

    return (
        <MainLayout>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            {message && <p className="text-green-500">{message}</p>}
            <form onSubmit={handleUpdate} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nama"
                    className="w-full p-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password (Optional)"
                    className="w-full p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                    Update Profile
                </button>
            </form>
        </MainLayout>
    );
}
