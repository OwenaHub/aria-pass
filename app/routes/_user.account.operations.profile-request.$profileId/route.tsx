import client from "~/http/client";
import type { Route } from "../_user.account.operations.profile-request.$profileId/+types/route";
import { toast } from "sonner";
import { parseForm } from "~/lib/utils";

export async function action({ params, request }: Route.ActionArgs) {
    const data = await parseForm(request);

    const promise = new Promise(async (resolve, reject) => {
        try {
            await client.patch(`/api/admin/organiser-profiles/${params.profileId}`, data);
            resolve('Profile updated!');
        } catch (error) {
            reject(error);
        }
    });

    toast.promise(promise, {
        loading: 'Updating Profile',
        success: (message) => message as string,
        error: 'An error occured!',
    });

    return null;
}