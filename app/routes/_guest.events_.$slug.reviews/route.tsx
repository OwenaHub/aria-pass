import client from "~/http/client";
import type { Route } from "../_guest.events_.$slug.reviews/+types/route";
import { toast } from "sonner";
import { parseForm } from "~/lib/utils";
import { redirect } from "react-router";

export async function clientAction({ params, request }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);

    const promise = client.post(`/api/events/${params.slug}/reviews`, credentials);

    toast.promise(promise, {
        loading: 'Posting review...',
        success: 'Review posted successfully!',
        error: 'Failed to post review. Please try again.',
    });

    return redirect(`/events/${params.slug}`);
}