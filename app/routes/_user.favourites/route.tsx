import client from '~/http/client';
import type { Route } from '../_user.favourites/+types/route';
import { redirect, useSearchParams, type MetaFunction } from 'react-router';
import RecordFilter from '~/components/utility/record-filter';
import { useEffect, useState } from 'react';
import EventCard from '~/components/cards/event-card';
import { Dot } from 'lucide-react';
import { defaultMeta } from '~/lib/meta';

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Favourites | AriaPass" },
    ];
}

export async function clientLoader() {
    try {
        const { data } = await client.get('/api/events/favourites');

        return { events: data }
    } catch ({ response }: any) {
        console.error(response);
        return redirect('/dashboard')
    }
}

export default function MyEvents({ loaderData }: Route.ComponentProps) {
    const { events }: { events: OrganiserEvent[] } = loaderData;

    const [searchParams] = useSearchParams();
    const [filteredEvents, setFilteredEvents] = useState<OrganiserEvent[]>(events);

    const FILTERS = [
        {
            label: "Past 1 week",
            icon: <Dot size={16} strokeWidth={3} />,
        },
        {
            label: "In 1 week",
            icon: <Dot size={16} strokeWidth={3} />,
        },
    ]

    useEffect(() => {
        const filtered = events.filter((submission) => {
            if (searchParams.get("status")) {
                return submission.status === searchParams.get("status");
            }
            return true;
        });
        setFilteredEvents(filtered);
    }, [searchParams, events]);

    return (
        <div>
            <section>
                <div className="flex flex-col lg:flex-row gap-7 justify-between lg:items-end">
                    <div>
                        <h1 className='text-primary text-3xl font-bold tracking-tight mb-5'>Favourites</h1>
                        <RecordFilter data={FILTERS} />
                    </div>
                </div>

                {(filteredEvents && filteredEvents.length) ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-8 items-stretch justify-start">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className='pt-20 flex flex-col items-start gap-5'>
                        <p className="text-light text-sm text-muted-foreground text-center">
                            {searchParams.get('status')
                                ? <span>
                                    No {searchParams.get('status')} events
                                </span>
                                : <span>
                                    Nothing coming up at the moment
                                </span>
                            }
                        </p>
                    </div>
                )}
            </section>
        </div>
    )
}
