import client from "~/http/client";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import dayjs from "dayjs";
import { STORAGE_URL } from "~/config/defaults";
import EventStatus from "~/components/utility/event-status";
import AddTicket from "./add-ticket";
import type { Route } from "../_user.my-events_.$slug/+types/route";
import { Link, redirect, type MetaFunction } from "react-router";
import { parseForm } from "~/lib/utils";
import formRequest from "~/http/form.request";
import { ArrowLeft, ArrowRight, Laptop, Share, Smartphone } from "lucide-react";
import TicketCard from "~/components/cards/ticket-card";
import UpdateEventStatus from "./update-event-status";
import { categorizeDevices } from "./analytics";
import { defaultMeta } from '~/lib/meta';
import MembersTable from "./members-table";
import FormatPrice from "~/components/utility/format-price";
import EventReview from "./event-reviews";
import NewTeammate from "~/components/custom/new-teammate";
import EventProgram from "~/components/custom/event-program";
import EventPlanBadge from "~/components/utility/event-plan-badge";

export const meta: MetaFunction = (args: any) => {
    if (!args.data.event) {
        return [
            { title: "AriaPass - Discover the community behind the concerts" },
        ];
    }
    const event = args.data.event;
    return [
        ...defaultMeta(args) || [],
        { title: `${event.title} | AriaPass` },
    ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    try {
        const res = await client.get(`api/organiser/events/${params.slug}`);
        return { event: res.data }
    } catch ({ response }: any) {
        toast.warning("Something broke", {
            description: response.data.message || ""
        })
        return redirect('/my-events')
    }
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
    const credentials = await parseForm(request)

    try {
        switch (credentials.type) {
            case 'ticket.edit':
                await formRequest(
                    credentials,
                    `organiser/events/${params.slug}/tickets/${credentials.ticket_id}`,
                    'PATCH'
                );
                toast.success("Ticket edited!");
                return;
            case 'ticket.create':
                await formRequest(credentials, `organiser/events/${params.slug}/tickets`, 'POST');
                toast.success("Ticket added!", {
                    description: 'Feel free to edit the content of your event ticket'
                });
                return;
            case 'ticket.delete':
                await client.delete(`/api/organiser/events/${params.slug}/tickets/${credentials.ticket_id}`)
                toast.warning("Ticket delete!", {
                    description: 'Ticket has been deleted with its related records'
                });
                return;
            case 'member.delete':
                let permission = confirm('Do you want to delete this member?');
                if (permission) {
                    await client.delete(`/api/organiser/events/${params.slug}/members/${credentials.memberId}`)
                    toast.warning("Member removed!", {
                        description: 'Member has been removed from the event'
                    });
                }
                return;
            default:
                toast.warning('No form action specified', {
                    description: 'Contact support concerning this'
                })
                break;
        };

        return redirect(`/my-events/${params.slug}`)
    } catch (error: any) {
        toast.warning('Something went wrong', {
            description: error
        });
        return
    }
}

export default function OrganiserEvent({ loaderData }: Route.ComponentProps) {
    const { event }: { event: OrganiserEvent } = loaderData;

    const FORMATTED_DATE = dayjs(event.date).format('MMMM D, YYYY');

    const TOTAL_TICKETS: number = event.tickets.reduce((sum: number, ticket: Ticket) => {
        return sum + ticket.quantityAvailable;
    }, 0);

    const TOTAL_TICKET_SOLD: number = event.tickets.reduce((sum: number, ticket: Ticket) => {
        return sum + ticket.ticketPurchases;
    }, 0);

    function sumPrices(purchases: TicketPurchase[]) {
        return purchases.reduce((total, item) => {
            const amount = parseFloat(item.amount) || 0;
            return total + amount;
        }, 0);
    }

    const SUM_AMOUNT = sumPrices(event.tickets.flatMap(ticket => ticket.purchases || []));

    return (
        <div>
            <Link to={"/my-events"} className="flex items-center gap-2 text-sm tracking-tighter">
                <ArrowLeft size={16} />
                <span>My Events</span>
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center gap-5 justify-between pt-5 pb-10">
                {/* Left side */}
                <div className="flex gap-6 flex-col lg:flex-row lg:items-start w-full md:pe-5 lg:border-e">
                    <div className="bg-gray-100 border rounded-md group-hover:opacity-85 aspect-auto h-40 min-w-30 max-w-30 overflow-hidden transition">
                        {event.bannerUrl && (
                            <img
                                src={event.bannerUrl && `${STORAGE_URL}/${event.bannerUrl}`}
                                alt={event.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className="flex justify-between  gap-2 items-center">
                            <EventStatus
                                date={event.date}
                                status={event.status}
                                startTime={event.startTime}
                            />

                            <div className="flex items-center gap-2">
                                <EventReview event={event} />

                                <Button variant={"outline"} size={"icon-sm"} onClick={() => {
                                    const shareData = {
                                        title: event.title,
                                        text: event.description,
                                        url: window.location.href
                                    };
                                    navigator.share(shareData);
                                }}>
                                    <Share />
                                </Button>
                            </div>
                        </div>
                        <h4 className='text-xl font-semibold tracking-tighter'>{event.title}</h4>
                        <p className='text-gray-700 text-sm tracking-tighter mb-5'>
                            {FORMATTED_DATE} at {event.startTime.split(":")[0]}:{event.startTime.split(":")[1]} ∙ {event.venueName}, <span className="capitalize">{event.city}, {event.country}</span>
                        </p>
                        <EventPlanBadge tier={event.eventPlan?.tier} />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex gap-3 items-start">
                    <Link to={"edit"}>
                        <Button variant={"outline"} size={"sm"}>
                            Edit
                        </Button>
                    </Link>
                    <AddTicket event={event} />
                    <UpdateEventStatus event={event} />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.isArray(event.tickets) && (event.tickets.length > 1 || event.tickets[0]?.price !== '0.00') && (
                    <>
                        <section className="flex flex-col gap-4 flex-1 bg-gray-100 p-4 rounded-xl">
                            <p className="text-sm flex items-center justify-between">
                                <span>Total revenue</span>
                                <Link to={`/spaces/${event.slug}`} className="bg-white rounded-full p-1">
                                    <ArrowRight className="size-4" />
                                </Link>
                            </p>
                            <p className="font-bold text-2xl">
                                <span className="text-xs text-muted-foreground">NGN</span>{' '}
                                <FormatPrice withSymbol={false} price={SUM_AMOUNT.toFixed(2)} />
                            </p>
                        </section>
                        <section className="flex flex-col gap-4 flex-1 bg-gray-100 p-4 rounded-xl">
                            <p className="text-sm">Tickets sold</p>
                            <div className="flex justify-between flex-wrap">
                                <p className="font-bold text-2xl">
                                    {TOTAL_TICKET_SOLD}/{TOTAL_TICKETS}
                                </p>
                                <div className="bg-white text-xs p-2 rounded-md hidden md:block">
                                    <span>{event.tickets.length} categories</span>
                                </div>
                            </div>
                        </section>
                    </>
                )}
                <section className="flex flex-col gap-4 flex-1 bg-gray-100 p-4 rounded-xl">
                    <p className="text-sm">Page views</p>
                    <div className="flex justify-between">
                        <p className="font-bold text-2xl">
                            {typeof event.views === 'object' && (event.views.length)}
                        </p>

                        <div className="flex items-end text-primary gap-4 bg-white px-2 rounded-md">
                            <div className="flex gap-1 items-center">
                                <span className="font-medium text-lg">
                                    {categorizeDevices(event.views as any[]).phone}
                                </span>
                                <Smartphone size={14} />
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="font-medium text-lg">
                                    {categorizeDevices(event.views as any[]).pc}
                                </span>
                                <Laptop size={14} />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="flex flex-col gap-4 flex-1 bg-gray-100 p-4 rounded-xl">
                    <p className="text-sm">User Engagements</p>

                    <p className="flex items-stretch gap-4">
                        <p className="font-bold text-2xl">
                            {event.reviews.length} <span className="text-xs text-muted-foreground font-medium">comments</span>
                        </p>
                        <div className="border-s" />
                        <p className="font-bold text-2xl">
                            {event.likes || "0"} <span className="text-xs text-muted-foreground font-medium">likes</span>
                        </p>
                    </p>
                </section>
            </div>

            <div className="rounded-xl p-4 flex flex-col gap-3 items-start bg-gray-100 mt-5">
                <p className="text-sm font-bold tracking-tight text-md">
                    Manage your event schedule <span className="inline-block px-1 py-0.5 text-[9px] font-bold bg-pink-500 text-white rounded">NEW!</span>
                </p>
                <p className="text-sm tracking-tight mb-3">
                    Your event program is sharable with the public and can be managed by others collaborating with you.
                </p>
                <EventProgram event={event} />
            </div>

            <div className="mt-10 text-sm relative">
                <h3 className="font-semibold">Event Tickets</h3>

                <div className="flex items-stretch gap-7 mt-5 overflow-x-auto pb-10">
                    {event.tickets.length
                        ? event.tickets.map(ticket =>
                            <TicketCard ticket={ticket} user="organiser" key={ticket.id} />
                        )
                        : <span className="text-xs border border-amber-800  bg-amber-50 p-3 rounded-lg inline-block">
                            <span className="font-bold">No tickets yet</span>
                            <br />
                            <span className="mt-2 inline-block">
                                If this is a Free Event, create a ticket with zero price named "Free Entry"
                            </span>
                        </span>
                    }

                </div>
                {event.tickets.length > 2 && (
                    <div className="rounded-full p-3 shadow-2xl absolute md:hidden top-1/2 -right-2 bg-gray-100">
                        <ArrowRight />
                    </div>
                )}
            </div>

            <div className="mt-5 text-sm relative">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold">Staff/Performers</h3>
                    <NewTeammate events={[event]} />
                </div>

                <div className="flex items-stretch gap-7 mt-5 overflow-x-auto pb-10 border-b ">
                    {event.members?.length
                        ? <MembersTable members={event.members} />
                        : <span className="text-gray-400 text-xs max-w-xs inline-block">
                            No members added
                        </span>
                    }
                </div>
            </div>
        </div>
    )
}
