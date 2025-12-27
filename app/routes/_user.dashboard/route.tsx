import { Suspense } from 'react';
import { Await, Link, redirect, useOutletContext, type MetaFunction } from 'react-router';
import { ArrowRight, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';
import type { Route } from '../_user.dashboard/+types/route';

import client from '~/http/client';
import useSession from '~/hooks/use-session';
import { defaultMeta } from '~/lib/meta';
import { extractNames } from '~/lib/utils';

import { Button } from '~/components/ui/button';
import DetailedEventCard from '~/components/cards/detailed-event-card';
import AvatarGroup from '~/components/custom/avatar-group';
import LoaderWithText from '~/components/skeletons/loader-with-text';
import { BrSm } from '~/components/utility/line-break';

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

        const [myEventsRes] = await Promise.all([
            organiserEventsPromise
        ]);

        return {
            // events: eventsRes.data,
            myEvents: myEventsRes.data,
            isOrganiser,
            collaborations: collaborations,
        };

    } catch (error: any) {
        if (error.response?.status === 409) {
            await validateSession();
        }
        console.error("Failed to fetch dashboard data:", error);
        return redirect('');
    }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const {
        // events,
        myEvents,
        isOrganiser,
        collaborations,
    } = loaderData;

    const user: User = useOutletContext();


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
                {/* <div className="flex flex-row items-center gap-1 mb-8">
                    <CustomAvatar name={user.name} styles='size-10 md:size-14 md:text-2xl rounded-lg' />
                    <p className="text-2xl md:text-4xl font-medium md:font-bold tracking-tighter">
                        Hello, {user.name.split(' ')[0]}!
                    </p>
                </div> */}

                <div className="bg-linear-to-b from-primary-bg to-indigo-50 px-4 py-14 rounded-2xl">
                    <h1 className="tracking-tighter font-serif text-3xl md:text-4xl font-medium text-center text-primary-theme mb-8">
                        What would you like <BrSm />  to do today?
                    </h1>
                    <div className='w-full overflow-x-auto'>
                        <div className='flex flex-wrap gap-3 items-center pb-3 w-max mx-auto'>
                            <QuickAction to='/my-events/new' icon={Calendar} label='Create event' />
                            <QuickAction to='/purchases' icon={ShoppingBag} label='See purchases' />
                            <QuickAction to='/events/?filter=all' icon={Calendar} label='See all events' />
                        </div>
                    </div>
                </div>
            </section>

            {/* Collaborations Grid (Unified) */}
            <h2 className='text-primary text-lg font-semibold tracking-tighter flex items-center gap-3 mb-3 mt-6'>
                <span>Collaborations</span>
            </h2>
            <Suspense fallback={<LoaderWithText text='Fetching your collaborations...' />}>
                <Await resolve={collaborations}>
                    {([invitedSpaces, ownedSpaces]) => (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-5 mb-8">
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
                    <h2 className='text-primary text-lg font-semibold tracking-tighter flex items-center gap-3'>
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
                        <div className="grid grid-cols-1">
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
        </div>
    );
}