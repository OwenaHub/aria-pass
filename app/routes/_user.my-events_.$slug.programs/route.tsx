import { parseForm } from "~/lib/utils";
import type { Route } from "../_user.my-events_.$slug.programs/+types/route";
import { toast } from "sonner";
import formRequest from "~/http/form.request";

export async function clientAction({ request, params }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);

    if (credentials.type === 'program.delete' 
        && !confirm('Delete this program?')) {
        return null;
    }
    if (credentials.type === 'program.item.delete' 
        && !confirm('Delete this program item?')) {
        return null;
    }

    // 2. Create a promise that performs the action and resolves with the Success Message
    const actionPromise = (async () => {
        switch (credentials.type) {
            case 'program.create':
                await formRequest(credentials, `organiser/events/${params.slug}/programs`, 'POST');
                return "Program added!";
                
            case 'program.edit':
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}`, 'PATCH');
                return "Program updated!";

            case 'program.delete':
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}`, 'DELETE');
                return "Program deleted!";

            case 'program.item.create':
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}/items`, 'POST');
                return "Program item added!";

            case 'program.item.update':
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}/items/${credentials.item_id}`, 'PATCH');
                return "Program item updated!";

            case 'program.item.delete':
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}/items/${credentials.item_id}`, 'DELETE');
                return "Program item deleted!";

            default:
                throw new Error("No form action specified");
        }
    })();

    // 3. Pass the promise to Sonner
    toast.promise(actionPromise, {
        loading: 'Processing request...',
        success: (message) => message,
        error: (err) => err.message || 'Something went wrong',
    });

    return
}