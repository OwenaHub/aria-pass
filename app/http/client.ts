import axios, { type AxiosError, type AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { API_URL, BASE_URL } from "~/config/defaults";
import { storageKeys } from "~/config/keys";

const client: AxiosInstance = axios.create({
    baseURL: `${API_URL}`,
    withCredentials: true,
    withXSRFToken: true,
});

client.interceptors.request.use((config) => {
    if (config.headers) {
        config.headers['X-Referer'] = BASE_URL;
    }
    return config;
});


client.interceptors.response.use((response) => response, async (error: AxiosError) => {
    if (import.meta.env.DEV) console.log(error);

    const status = error.response?.status;

    // Handle specific Axios error codes first
    if (error.code === "ERR_NETWORK") {
        toast.warning("No internet connection", {
            description: "Please check your connection and try again",
        });
        throw error;
    }

    switch (status) {
        case 500:
            toast.error("Server error 🔥", {
                description: "It's not you, it's us",
            });
            break;

        case 404:
            // Handle navigation logic
            const router = (window as any).router;
            if (router?.push) {
                router.push({ name: 'page-not-found' });
            } else {
                window.location.replace('/page-not-found');
            }
            break;

        case 419:
            toast.warning("Page expired", {
                description: "Session timed out due to inactivity",
                action: {
                    label: "Refresh",
                    onClick: () => window.location.reload(),
                },
            });
            break;
        case 401:
            Cookies.remove(storageKeys.user);
            break;

        default:
            // Optional: Handle other codes or do nothing
            break;
    }

    throw error;
});

export default client