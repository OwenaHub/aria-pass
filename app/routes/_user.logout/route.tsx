import { redirect } from "react-router";
import { toast } from "sonner";
import client from "~/http/client";
import type { Route } from "../_user.logout/+types/route";

export async function action({ }: Route.ActionArgs) {
    const promise = client.post('/api/logout');

    toast.promise(promise, {
        loading: 'Processing request',
        success: 'You have logged out!',
        error: 'Failed to log out. Please try again.',
    });

    return redirect('/login');
}