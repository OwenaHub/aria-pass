import client from "~/http/client";
import type { Route } from "../_user.spaces_.$slug/+types/route";
import { toast } from "sonner";
import { redirect } from "react-router";
import PurchasesTable from "./purchase-table";
import { Button } from "~/components/ui/button"
import { Printer } from "lucide-react";
import { getEventRevenue } from "~/lib/utils";
import EventReview from "./event-reviews";
import FormatPrice from "~/components/utility/format-price";
import SpaceUsers from "./space-users";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    try {
        const res = await client.get(`api/organiser/events/${params.slug}`);

        return { space: res.data }
    } catch ({ response }: any) {
        toast.warning("Something broke", {
            description: response.data.message || ""
        })
        return redirect('/my-events')
    }
}

export default function EventSpaces({ loaderData }: Route.ComponentProps) {
    const { space }: { space: OrganiserEvent } = loaderData;

    return (
        <div>
            <section className="mx-auto mb-5">
                <p className="text-gray-500 mb-1 text-sm  md:text-base">Event Space</p>
                <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                    {space.title}
                </h1>
            </section>

            <section className="flex gap-4 items-stretch">
                <div className="border flex flex-col gap-5 rounded-lg p-4 flex-1">
                    <p className="text-xs text-gray-500">Total Revenue</p>

                    <h2 className="text-lg font-medium tracking-tight">
                        <FormatPrice price={getEventRevenue(space)} />
                    </h2>
                </div>

                <div className="border flex flex-col gap-5 rounded-lg p-4 flex-1">
                    <p className="text-xs text-gray-500">Collaborators</p>

                    <SpaceUsers space={space} />
                </div>

                <div className="border flex flex-col gap-5 rounded-lg p-4 flex-1">
                    <p className="text-xs text-gray-500">Reviews</p>

                    <h2 className="text-lg font-medium tracking-tight">
                        <EventReview event={space} />
                    </h2>
                </div>
            </section>

            <section className="border-b py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            className="rounded-lg shadow-none"
                            onClick={() => window.print()}
                        >
                            <Printer /> Print
                        </Button>
                    </div>

                </div>
            </section>

            <section>
                <PurchasesTable event={space} />
            </section>
        </div>
    )
}
