import client from "~/http/client";
import type { Route } from "../_guest.events_.$slug.reviews.$id.edit/+types/route";
import { toast } from "sonner";
import { parseForm } from "~/lib/utils";
import { redirect } from "react-router";

export async function clientAction({ params, request }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);
    const promise = client.patch(`/api/events/${params.slug}/reviews/${params.id}`, credentials);

    toast.promise(promise, {
        loading: 'Editing review...',
        success: 'Review edited successfully!',
        error: 'Failed to edit review. Please try again.',
    });

    return redirect(`/events/${params.slug}`);
}