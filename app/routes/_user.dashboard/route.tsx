import { Suspense } from 'react';
import { Await, Link, redirect, useOutletContext, type MetaFunction } from 'react-router';
import {
    ArrowRight, CalendarPlus, Compass,
    Ticket, Users, Building2, PlusCircle, AlertCircle, Clock
} from 'lucide-react';
import type { Route } from '../_user.dashboard/+types/route';

import client from '~/http/client';
import useSession from '~/hooks/use-session';
import { defaultMeta } from '~/lib/meta';
import { extractNames } from '~/lib/utils';

import { Button } from '~/components/ui/button';
import DetailedEventCard from '~/components/cards/detailed-event-card';
import AvatarGroup from '~/components/custom/avatar-group';
import LoaderWithText from '~/components/skeletons/loader-with-text';
import OrganiserProfileStatus from './organiser-profile-status';

// --- Meta & Loader (Unchanged logic, kept intact) ---
export const meta: MetaFunction = (args) => [
    ...(defaultMeta(args) || []),
    { title: "Dashboard | AriaPass" },
];

export async function clientLoader() {
    const { getUser, validateSession } = useSession();

    try {
        const user = await getUser();
        const isOrganiser = Boolean(user && user.organiserProfile);

        const organiserEventsPromise = isOrganiser ? client.get('/api/organiser/events') : Promise.resolve({ data: [] });

        const collaborations = Promise.all([
            client.get('api/spaces/invited').then(res => res.data).catch(() => []),
            isOrganiser ? client.get('api/spaces').then(res => res.data).catch(() => []) : Promise.resolve([])
        ]);

        const [myEventsRes] = await Promise.all([organiserEventsPromise]);

        return {
            myEvents: myEventsRes.data,
            isOrganiser,
            collaborations: collaborations,
        };

    } catch (error: any) {
        if (error.response?.status === 409) await validateSession();
        console.error("Failed to fetch dashboard data:", error);
        return redirect('');
    }
}

// --- Reusable Dashboard Widgets ---
const QuickActionTile = ({ to, icon: Icon, label, desc, primary = false }: { to: string, icon: any, label: string, desc: string, primary?: boolean }) => (
    <Link
        to={to}
        className={`group flex flex-col p-5 rounded-2xl border transition-all ${primary
            ? 'bg-slate-900 border-slate-900 text-white shadow-lg hover:bg-black hover:-translate-y-1'
            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 text-slate-900'
            }`}
    >
        <div className={`p-3 rounded-xl w-max mb-4 ${primary ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
            <Icon strokeWidth={2.5} className="size-5" />
        </div>
        <h3 className="font-bold tracking-tight mb-1">{label}</h3>
        <p className={`text-xs font-medium ${primary ? 'text-slate-300' : 'text-slate-500'}`}>{desc}</p>
    </Link>
);

const SpaceCard = ({ space, user, type }: { space: any, user: any, type: 'invited' | 'owned' }) => {
    const isInvited = type === 'invited';
    const userRole = isInvited ? space.members.find((mem: any) => mem.email === user.email) : null;

    return (
        <Link to={`/spaces/${space.slug}`} className="group block bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${isInvited ? 'bg-emerald-50 text-emerald-600 border border-emerald-300' : 'bg-indigo-50 text-indigo-600 border border-indigo-300'}`}>
                        {isInvited ? <Users className="size-3.5" /> : <Building2 className="size-3.5" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {isInvited ? 'Invited' : 'Owner'}
                    </span>
                </div>
                {isInvited && userRole?.role && (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
                        {userRole.role}
                    </span>
                )}
            </div>

            <h4 className="font-bold text-slate-900 tracking-tight mb-4 truncate">{space.title}</h4>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <AvatarGroup names={extractNames(space.members)} max={3} />
                <ArrowRight className="size-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
        </Link>
    );
};

