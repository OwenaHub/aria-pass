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
import { ArrowLeft, ArrowRight, ChevronDown, Laptop, Share, Smartphone } from "lucide-react";
import TicketCard from "~/components/cards/ticket-card";
import UpdateEventStatus from "./update-event-status";
import { categorizeDevices } from "./analytics";
import { defaultMeta } from '~/lib/meta';
import MembersTable from "./members-table";
import FormatPrice from "~/components/utility/format-price";
import EventReview from "./event-reviews";
import NewTeammate from "~/components/custom/new-teammate";
import EventProgram from "../_user.spaces_.$slug/event-program";

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
            case 'program.create':
                console.log(credentials);
                await formRequest(credentials, `organiser/events/${params.slug}/programs`, 'POST');
                toast.success("Program added!", {
                    description: 'Feel free to edit the content of your event program'
                });
                return;
            case 'program.edit':
                console.log(credentials);
                await formRequest(credentials, `organiser/events/${params.slug}/programs/${credentials.program_id}`, 'PATCH');
                toast.success("Program updated!", {
                    description: 'Feel free to edit the content of your event program'
                });
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
    console.log(event);

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

    // const PURCHASES = getPurchases(event.tickets);
    const SUM_AMOUNT = sumPrices(event.tickets.flatMap(ticket => ticket.purchases || []));

    return (
        <div>
            <Link to={"/my-events"} className="flex items-center gap-2 text-sm">
                <ArrowLeft size={16} />
                <span>My Events</span>
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center gap-5 justify-between pt-5 pb-10">
                {/* Left side */}
                <div className="flex gap-6 flex-col lg:flex-row lg:items-center w-full md:pe-5 lg:border-e">
                    <div className="bg-gray-100 border rounded-md group-hover:opacity-85 aspect-video h:50 lg:h-25 overflow-hidden transition">
                        {event.bannerUrl && (
                            <img
                                src={event.bannerUrl && `${STORAGE_URL}/${event.bannerUrl}`}
                                alt={event.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        )}
                    </div>
                    <div className='flex  flex-col gap-2'>
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
                        <h4 className='text-xl font-semibold'>{event.title}</h4>
                        <p className='text-gray-700 text-sm'>
                            {FORMATTED_DATE} at {event.startTime.split(":")[0]}:{event.startTime.split(":")[1]} ∙ {event.venueName}, <span className="capitalize">{event.city}, {event.country}</span>
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex gap-3 items-start">
                    <Link to={"edit"}>
                        <Button variant={"outline"} size={"sm"}>
                            Edit
                        </Button>
                    </Link>
                    <AddTicket />
                    <UpdateEventStatus event={event} />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:gap-10 items-stretch">
                <section className="flex flex-col gap-4 flex-1 border-t py-5">
                    <p className="text-sm">Total revenue</p>
                    <p className="font-bold text-2xl">
                        <span className="text-xs text-muted-foreground">NGN</span>{' '}
                        <FormatPrice withSymbol={false} price={SUM_AMOUNT.toFixed(2)} />
                    </p>
                </section>
                <section className="flex flex-col gap-4 flex-1 border-t py-5">
                    <p className="text-sm">Tickets sold</p>
                    <div className="flex justify-between">
                        <p className="font-bold text-2xl">
                            {TOTAL_TICKET_SOLD}/{TOTAL_TICKETS}
                        </p>
                        <Button variant={"secondary"} size={"sm"} className="text-xs p-0">
                            <span>{event.tickets.length} categories</span>
                            <ChevronDown size={16} />
                        </Button>
                    </div>
                </section>
                <section className="flex flex-col gap-4 flex-1 border-t py-5">
                    <p className="text-sm">Page views</p>
                    <div className="flex justify-between">
                        <p className="font-bold text-2xl">
                            {typeof event.views === 'object' && (event.views.length)}
                        </p>

                        <div className="flex items-end text-primary gap-4 bg-accent px-2 rounded-md">
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
                <section className="flex flex-col gap-4 flex-1 border-t py-5">
                    <p className="text-sm">User Engagements</p>

                    <p className="flex items-stretch gap-4">
                        <p className="font-bold text-2xl">
                            {event.reviews.length} <span className="text-xs text-muted-foreground font-medium">comments</span>
                        </p>
                        <div className="border-s" />
                        <p className="font-bold text-2xl">
                            {event.likes || "0"} <span className="text-xs text-muted-foreground font-medium">user(s) saved event</span>
                        </p>
                    </p>
                </section>
            </div>

            <div className="rounded-xl p-4 flex flex-col gap-3 items-start bg-gray-100">
                <p className="text-sm font-bold tracking-tight text-md">
                    Manage your event schedule <span className="inline-block px-1 py-0.5 text-xs font-bold bg-pink-500 text-white rounded">NEW!</span>
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
                        : <span className="text-gray-400 text-xs max-w-xs inline-block">
                            No tickets yet <br />
                            <span className="text-amber-800 bg-amber-100 px-2 py-1 rounded-md mt-2 inline-block">
                                If this is a <b>Free Event</b>, create a ticket with zero price named "Free Entry"
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
                            No members yet <br />
                            <span className="text-amber-800 bg-amber-100 px-2 py-1 rounded-md mt-2 inline-block">
                                Add event members that can help manage this event
                            </span>
                        </span>
                    }
                </div>
            </div>
        </div>
    )
}
