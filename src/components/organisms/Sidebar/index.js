import Link from "next/link";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API from "@/services/api";
import useAuthRedirect from "@/middleware/authMiddleware";

export default function Sidebar() {
    useAuthRedirect();
    const [auth] = useAtom(authAtom);
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        if (!auth.user?.username) return;
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
        }
    };

    return (
        <aside className="w-64 bg-white shadow-md min-h-screen p-4">
            <nav className="space-y-4">
                {userRole === "ADMIN" && (
                    <Link href="/todolist/dashboard" className="block p-2 text-gray-700 hover:bg-gray-200 rounded font-bold">
                        Dashboard
                    </Link>
                )}
                <Link href="/todolist" className="block p-2 text-gray-700 hover:bg-gray-200 rounded font-bold">
                    Todolist
                </Link>
                <Link href="/todolist/trash" className="block p-2 text-gray-700 hover:bg-gray-200 rounded font-bold">
                    Trash
                </Link>
                <Link href={`/profile/${auth.user?.username}`} className="block p-2 text-gray-700 hover:bg-gray-200 rounded font-bold">
                    Profile
                </Link>
            </nav>
        </aside>
    );
}
