import { redirect } from "react-router";
import { toast } from "sonner";
import client from "~/http/client";
import type { Route } from "../_user.my-events.members/+types/route";
import { parseForm } from "~/lib/utils";

export async function clientAction({ request }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);

    const promise = client.post(
        `/api/organiser/events/${credentials.event_slug}/members`, {
        ...credentials
    });

    toast.promise(promise, {
        loading: 'Processing request',
        success: 'New member added',
        error: (data: { response: any }) => {
            return `${data?.response?.data?.message || 'Please try again later'}`;
        },
    });

    return redirect(`/my-events/${credentials.event_slug}`);
}