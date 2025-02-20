import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import AuthLayout from "@/components/templates/AuthLayout";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // buat notifikasi sukses

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
            {
                username,
                email,
                password,
            },
            {
                validateStatus: (status) => status < 500,
            }
        )
            .then((res) => {
                if (res.status === 409) {
                    setError(res.data.data || "Username or email already exists.");
                } else if (res.status === 400) {
                    setError(res.data.data || "Invalid request.");
                } else {
                    setSuccessMessage("Registration successful! Redirecting to login...");

                    // redirect ke login 3 detik
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 3000);
                }
            })
            .catch((err) => {
                setError("An unexpected error occurred. Please try again.");
            });
    };


    return (
        <AuthLayout>
            <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

            {/* nampilin notif sukses */}
            {successMessage && (
                <div className="p-3 mb-4 text-green-700 bg-green-200 border border-green-400 rounded">
                    {successMessage}
                </div>
            )}

            {/* nampilin error, kalau ada */}
            {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-200 border border-red-400 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 border rounded text-gray-700 placeholder-gray-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded text-gray-700 placeholder-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                    Register
                </button>
            </form>
            <p className="text-sm text-center mt-2 text-gray-700">
                Sudah punya akun?
                <Link href="/auth/login" className="text-blue-500"> Login</Link>
            </p>
        </AuthLayout>
    );
}
