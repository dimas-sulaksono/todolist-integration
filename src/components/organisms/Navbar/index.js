import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { logout } from "@/store/authActions";

export default function Navbar() {
    const router = useRouter();
    const [auth, setAuth] = useAtom(authAtom);

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between text-gray-900">
            <h1 className="text-lg font-semibold">Todolist App</h1>
            {auth.token && (
                <button
                    onClick={() => logout(setAuth, router)}
                    className="bg-red-500 min-w-32 text-white mr-2 px-4 py-2 rounded"
                >
                    Logout
                </button>
            )}
        </nav>
    );
}
