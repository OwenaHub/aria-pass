import client from "~/http/client";
import type { Route } from "../_guest.events_.$slug.review/+types/route";
import { toast } from "sonner";
import { parseForm } from "~/lib/utils";

export async function clientAction({ params, request }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);

    console.log('credentials', credentials);
    // return;

    const promise = client.post(`/api/events/${params.slug}/reviews`, credentials);

    toast.promise(promise, {
        loading: 'Posting review...',
        success: 'Review posted successfully!',
        error: 'Failed to post review. Please try again.',
    });

    return promise;
}