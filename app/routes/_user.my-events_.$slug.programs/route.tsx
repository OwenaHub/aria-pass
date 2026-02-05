import { parseForm } from "~/lib/utils";
import type { Route } from "../_user.my-events_.$slug.programs/+types/route";
import { toast } from "sonner";
import formRequest from "~/http/form.request";
import { redirect } from "react-router";

export async function clientAction({ request, params }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);

    try {
        switch (credentials.type) {
            case 'program.create':
                await formRequest(credentials, `organiser/events/${params.slug}/programs`, 'POST');
                toast.success("Program added!", {
                    description: 'Kindly add items to the program'
                });
                return;
            case 'program.edit':
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}`, 'PATCH');
                toast.success("Program updated!", {
                    description: 'Feel free to edit the content of your event program'
                });
                return;
            case 'program.delete':
                let programDeletePermission = confirm('Delete this program?');
                if (programDeletePermission) {
                    await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}`, 'DELETE');
                    toast.error("Program deleted!");
                }
                return;
            case 'program.item.create':
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}/items`, 'POST');
                toast.success("Program item added!", {
                    description: 'Feel free to edit the content of your event program item'
                });
                return;
            case 'program.item.update':
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}/items/${credentials.item_id}`, 'PATCH');
                toast.success("Program item updated!");
                return;
            case 'program.item.delete':
                let programItemDeletePermission = confirm('Delete this program item?');
                if (programItemDeletePermission) {
                    await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}/items/${credentials.item_id}`, 'DELETE');
                    toast.error("Program item deleted!");
                }
                return;
            default:
                toast.warning('No form action specified', {
                    description: 'Contact support concerning this'
                })
                break;
        }

        return redirect(`/my-events/${params.slug}/programs`);
    } catch (error: any) {
        toast.warning('Something went wrong', {
            description: error?.message
        });
        return
    }
}