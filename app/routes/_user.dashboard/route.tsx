import { Suspense, useEffect, useState } from 'react';
import { Await, Link, redirect, useOutletContext, type MetaFunction } from 'react-router';
import { ArrowRight, Calendar, ChevronRight, Info, Link2Icon, ScrollText, ShoppingBag, Ticket } from 'lucide-react';
import type { Route } from '../_user.dashboard/+types/route';

import client from '~/http/client';
import useSession from '~/hooks/use-session';
import { defaultMeta } from '~/lib/meta';
import { extractNames, to12HourFormat } from '~/lib/utils';

import { Button } from '~/components/ui/button';
import DetailedEventCard from '~/components/cards/detailed-event-card';
import CustomAvatar from '~/components/custom/custom-avatar';
import AvatarGroup from '~/components/custom/avatar-group';
import LoaderWithText from '~/components/skeletons/loader-with-text';
import FormatPrice from '~/components/utility/format-price';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { STORAGE_URL } from '~/config/defaults';
import QRCode from 'react-qr-code';

// --- Reusable Sub-Components ---
const QuickAction = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link to={to} className='bg-white border border-primary-theme hover:shadow-md rounded-full px-3 py-2 flex items-center gap-1.5 transition-shadow'>
        <Icon strokeWidth={1} className='size-3 md:size-4' />
        <span className='text-xs font-light'>{label}</span>
    </Link>
);

const SpaceCard = ({ space, user, type }: { space: any, user: User, type: 'invited' | 'owned' }) => {
    const isInvited = type === 'invited';
    const userRole = isInvited ? space.members.find((mem: any) => mem.email === user.email) : null;

    return (
        <div className="border p-2.5 rounded-lg hover:bg-gray-50 transition relative h-full flex flex-col overflow-hidden">
            <p className='text-xs text-gray-500 tracking-tight'>
                {isInvited ? 'You were invited to' : 'Your Space'}
            </p>
            <p className="tracking-tighter text-sm font-medium flex-grow">
                {space.title}
            </p>

            {/* Role Badge or Spacer */}
            <div className={`rounded-full w-max my-2.5 px-2 py-1 text-[10px] italic capitalize bg-gray-100 ${!isInvited ? 'opacity-0' : ''}`}>
                {isInvited ? `as ${userRole?.role || 'member'}` : 'owner'}
            </div>

            <div className='flex items-center justify-between mt-auto'>
                <AvatarGroup names={extractNames(space.members)} max={3} />
            </div>
            <Link to={`/spaces/${space.slug}`} className="absolute inset-0" />

            <div className={`rounded -rotate-[30deg] h-20 w-12 absolute -right-2 -bottom-10 ${isInvited ? 'bg-green-500' : 'bg-pink-500'} opacity-50`} />
        </div>
    );
};

// --- Meta & Loader ---
export const meta: MetaFunction = (args) => [
    ...defaultMeta(args) || [],
    { title: "Dashboard | AriaPass" },
];

export async function clientLoader() {
    const { getUser, validateSession } = useSession();

    try {
        const user = await getUser(); // Ensure we have the user
        const isOrganiser = user && user.organiserProfile;

        //* Critical Data
        const organiserEventsPromise = isOrganiser ? client.get('/api/organiser/events') : Promise.resolve({ data: [] });

        //* Deferred Data (Streaming)
        const collaborations = Promise.all([
            client.get('api/spaces/invited').
                then(res => res.data)
                .catch(() => []),

            isOrganiser
                ? client.get('api/spaces')
                    .then(res => res.data)
                    .catch(() => [])
                : Promise.resolve([])
        ]);

        const purchases = Promise.all([
            client.get('/api/tickets/purchases')
                .then(res => res.data)
                .catch(() => [])
        ]);

        const [myEventsRes] = await Promise.all([
            organiserEventsPromise
        ]);

        return {
            // events: eventsRes.data,
            myEvents: myEventsRes.data,
            isOrganiser,
            collaborations: collaborations,
            purchases: purchases
        };

    } catch (error: any) {
        if (error.response?.status === 409) {
            await validateSession();
        }
        console.error("Failed to fetch dashboard data:", error);
        return redirect('');
    }
}

