import type { Route } from '../_user.events.toggle-like.$slug/+types/route'
import client from '~/http/client';
import { toast } from 'sonner';
import { redirect } from 'react-router';

export async function action({ params }: Route.ActionArgs) {
    const promise = client.post(`/api/events/${params.slug}/interested`);

    toast.promise(promise, {
        loading: 'Saving Event to your list',
        success: 'Event saved!',
        error: (err) => err.status === 401 ? 'You must be logged in.' : 'Something went wrong!',
    });

    try {
        await promise;
    } catch (error: any) {
        if (error.status === 401) {
            return redirect('/login');
        }
    }
    return null;
}
