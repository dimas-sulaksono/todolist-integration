import { useAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useAuthRedirect() {
    const [auth] = useAtom(authAtom);
    const router = useRouter();

    useEffect(() => {
        if (!auth.token) {
            router.push("/auth/login");
        }
    }, [auth, router]);
}
