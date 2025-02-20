import { authAtom } from "@/store/authAtom";

/**
 * Fungsi untuk logout user dari aplikasi.
 * Fungsi ini akan menghapus token, user ID, dan username dari localStorage,
 * lalu mengatur state auth menjadi null dan mengarahkan user ke halaman login.
 * @param {function} setAuth fungsi untuk mengatur state auth
 * @param {NextRouter} router router Next.js
 */
export const logout = (setAuth, router) => {
    // Hapus token, user ID, dan username dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    // Atur state auth menjadi null
    setAuth({ user: null, token: null });

    // Arahkan user ke halaman login
    router.push("/auth/login");
};

