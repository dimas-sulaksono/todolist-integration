import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Middleware untuk menambahkan token JWT di setiap request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Pastikan formatnya benar
    }
    console.log("Headers:", config.headers);
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
