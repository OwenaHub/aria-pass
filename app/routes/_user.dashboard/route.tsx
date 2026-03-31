import { Link, redirect, useOutletContext, type MetaFunction } from 'react-router';
import {
    CalendarPlus, Compass,
    Ticket, Users, Building2, AlertCircle, Clock
} from 'lucide-react';
import type { Route } from '../_user.dashboard/+types/route';

import client from '~/http/client';
import useSession from '~/hooks/use-session';
import { defaultMeta } from '~/lib/meta';

import { Button } from '~/components/ui/button';
import DetailedEventCard from '~/components/cards/detailed-event-card';
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

        const [myEventsRes] = await Promise.all([organiserEventsPromise]);

        return {
            myEvents: myEventsRes.data,
            isOrganiser,
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
            ? 'bg-gray-900 border-gray-900 text-white shadow-lg hover:bg-black hover:-translate-y-1'
            : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 text-gray-900'
            }`}
    >
        <div className={`p-3 rounded-xl w-max mb-4 ${primary ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
            <Icon strokeWidth={2.5} className="size-5" />
        </div>
        <h3 className="font-bold tracking-tight mb-1">{label}</h3>
        <p className={`text-xs font-medium ${primary ? 'text-gray-300' : 'text-gray-500'}`}>{desc}</p>
    </Link>
);

// --- Main Dashboard Component ---
export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { myEvents, isOrganiser } = loaderData;
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
                            <QuickActionTile to="/spaces" icon={Users} label="Spaces" desc="Invites to event event collaborations" />
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

            <div className="">
                <div className="lg:col-span-6 space-y-8">
                    {isOrganiser && (
                        <section className="border border-gray-200 rounded-2xl p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold tracking-tighter text-gray-900">Recent Events</h2>
                                    <p className="text-sm font-medium text-gray-500">Events you are currently managing.</p>
                                </div>
                                <Link to="/my-events">
                                    <Button variant="secondary" className="h-9 rounded-lg text-xs  border-gray-200">
                                        View All
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
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center text-center bg-gray-50">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <CalendarPlus className="size-6 text-gray-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">No events yet</h3>
                                    <p className="text-sm text-gray-500 mb-6 max-w-sm">Get started by creating your first event to start selling tickets commission-free.</p>

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
                        <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                            <h2 className="text-xl font-extrabold tracking-tighter text-gray-900 mb-6">Recommended for you</h2>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gray-50">
                                <p className="text-sm font-bold text-gray-400">Your feed will populate here based on your musical interests.</p>
                            </div>
                        </section>
                    )}
                </div>           

            </div>
        </div>
    );
}