type TGroupedPurchases = {
    eventId: number,
    eventTitle: string,
    tickets: TicketPurchase[];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const {
        // events,
        myEvents,
        isOrganiser,
        collaborations,
        purchases
    } = loaderData;

    const user: User = useOutletContext();
    const [filteredData, setFilteredData] = useState<TGroupedPurchases[]>([]);

    useEffect(() => {
        let mounted = true;

        const resolveAndSort = async () => {
            try {
                // purchases is a Promise that resolves to an array (possibly wrapped in another array)
                const resolved = await purchases;
                // If the loader returned a tuple like [data], unwrap it
                const records = Array.isArray(resolved) && resolved.length === 1 ? resolved[0] : resolved;
                if (!mounted) return;
                const sorted = sortPurchases(records || []);
                setFilteredData(sorted);
            } catch (err) {
                console.error('Failed to resolve purchases for sorting:', err);
            }
        };

        resolveAndSort();

        return () => {
            mounted = false;
        };
    }, [purchases]);


    function sortPurchases(records: any[]) {
        const groupsMap = new Map();

        records.forEach(record => {
            const eventId = record.ticket.event.id;

            if (!groupsMap.has(eventId)) {
                groupsMap.set(eventId, {
                    eventId: eventId,
                    eventTitle: record.ticket.event.title,
                    tickets: [{ ...record }]
                });
            } else {
                // IF EXISTS: Get the reference and push the new ticket
                // Since objects are references, this updates the entry inside the Map immediately
                groupsMap.get(eventId)
                    .tickets.push({ ...record });
            }
        });

        const groupedPurchases = Array.from(groupsMap.values());
        return groupedPurchases;
    }

    return (
        <div>
            {/* Header Section */}
            <section className="mb-5">
                <div className="flex flex-row items-center gap-1 mb-8">
                    <CustomAvatar name={user.name} styles='size-10 md:size-14 md:text-2xl rounded-lg' />
                    <p className="text-2xl md:text-4xl font-medium md:font-bold tracking-tighter">
                        Hello, {user.name.split(' ')[0]}!
                    </p>
                </div>

                <div className="bg-primary-bg px-4 py-10 rounded-2xl">
                    <h1 className="tracking-tighter text-xl md:text-3xl font-light text-center text-primary-theme mb-8">
                        What would you like to do today?
                    </h1>
                    <div className='w-full overflow-x-auto'>
                        <div className='flex flex-wrap gap-3 items-center pb-3 w-max mx-auto'>
                            <QuickAction to='/my-events/new' icon={Calendar} label='Create event' />
                            <QuickAction to='/purchases' icon={ShoppingBag} label='See purchases' />
                            {/* <QuickAction to='/purchases' icon={UserCog} label='Add Teammember' /> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Collaborations Grid (Unified) */}
            <Suspense fallback={<LoaderWithText text='Fetching your collaborations...' />}>
                <Await resolve={collaborations}>
                    {([invitedSpaces, ownedSpaces]) => (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-5 my-8">
                            {/* Render Invited Spaces */}
                            {invitedSpaces?.map((space: any) => (
                                <SpaceCard key={`invited-${space.id}`} space={space} user={user} type="invited" />
                            ))}

                            {/* Render Owned Spaces */}
                            {ownedSpaces?.map((space: any) => (
                                <SpaceCard key={`owned-${space.id}`} space={space} user={user} type="owned" />
                            ))}

                            {/* Empty State for Spaces */}
                            {(!invitedSpaces?.length && !ownedSpaces?.length) && (
                                <div className="col-span-full text-center py-5 text-gray-500 text-sm">
                                    Your collaborations will appear here.
                                </div>
                            )}
                        </div>
                    )}
                </Await>
            </Suspense>

            {/* Recent Events Section */}
            {isOrganiser && (
                <section className='mb-10'>
                    <h2 className='text-primary text-lg font-medium tracking-tight flex items-center gap-3'>
                        <span>Recently posted</span>
                        <Link to={"/my-events"} className='hover:bg-gray-100 rounded-lg p-2 transition-colors'>
                            <ChevronRight size={16} />
                        </Link>
                    </h2>

                    <p className='text-sm text-muted-foreground mb-4'>
                        Manage your events and tickets {" "}
                        <Link to={"/my-events"} className='text-blue-500 underline underline-offset-2'>here</Link>
                    </p>

                    {(myEvents && myEvents.length > 0) ? (
                        <div className="grid grid-cols-1 gap-4">
                            {myEvents.slice(0, 2).map((event: any) => (
                                <DetailedEventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className='pt-10 flex flex-col items-center gap-5'>
                            <p className="font-medium tracking-tight text-md text-primary">
                                You have no events yet.
                            </p>
                            {user.organiserProfile ? (
                                <>
                                    <Link to={"/my-events/new"}>
                                        <Button
                                            disabled={user.organiserProfile?.status !== 'active'}
                                            className='rounded-full bg-primary px-8 py-6'
                                        >
                                            Create an Event
                                        </Button>
                                    </Link>
                                    {user.organiserProfile.status === 'pending' && (
                                        <small className="text-xs text-amber-600 font-medium">Request under review</small>
                                    )}
                                    {user.organiserProfile.status === 'suspended' && (
                                        <small className="text-xs text-destructive font-medium">Account suspended</small>
                                    )}
                                </>
                            ) : (
                                <Link to={"/organiser-request"}>
                                    <Button className='rounded-full bg-primary-theme px-8 py-6 flex items-center gap-2'>
                                        Become an Organiser <ArrowRight className="size-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </section>
            )}

            <div className='flex gap-3 items-center'>
                <div className="p-3 bg-gray-100 rounded-full">
                    <ScrollText />
                </div>
                <h3 className='font-medium tracking-tighter text-lg'>Ticket Purchases</h3>
            </div>
            <Suspense fallback={<LoaderWithText text='Fetching your collaborations...' />}>
                <Await resolve={purchases}>
                    {() => (
                        (filteredData && filteredData.length > 0) ? (
                            <div className='flex flex-col gap-4 mt-3'>
                                {filteredData.map((group: TGroupedPurchases) => (
                                    <section className='flex md:flex-row flex-col gap-3 place-items-stretch' key={group.eventId}>
                                        <div className='bg-gray-100 py-5 rounded-md px-5 sticky top-30 z-1'>
                                            <h3 className='font-semibold tracking-tighter text-sm text-primary '>{group.eventTitle}</h3>
                                        </div>
                                        <div className='flex flex-col gap-2 flex-1'>
                                            {group.tickets.map((purchase) => (
                                                <div key={purchase.id} className='border rounded-md py-2.5 px-2 flex gap-2 hover:cursor-pointer hover:shadow-lg transition'>
                                                    <div className='w-1.5 min-h-full bg-red-500 rounded'
                                                        style={{ background: purchase.ticket.theme }}
                                                    />
                                                    <div className='w-full'>
                                                        <div className="text-xs font-light tracking-tighter mb-1">
                                                            {purchase.ticket.name} ticket
                                                        </div>
                                                        <div className='flex items-center justify-between gap-4'>
                                                            <div className='flex items-center gap-4'>
                                                                <div className="flex items-center gap-1">
                                                                    <Ticket size={14} strokeWidth={1} className='-rotate-45 z-0' />
                                                                    <span className="text-xs font-semibold">
                                                                        <FormatPrice price={purchase.amount} />
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar size={14} strokeWidth={1} className='z-0' />
                                                                    <div className='text-xs font-light'>
                                                                        {purchase?.createdAt ? new Date(purchase.createdAt!).toLocaleString() : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <div className="flex items-center gap-1">
                                                                            <Info size={18} strokeWidth={1} className='z-0' />
                                                                        </div>
                                                                    </DialogTrigger>

                                                                    <DialogContent className="sm:max-w-sm bg-transparent p-0 border-0">
                                                                        <div className='flex flex-col gap-5 bg-white p-3 corner-bottom-shape'>
                                                                            <DialogTitle>
                                                                                <section className='w-full h-38 rounded-xl bg-gray-100 overflow-hidden'>
                                                                                    <img
                                                                                        src={`${STORAGE_URL}/${purchase.ticket.event.bannerUrl}`}
                                                                                        alt={purchase.ticket.event.title}
                                                                                        className="h-full w-full object-cover"
                                                                                    />
                                                                                </section>
                                                                            </DialogTitle>
                                                                            <div className='px-5'>
                                                                                <p className="text-xs font-light tracking-tighter text-gray-500">
                                                                                    Event
                                                                                </p>
                                                                                <h3 className='text-xl font-semibold tracking-tighter'>
                                                                                    {group.eventTitle}
                                                                                </h3>
                                                                            </div>
                                                                            <div className='grid grid-cols-2'>
                                                                                <div className='px-5 flex flex-col gap-2'>
                                                                                    <p className="text-xs font-light tracking-tighter text-gray-500">
                                                                                        Date
                                                                                    </p>
                                                                                    <h3 className='text-sm tracking-tighter'>
                                                                                        {purchase?.createdAt ? new Date(purchase.createdAt!).toLocaleString() : null}
                                                                                    </h3>
                                                                                </div>
                                                                                <div className='px-5 flex flex-col gap-2'>
                                                                                    <p className="text-xs font-light tracking-tighter text-gray-500">
                                                                                        Time
                                                                                    </p>
                                                                                    <h3 className='text-sm tracking-tighter'>
                                                                                        {to12HourFormat(purchase.ticket.event.startTime)}
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className='grid grid-cols-2'>
                                                                                <div className='px-5 flex flex-col gap-2'>
                                                                                    <p className="text-xs font-light tracking-tighter text-gray-500">
                                                                                        Name
                                                                                    </p>
                                                                                    <h3 className='text-sm tracking-tighter'>
                                                                                        {purchase.user.name}
                                                                                    </h3>
                                                                                </div>
                                                                                <div className='px-5 flex flex-col gap-2'>
                                                                                    <p className="text-xs font-light tracking-tighter text-gray-500">
                                                                                        Ticket seat
                                                                                    </p>
                                                                                    <h3 className='text-sm tracking-tighter capitalize'>
                                                                                        {purchase.ticket.name}
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                            <div>

                                                                                <div className='px-5 flex flex-col gap-2'>
                                                                                    <p className="text-xs font-light tracking-tighter text-gray-500">
                                                                                        Venue & Address
                                                                                    </p>
                                                                                    <h3 className='text-sm tracking-tighter'>
                                                                                        <span>{purchase.ticket.event.venueName} {purchase.ticket.event.venueAddress}</span>{" "}
                                                                                        <span className='capitalize'> {purchase.ticket.event.city}, {purchase.ticket.event.country}</span>
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="px-4 pt-10 pb-4 sm:justify-start bg-white -mt-4 border-t border-gray-300 border-dashed corner-top-shape">
                                                                            <div className='flex items-stretch gap-3'>
                                                                                <QRCode value={purchase.code} size={100} />
                                                                                <div className='min-h p-2 w-full' style={{ background: purchase.ticket.theme }}>
                                                                                    <p className="text-xs font-light tracking-tighter text-gray-700">
                                                                                        Scan this QR code at the event entrance to gain
                                                                                        access using the AriaPass app.
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <Link
                                                                                to={`/events/${purchase.ticket.event.slug}`}
                                                                                className="mt-3 mx-auto w-max text-xs text-gray-500 flex items-center justify-center gap-2 hover:underline underline-offset-2"
                                                                            >
                                                                                <span> See event </span>
                                                                                <Link2Icon size={14} />
                                                                            </Link>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <div className='pt-20 flex flex-col items-start gap-5'>
                                <p className="text-light text-sm text-muted-foreground text-center">
                                    No purchases yet
                                </p>
                            </div>
                        )
                    )}
                </Await>
            </Suspense>

        </div>
    );
}