import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import AuthLayout from "@/components/templates/AuthLayout";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [auth, setAuth] = useAtom(authAtom);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Login dan dapatkan token
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
                username,
                password,
            });

            const token = res.data.data;
            console.log("Token diterima:", token);

            // Dapatkan userId berdasarkan username
            const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/id/${username}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userId = userRes.data.data; // User ID yang kita butuhkan
            console.log("User ID:", userId);

            // Simpan ke state global
            localStorage.setItem("token", token);
            setAuth({ user: { id: userId, username }, token });

            // Redirect ke halaman todolist
            router.push("/todolist");
        } catch (err) {
            setError(err.response?.data?.message || "Login gagal.");
        }
    };

    return (
        <AuthLayout>
            <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 border rounded text-gray-700"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
            <p className="text-sm text-center mt-2 text-gray-700">
                Belum punya akun? <Link href="/auth/register" className="text-blue-500">Register</Link>
            </p>
        </AuthLayout>
    );
}
