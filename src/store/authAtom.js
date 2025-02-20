import { atom } from "jotai";

// Ini bikin atom state buat nyimpen info user sama token
export const authAtom = atom({
    user: null,
    token: null, // nanti diisi pas dapet token abis login
});