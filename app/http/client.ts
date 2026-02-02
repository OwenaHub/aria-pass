import axios, { type AxiosError, type AxiosInstance } from "axios";
import { toast } from "sonner";
import { API_URL, BASE_URL } from "~/config/defaults";

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

client.interceptors.response.use((response) => response,
    async (error: AxiosError) => {
        try {
            if (import.meta.env.DEV) console.log(error);

            if (error.response?.status === 500) {
                toast.error("Server error 🔥", {
                    description: "It's not you, it's us",
                })
            }

            if (error.response?.status === 404) {
                // Try named-route navigation if a global router is exposed, 
                // Otherwise fall back to full reload
                try {
                    // @ts-ignore
                    const router = (window as any).router;
                    if (router?.push) {
                        router.push({ name: 'page-not-found' });
                    } else {
                        window.location.replace('/page-not-found');
                    }
                } catch {
                    window.location.replace('/page-not-found');
                }
            }

            if (error.response?.status === 419) {
                toast.warning("Page expired", {
                    description: "Session timed out due to inactivity",
                    action: {
                        label: "Refresh",
                        onClick: () => window.location.reload(),
                    },
                })
            }

            if (error.code === "ERR_NETWORK") {
                toast.warning("No internet connection", {
                    description: "Please check your connection and try again",
                })
            }
        } catch (error) {
            if (import.meta.env.DEV) console.log(error);
        }
        throw error
    }
);

export default client