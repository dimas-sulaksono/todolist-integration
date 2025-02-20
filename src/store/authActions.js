import { authAtom } from "@/store/authAtom";

export const logout = (setAuth, router) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setAuth({ user: null, token: null });
    router.push("/auth/login");
};
