import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white shadow-md min-h-screen p-4">
            <nav className="space-y-4">
                <Link href="/todolist" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">
                    Todolist
                </Link>
                <Link href="/todolist/trash" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">
                    Trash
                </Link>
                <Link href="/profile" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">
                    Profile
                </Link>
            </nav>
        </aside>
    );
}
