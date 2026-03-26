import client from '~/http/client';
import type { Route } from '../_user.my-events_.$slug.status/+types/route';
import { toast } from 'sonner';
import { redirect } from 'react-router';
import { parseForm } from '~/lib/utils';

export async function action({ params, request }: Route.ActionArgs) {
    const data = await parseForm(request)

    const promise = client.patch(`/api/organiser/events/${params.slug}/status`, data);

    toast.promise(promise, {
        loading: 'Updating event status',
        success: 'Status updated successfully',
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
