import client from "~/http/client";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import dayjs from "dayjs";
import { STORAGE_URL } from "~/config/defaults";
import AddTicket from "./add-ticket";
import type { Route } from "../_user.my-events_.$slug/+types/route";
import { Link, redirect, type MetaFunction } from "react-router";
import { parseForm } from "~/lib/utils";
import formRequest from "~/http/form.request";
import {
    ArrowRight, Ticket as TicketIcon, Heart, MessageSquare, Edit3, Calendar, MapPin
} from "lucide-react";
import TicketCard from "~/components/cards/ticket-card";
import UpdateEventStatus from "./update-event-status";
// import { categorizeDevices } from "./analytics";
import { defaultMeta } from '~/lib/meta';
import MembersTable from "./members-table";
import FormatPrice from "~/components/utility/format-price";
import NewTeammate from "~/components/custom/new-teammate";
import EventPlanBadge from "~/components/utility/event-plan-badge";
import CreateProgram from "~/components/cards/create-program";
import EventStatus from "~/components/utility/event-status";

export const meta: MetaFunction = (args: any) => {
    if (!args.data.event) {
        return [{ title: "AriaPass - Discover the community behind the concerts" }];
    }
    return [
        ...(defaultMeta(args) || []),
        { title: `${args.data.event.title} | AriaPass Dashboard` },
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
                await formRequest(credentials, `organiser/events/${params.slug}/tickets/${credentials.ticket_id}`, 'PATCH');
                toast.success("Ticket edited!");
                return;
            case 'ticket.create':
                await formRequest(credentials, `organiser/events/${params.slug}/tickets`, 'POST');
                toast.success("Ticket added!", { description: 'Feel free to edit the content of your event ticket' });
                return;
            case 'ticket.delete':
                await client.delete(`/api/organiser/events/${params.slug}/tickets/${credentials.ticket_id}`)
                toast.warning("Ticket deleted!", { description: 'Ticket has been deleted with its related records' });
                return;
            case 'member.delete':
                let permission = confirm('Do you want to delete this member?');
                if (permission) {
                    await client.delete(`/api/organiser/events/${params.slug}/members/${credentials.memberId}`)
                    toast.warning("Member removed!", { description: 'Member has been removed from the event' });
                }
                return;
            default:
                toast.warning('No form action specified', { description: 'Contact support concerning this' })
                break;
        };
        return redirect(`/my-events/${params.slug}`)
    } catch (error: any) {
        toast.warning('Something went wrong', { description: error });
        return
    }
}

export default function OrganiserEvent({ loaderData }: Route.ComponentProps) {
    const { event }: { event: OrganiserEvent } = loaderData;

    const FORMATTED_DATE = dayjs(event.date).format('MMMM D, YYYY');
    const TOTAL_TICKETS = event.tickets.reduce((sum, ticket) => sum + ticket.quantityAvailable, 0);
    const TOTAL_TICKET_SOLD = event.tickets.reduce((sum, ticket) => sum + ticket.ticketPurchases, 0);
    const SUM_AMOUNT = event.tickets.flatMap(t => t.purchases || []).reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
    // ! const deviceStats = categorizeDevices(event.views as any[]);

    return (
        <div className="min-h-screen pb-20">
            <div className="bg-white mb-8 z-30">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                        <div className="h-auto w-20 md:h-auto md:w-24 rounded overflow-hidden bg-gray-100 shrink-0 shadow-sm border border-gray-200">
                            {event.bannerUrl ? (
                                <img src={`${STORAGE_URL}/${event.bannerUrl}`} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-300"><TicketIcon /></div>
                            )}
                        </div>

                        <div>
                            <div className="flex md:flex-row flex-col md:items-center gap-3 mb-3">
                                <h1 className="text-2xl md:text-2xl font-bold tracking-tighter text-gray-900 leading-6">{event.title}</h1>
                                <EventPlanBadge tier={event.eventPlan?.tier} />
                            </div>
                            <p className="text-sm font-medium text-gray-500 flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-5">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="size-4 hidden md:inline-block" /> {FORMATTED_DATE} at {event.startTime.substring(0, 5)}
                                </span>
                                <span className="md:hidden">•</span>
                                <span className="flex items-center gap-1.5 capitalize">
                                    <MapPin className="size-4 hidden md:inline-block" /> {event.venueName}, {event.city}
                                </span>
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                {/* <UpdateEventStatus event={event} /> */}
                                <EventStatus status={event.status} date={event.date} startTime={event.startTime} />
                                <Link to="edit">
                                    <Button variant="outline" size="sm" className="rounded-lg flex items-center gap-2 border-gray-200 shadow-none">
                                        <Edit3 className="size-3.5" /> Edit Event
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UpdateEventStatus event={event} />

            <main className="max-w-7xl mx-auto mt-5">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Revenue Card */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                            Revenue <Link to={`/spaces/${event.slug}`}><ArrowRight className="size-4 hover:text-primary-theme transition-colors" /></Link>
                        </p>
                        <p className="text-3xl font-bold text-gray-900 tracking-tighter">
                            <span className="text-lg text-gray-400 mr-1">₦</span><FormatPrice withSymbol={false} price={SUM_AMOUNT.toFixed(2)} />
                        </p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Page Views</p>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-gray-900 tracking-tighter">{typeof event.views === 'object' ? event.views.length : 0}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tickets Sold</p>
                        <div className="flex items-baseline justify-between mb-4">
                            <p className="text-3xl font-bold text-gray-900 tracking-tighter">
                                {TOTAL_TICKET_SOLD}<span className="text-xl text-gray-400">/{TOTAL_TICKETS}</span>
                            </p>
                            <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-md">
                                {event.tickets.length} tier{event.tickets.length > 1 && 's'}
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-white border rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${TOTAL_TICKETS > 0 ? (TOTAL_TICKET_SOLD / TOTAL_TICKETS) * 100 : 0}%` }} />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Engagement</p>
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">{event.likes || "0"} <Heart className="size-4 text-pink-500 fill-pink-50" /></p>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Likes</span>
                            </div>
                            <div className="h-8 w-px bg-gray-100" />
                            <div>
                                <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">{event.reviews?.length || 0} <MessageSquare className="size-4 text-indigo-500 fill-indigo-50" /></p>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Comments</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl tracking-tighter font-bold text-gray-900 flex items-center gap-2">
                                        Event tickets
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">Manage tiers, pricing, and availability.</p>
                                </div>
                                <AddTicket event={event} />
                            </div>

                            {event.tickets.length ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {event.tickets.map(ticket => (
                                        <TicketCard ticket={ticket} user="organiser" key={ticket.id} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                    <p className="text-sm font-bold text-gray-600">No tickets created yet</p>
                                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">If this is a Free Event, create a ticket with zero price named "Free Entry".</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-primary-theme rounded-2xl p-1 shadow-md shadow-indigo-200">
                            <CreateProgram event={event} />
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl tracking-tighter font-bold text-gray-900 flex items-center gap-2">
                                        Event Staff
                                    </h3>
                                </div>
                                <NewTeammate events={[event]} />
                            </div>

                            {event.members?.length ? (
                                <MembersTable members={event.members} />
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                    <p className="text-sm font-bold text-gray-600">No staff added</p>
                                    <p className="text-xs text-gray-400 mt-1">Invite team members to help manage this event.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}