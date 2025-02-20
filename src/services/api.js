// Import axios buat HTTP requests
import axios from "axios";

// Buat instance axios dengan baseURL dari environment variable
const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Middleware ini dipake buat nambahin token JWT ke tiap request
API.interceptors.request.use((config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("token");
    // Kalau token ada, set Authorization di headers
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug: cek headers yang dipake
    console.log("Headers:", config.headers);
    return config;
}, (error) => {
    // Kalau ada error, tolak promise-nya
    return Promise.reject(error);
});

// Export instance API yang udah di-set
export default API;

