import Cookies from "js-cookie";
import { storageKeys } from "~/config/keys";

export default function useRoute() {
    async function intendedRoute(path: string): Promise<void> {
        if (path === "/")
            path = "/dashboard";
        Cookies.set(storageKeys.route, path);
    }

    async function getIntentedRoute(): Promise<string> {
        const route = Cookies.get(storageKeys.route);
        Cookies.remove(storageKeys.route);
        return route || '/dashboard';
    }

    return { intendedRoute, getIntentedRoute };
}