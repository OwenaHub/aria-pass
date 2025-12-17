import { Suspense } from 'react'
import { Await, Link, redirect, useSearchParams, type MetaFunction } from 'react-router';
import type { Route } from '../_guest.events/+types/route';
import client from '~/http/client';
import EventCardSkeleton from '~/components/skeletons/events-card-skeleton';
import EventsMapper from '~/components/mappers/event-mapper';
import { ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { FeedFilter } from '~/components/utility/feed-filter';
import { defaultMeta } from '~/lib/meta';
import DefaultError from '~/components/errors/default-error';

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Events | AriaPass - Discover the community behind the concerts" },
    ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const filter = url.searchParams.get("filter");

    try {
        const getEvents = async (
            eventType: string | null,
            timeFilter: string | null
        ): Promise<OrganiserEvent[]> => {
            const response = await client.get('/api/events', {
                params: {
                    category: eventType,
                    filter: timeFilter
                }
            });
            return response.data;
        }

        const events = getEvents(category, filter);

        return { events };

    } catch ({ response }: any) {
        return redirect('/');
    }
}

export default function Events({ loaderData }: Route.ComponentProps) {
    const { events }: { events: Promise<OrganiserEvent[]> } = loaderData;
    const [searchParams] = useSearchParams();

    return (
        <main>
            <div className='container py-10 flex flex-col gap-2'>
                <h1 className='text-2xl font-semibold tracking-tighter'>All Events</h1>
                <p className='text-sm text-gray-500 font-light'>Showing all events</p>
            </div>

            <div className="hidden container lg:flex items-center justify-between mb-8">
                <FeedFilter />
                <div className="flex gap-4 items-center">
                    <Link
                        preventScrollReset
                        to={`?category=`}
                        className={`rounded-full py-2 px-4 hover:bg-stone-100 text-sm font-medium tracking-tight ${!searchParams.get('category') && 'bg-stone-100 outline'}`}
                    >
                        All
                    </Link>
                    {["Opera", "Recital", "Workshop", "Carol", "Concert"].map((item) => (
                        <Link
                            preventScrollReset
                            to={`?category=${item.toLowerCase()}`}
                            className={`${searchParams.get('category') === item.toLowerCase() && 'bg-stone-100 outline'} rounded-full py-2 px-4 hover:bg-stone-100 text-sm font-medium tracking-tight`}
                        >
                            {item}
                        </Link>
                    ))}
                </div>
                <Button variant={"secondary"} className="rounded-full flex justify-between gap-2 px-5">
                    <span>Create Event</span>
                    <ChevronRight />
                </Button>
            </div>

            <div className="lg:hidden mb-4">
                <div className="container flex justify-between items-center">
                    <FeedFilter />
                    <Button variant={"secondary"} className="rounded-full flex justify-between gap-2 h-10">
                        <span>Create Event</span>
                        <ChevronRight />
                    </Button>
                </div>

                <hr className="mt-5 mb-2" />

                <div className="container py-2 flex gap-4 items-center overflow-x-auto">
                    <Link
                        preventScrollReset
                        to={`?category=`}
                        className={`text-nowrap rounded-full py-2 px-4 hover:bg-stone-100 text-sm tracking-tight ${!searchParams.get('category') && 'bg-stone-100 outline'}`}
                    >
                        All
                    </Link>
                    {["Opera", "Recital", "Workshop", "Carol", "Concert"].map((item) => (
                        <Link
                            to={`?category=${item.toLowerCase()}`}
                            key={item}
                            preventScrollReset
                            className={`${searchParams.get('category') === item.toLowerCase() && 'bg-stone-100 outline'} text-nowrap rounded-full py-2 px-4 hover:bg-stone-100 text-sm tracking-tight`}>
                            {item}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Events ---------------------------------------------- */}
            <div className=" container block">
                <Suspense fallback={<EventCardSkeleton />}>
                    <Await resolve={events}>
                        {(events) => <EventsMapper events={events} />}
                    </Await>
                </Suspense>
            </div>
            {/* Events End ---------------------------------------------- */}

            <hr className="mt-10" />

            <div className="container mt-20">
                <div
                    className="h-80 rounded py-6 px-8 my-10 flex flex-col justify-center"
                    style={{
                        backgroundImage: `linear-gradient(90deg, #FAF9FB, #FAF9FB00), url('/images/ensemble-banner.png')`,
                        backgroundSize: 'cover, cover',
                        backgroundPosition: 'center, center',
                    }}
                >
                    <div className="">
                        <div className="h-10 w-10 rounded-full bg-[#F6A700] mb-3" />
                        <h2 className="text-xl font-bold mb-2">Get more leads, pay no fees</h2>
                        <p className="font-light text-xs mb-10">Rank higher, skip the fees, and level up your profile — all <br /> for $8/month.</p>

                        <Button className="rounded-full px-10">
                            Become an Organiser
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return <DefaultError error={error} />
}