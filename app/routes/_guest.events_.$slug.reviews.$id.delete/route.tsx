import client from "~/http/client";
import type { Route } from "../_guest.events_.$slug.reviews.$id.edit/+types/route";
import { toast } from "sonner";
import { redirect } from "react-router";

export async function clientAction({ params }: Route.ClientActionArgs) {

    if (!confirm('Delete this comment permanently?')) return;

    const promise = client.delete(`/api/events/${params.slug}/reviews/${params.id}`);

    toast.promise(promise, {
        loading: 'Deleting review...',
        success: 'Review deleted successfully!',
        error: 'Failed to delete review. Please try again.',
    });
    return redirect(`/events/${params.slug}`);
}