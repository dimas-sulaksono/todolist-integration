import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import AuthLayout from "@/components/templates/AuthLayout";

export default function Login() {
    const router = useRouter();
    const [auth, setAuth] = useAtom(authAtom);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        // direset setiap submit
        setError("");
        setSuccessMessage("");

        axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
            {
                username,
                password,
            },
            {
                validateStatus: (status) => status < 500, // handle error manual
            }
        )
            .then(async (res) => {
                if (res.status === 404) {
                    setError("User is not registered.");
                } else if (res.status === 401) {
                    setError("Invalid username or password.");
                } else {
                    const token = res.data.data;
                    // console.log("token:", token);

                    const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/id/${username}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const userId = userRes.data.data;
                    // console.log("User ID:", userId);

                    if (!token) {
                        setError("No token received. Please check the API response.");
                        return;
                    }

                    // nyimpen ke localStorage
                    localStorage.setItem("token", token);
                    localStorage.setItem("userId", userId);
                    localStorage.setItem("username", username);

                    // nyimpen user session ke state global pake jotai
                    setAuth((prev) => ({
                        user: { id: userId, username },
                        token: token,
                    }));

                    // nampilin pesan sukses selama 1 detik sebelum redirect
                    setSuccessMessage("Login Berhasil! Redirecting...");
                    setTimeout(() => {
                        router.push("/todolist");
                    }, 500);
                }
            })
            .catch((err) => {
                setError("An unexpected error occurred. Please try again.");
            });
    };



    return (
        <AuthLayout>
            <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

            {successMessage && (
                <div className="p-3 mb-4 text-green-700 bg-green-200 border border-green-400 rounded">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-200 border border-red-400 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 border rounded text-gray-700 placeholder-gray-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded text-gray-700 placeholder-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                    Login
                </button>
            </form>
            <p className="text-sm text-center mt-2 text-gray-700">
                Belum punya akun?
                <Link href="/auth/register" className="text-blue-500"> Register</Link>
            </p>
        </AuthLayout>
    );
}
