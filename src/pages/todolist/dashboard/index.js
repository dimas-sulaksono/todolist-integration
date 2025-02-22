import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { useRouter } from "next/router";
import API from "@/services/api";
import MainLayout from "@/components/templates/MainLayout";
import Link from "next/link";

export default function Dashboard() {
    const [auth] = useAtom(authAtom);
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.user?.username) {
            router.push("/auth/login");
            return;
        }
        fetchUserRole(auth.user.username);
    }, [auth]);

    const fetchUserRole = async (username) => {
        try {
            const res = await API.get(`/user/${username}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (res.data?.data?.role) {
                setUserRole(res.data.data.role);
            } else {
                setUserRole("USER");
            }
        } catch (err) {
            setUserRole("USER");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-gray-800">Loading...</p>;
    }

    if (userRole !== "ADMIN") {
        router.push("/todolist");
        return null;
    }

    return (
        <MainLayout>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Link href="/todolist/dashboard/all-todolist" className="block bg-blue-500 text-white p-4 rounded text-center">
                    Todolist
                </Link>
                <Link href="/todolist/dashboard/users" className="block bg-green-500 text-white p-4 rounded text-center">
                    User
                </Link>
                <Link href="/todolist/dashboard/category" className="block bg-yellow-500 text-white p-4 rounded text-center">
                    Category
                </Link>
            </div>
        </MainLayout>
    );
}
