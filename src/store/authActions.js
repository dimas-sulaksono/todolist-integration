import { authAtom } from "@/store/authAtom";

export const logout = (setAuth, router) => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null });
    router.push("/auth/login");
};