// --- Main Dashboard Component ---
export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { myEvents, isOrganiser, collaborations } = loaderData;
    const user: any = useOutletContext();

    return (
        <div className=" w-full mx-auto animate-in fade-in duration-500 pb-20 min-h-screen">

            {/* 1. Dashboard Header & Quick Actions */}
            <div className="mb-10">
                <div>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">{user.name}</p>
                    <h1 className='text-primary text-3xl font-black tracking-tighter mb-5'>
                        Dashboard
                    </h1>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {isOrganiser ? (
                        <>
                            <QuickActionTile primary to="/my-events/new" icon={CalendarPlus} label="New Event" desc="Launch a new ticket page" />
                            <QuickActionTile to="/purchases" icon={Ticket} label="Purchases" desc="View tickets you've bought" />
                            <QuickActionTile to="/events/?filter=all" icon={Compass} label="Discover" desc="Browse other concerts" />
                        </>
                    ) : (
                        <>
                            <QuickActionTile to="/events/?filter=all" icon={Compass} label="Find Events" desc="Browse upcoming concerts" />
                            <QuickActionTile to="/purchases" icon={Ticket} label="My Tickets" desc="Access your purchases" />
                            <QuickActionTile primary to="/organiser-request" icon={Building2} label="Host an Event" desc="Become an organiser" />
                        </>
                    )}
                </div>
            </div>

            {/* Profile Status Alert */}
            <div className="mb-8">
                <OrganiserProfileStatus isOrganiser={isOrganiser} user={user} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">

                {/* LEFT COLUMN (Span 8): Primary Workflow */}
                <div className="lg:col-span-6 space-y-8">
                    {isOrganiser && (
                        <section className="border border-slate-200 rounded-2xl p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-black tracking-tighter text-slate-900">Recent Events</h2>
                                    <p className="text-sm font-medium text-slate-500">Events you are currently managing.</p>
                                </div>
                                <Link to="/my-events">
                                    <Button variant="secondary" className="h-9 rounded-lg text-xs font-bold border-slate-200">
                                        View All Events
                                    </Button>
                                </Link>
                            </div>

                            {myEvents && myEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {myEvents.slice(0, 2).map((event: any) => (
                                        <DetailedEventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center text-center bg-slate-50">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <CalendarPlus className="size-6 text-slate-400" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1">No events yet</h3>
                                    <p className="text-sm text-slate-500 mb-6 max-w-sm">Get started by creating your first event to start selling tickets commission-free.</p>

                                    {user.organiserProfile?.status === 'active' ? (
                                        <Link to="/my-events/new">
                                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md">
                                                Create Event
                                            </Button>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg bg-amber-50 text-amber-700">
                                            {user.organiserProfile?.status === 'suspended' ? (
                                                <><AlertCircle className="size-4" /> Account Suspended</>
                                            ) : (
                                                <><Clock className="size-4" /> Profile under review</>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Example extra panel for non-organisers or generic content */}
                    {!isOrganiser && (
                        <section className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                            <h2 className="text-xl font-extrabold tracking-tighter text-slate-900 mb-6">Recommended for you</h2>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center bg-slate-50">
                                <p className="text-sm font-bold text-slate-400">Your feed will populate here based on your musical interests.</p>
                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT COLUMN (Span 4): Context & Collaborations */}
                <div className="lg:col-span-6 space-y-8">
                    <section className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black tracking-tighter text-slate-900">Workspaces</h2>
                            <div className="p-2 bg-slate-50 rounded-lg"><Users className="size-4 text-slate-400" /></div>
                        </div>

                        <Suspense fallback={<LoaderWithText text="Loading workspaces..." />}>
                            <Await resolve={collaborations}>
                                {([invitedSpaces, ownedSpaces]) => {
                                    const hasSpaces = invitedSpaces?.length > 0 || ownedSpaces?.length > 0;

                                    return hasSpaces ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {ownedSpaces?.map((space: any) => (
                                                <SpaceCard key={`owned-${space.id}`} space={space} user={user} type="owned" />
                                            ))}
                                            {invitedSpaces?.map((space: any) => (
                                                <SpaceCard key={`invited-${space.id}`} space={space} user={user} type="invited" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <PlusCircle className="size-5 text-slate-300" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-600 mb-1">No collaborations</p>
                                            <p className="text-xs text-slate-400">When invited to an event, it will appear here.</p>
                                        </div>
                                    );
                                }}
                            </Await>
                        </Suspense>
                    </section>
                </div>

            </div>
        </div>
    );
}