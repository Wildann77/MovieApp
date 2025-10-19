import axios from "axios";
import { useStore } from "@/store/store";

// 1. Base URL dari environment variable dengan fallback
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// 2. Konfigurasi default axios
const API = axios.create({
    baseURL,
    withCredentials: true, // biar cookie (session) ikut terkirim
    timeout: 10000,        // batas waktu request 10 detik
});

// 3. Interceptor untuk REQUEST
// Menyisipkan token Authorization kalau ada di state (Zustand store)
API.interceptors.request.use((config) => {
    const token = useStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    
    return config;
});

// 4. Interceptor untuk RESPONSE
// Menangani semua response dengan format yang konsisten
API.interceptors.response.use(
    (response) => {
        const backendData = response.data;
        
        // Semua backend response memiliki format: { success: true, message: "...", data: {...}, pagination: {...} }
        if (backendData && typeof backendData === 'object' && backendData.success !== undefined) {
            console.log("Axios interceptor - Backend response detected:", {
                url: response.config.url,
                success: backendData.success,
                hasData: 'data' in backendData,
                hasPagination: 'pagination' in backendData
            });
            
            // Jika ada data, extract data field
            if ('data' in backendData) {
                const extractedData = backendData.data;
                
                // Jika ada pagination, include sebagai pagination
                if (backendData.pagination) {
                    return {
                        ...response,
                        data: {
                            data: extractedData,
                            pagination: backendData.pagination
                        }
                    };
                }
                
                // Jika tidak ada pagination, return data langsung
                return {
                    ...response,
                    data: extractedData
                };
            }
            
            // Jika tidak ada data field, return response as-is
            return response;
        }
        
        // Fallback: return original response jika format berbeda
        return response;
    },
    (error) => {
        const { data, status } = error.response || {};

        // Handle 401 errors (unauthorized) - clear token and redirect to login
        if (status === 401) {
            const { clearAccessToken } = useStore.getState();
            clearAccessToken();
            // Don't redirect automatically, let components handle it
        }

        // Bikin error object lebih konsisten
        const customError = {
            ...error,
            errorCode: data?.errorCode || "UNKNOWN_ERROR",
            message: data?.message || error.message,
            status,
        };

        return Promise.reject(customError);
    }
);

export default API;
