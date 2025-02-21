import Link from "next/link";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { useRouter } from "next/router";
import useAuthRedirect from "@/middleware/authMiddleware";


export default function Sidebar() {
    useAuthRedirect();
    const [auth] = useAtom(authAtom);
    const router = useRouter();

    return (
        <aside className="w-64 bg-white shadow-md min-h-screen p-4">
            <nav className="space-y-4">
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
