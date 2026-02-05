import client from "~/http/client";
import type { Route } from "../_user.spaces_.$slug/+types/route";
import { toast } from "sonner";
import { redirect } from "react-router";
import PurchasesTable from "./purchase-table";
import { getEventRevenue } from "~/lib/utils";
import EventReview from "./event-reviews";
import FormatPrice from "~/components/utility/format-price";
import SpaceUsers from "./space-users";
import { Banknote, Star, Users } from "lucide-react";
import EventProgram from "~/components/custom/event-program";

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
            {/* Header */}
            <section className="mx-auto mb-10">
                <p className="text-gray-500 mb-1 text-sm  md:text-base">Event Space</p>
                <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                    {space.title}
                </h1>
            </section>

            {/* Card header */}
            <section className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="flex flex-col bg-gray-100 gap-5 rounded-lg p-4 flex-1 overflow-hidden relative">
                    <p className="text-xs text-gray-500">Total Revenue</p>

                    <h2 className="text-lg font-medium tracking-tight">
                        <FormatPrice price={getEventRevenue(space)} />
                    </h2>

                    <Banknote
                        className="inline-block absolute right-4 -bottom-10 size-28 rotate-45 opacity-20"
                        strokeWidth={0.5}
                    />
                </div>

                <div className="flex flex-col bg-gray-100 gap-5 rounded-lg p-4 flex-1 overflow-hidden relative">
                    <p className="text-xs text-gray-500">Collaborators</p>

                    <SpaceUsers space={space} />

                    <Users
                        className="inline-block absolute right-28 -bottom-8 size-28 opacity-20"
                        strokeWidth={0.5}
                    />
                </div>

                <div className="flex flex-col bg-gray-100 gap-5 rounded-lg p-4 flex-1 overflow-hidden relative">
                    <p className="text-xs text-gray-500">Reviews</p>

                    <h2 className="text-lg font-medium tracking-tight">
                        <EventReview event={space} />
                    </h2>

                    <Star
                        className="inline-block absolute right-4 -bottom-8 size-28 opacity-20"
                        strokeWidth={0.5}
                    />
                </div>
            </section>

            <div className="pt-5">
                <EventProgram event={space} />
            </div>

            <section>
                <PurchasesTable event={space} />
            </section>
        </div>
    )
}
