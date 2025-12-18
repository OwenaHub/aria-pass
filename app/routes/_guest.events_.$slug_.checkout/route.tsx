import { toast } from 'sonner';
import client from '~/http/client';
import type { Route } from '../_guest.events_.$slug_.checkout/+types/route';
import { redirect, useOutletContext } from 'react-router';
import { useState } from 'react';
import PaystackPurchaseButton from './paystack-purchase-button';
import { Button } from '~/components/ui/button';
import FormatPrice from '~/components/utility/format-price';
import { ArrowLeft, ArrowRight, Dot } from 'lucide-react';
import { STORAGE_URL } from '~/config/defaults';
import { isPastEventDate } from '~/lib/utils';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    try {
        const { data } = await client.get(`api/events/${params.slug}`);
        return { event: data }
    } catch (error: any) {
        toast.error("Something went wrong", {
            description: `Status code ${error.status} - Unable to load resource`
        });
        return redirect('/')
    }
}

export default function EventCheckout({ loaderData }: Route.ComponentProps) {
    const { event }: { event: OrganiserEvent } = loaderData;
    const user: User = useOutletContext();

    const [ticket, setTicket] = useState<Ticket>(event.tickets[0]);
    const [next, setNext] = useState(false);

    let banner = event.bannerUrl
        ? `${STORAGE_URL}/${event.bannerUrl}`
        : "/images/banners/default-course-img.png";

    return (
        <div className='lg:px-14'>
            <section className='container flex flex-col md:flex-row py-10 md:gap-20 gap-10'>
                <div className="bg-white hidden md:block flex-1 overflow-hidden relative">
                    <img
                        src={banner}
                        alt={event.title}
                        className="h-120 w-full object-cover shadow-xl border"
                    />

                    <div className="bg-white/60 border px-4 py-2 text-sm font-semibold rounded-md absolute top-5 left-5">
                        {event.eventType}
                    </div>

                    {event.status === 'completed' && (
                        <div className='bg-gray-800 font-bold text-white text-xs px-3 py-3 rounded-md w-max mb-1 absolute bottom-5 left-5'>
                            {isPastEventDate(event.date, event.startTime) ? 'EVENT ENDED' : 'SOLD OUT'}
                        </div>
                    )}
                </div>

                <div className='border flex-1 py-5 px-5 bg-gray-50 rounded-2xl'>
                    <div className="mb-5">
                        <p className='text-gray-500 text-sm tracking-tighter'>Ticket checkout</p>
                        <h1 className='font-bold text-xl tracking-tighter'>
                            {event.title}
                        </h1>
                    </div>
                    {next && (
                        <Button
                            size={"sm"}
                            variant={"outline"}
                            className="w-max p-0 text-xs shadow-none rounded-full mb-5"
                            onClick={() => setNext(false)}
                        >
                            <ArrowLeft /> Back
                        </Button>
                    )}
                    {!next && (
                        <>
                            {event.tickets.map((item: Ticket) => (
                                <div
                                    key={item.id}
                                    onClick={() => setTicket(item)}
                                    className={`border bg-white relative px-4 py-6 mb-5 flex items-center justify-between rounded-xl 
                                    ${item.id === ticket?.id && 'outline-2 outline-primary-theme outline-offset-2 text-primary-theme'} relative
                                    `}
                                >
                                    <div>
                                        <small className="flex gap-1 items-center font-semibold">
                                            <span>{item.name}</span>
                                            {item.quantityAvailable - item.ticketPurchases <= 0 && (
                                                <span className="bg-amber-400 text-white px-2 py-0.5 tracking-tighter text-xs rounded-lg">SOLD OUT</span>
                                            )}
                                        </small>

                                        <p className="font-semibold">
                                            <FormatPrice price={item.price} />
                                        </p>
                                    </div>
                                    {(item.id === ticket.id) && (
                                        <Dot strokeWidth={10} />
                                    )}
                                </div>
                            ))}

                            <br />

                            <Button
                                className="py-6 rounded-xl text-center w-full text-xs uppercase font-light"
                                disabled={!ticket || (ticket.quantityAvailable - ticket.ticketPurchases <= 0)}
                                onClick={() => setNext(!next)}
                            >
                                Continue <ArrowRight />
                            </Button>
                        </>
                    )}

                    {next && (
                        <PaystackPurchaseButton user={user} ticket={ticket} />
                    )}
                </div>
            </section>
        </div>
    )
}
