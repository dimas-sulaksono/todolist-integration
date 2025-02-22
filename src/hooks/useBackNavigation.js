import { useRouter } from "next/router";

export default function useBackNavigation() {
    const router = useRouter();

    const goBack = () => {
        if (typeof window !== "undefined") {
            router.back();
        }
    };

    return goBack;
}
