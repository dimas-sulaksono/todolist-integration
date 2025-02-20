import { atom } from "jotai";

export const authAtom = atom({
    user: null,
    token: null,
});
