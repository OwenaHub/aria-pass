import { Heart } from "lucide-react";
import { Link } from "react-router";
import RedirectOrFetcher from "~/components/navigation/like-event";
import { Button } from "~/components/ui/button";
import { isPastEventDate } from "~/lib/utils";

export default function CheckoutButton({ event }: { event: OrganiserEvent }) {
    const hasTickets = event.tickets && event.tickets.length > 0;

    // Check if free (price is 0 OR '0.00')
    const isFreeEvent = hasTickets && event.tickets.length < 2 && Number(event.tickets[0].price) === 0;

    const isEventOver = isPastEventDate(event.date, event.startTime);
    const isCompleted = event.status === 'completed';
    const isSoldOutOrEnded = isCompleted || isEventOver;

    return (
        <>
            {isFreeEvent ? (
                // --- FREE EVENT LOGIC ---
                <RedirectOrFetcher route={`/events/toggle-like/${event.slug}`}>
                    <Button
                        disabled={isSoldOutOrEnded}
                        className="bg-primary w-full py-6 text-lg font-light rounded-lg tracking-tighter gap-2"
                    >
                        <span>I will attend</span>
                        <Heart
                            size={20}
                            className={event.liked ? 'text-destructive fill-current' : ''}
                        />
                    </Button>
                </RedirectOrFetcher>
            ) : (
                // --- PAID EVENT LOGIC ---
                isSoldOutOrEnded ? (
                    // Case A: Sold Out / Ended (No Link)
                    <Button
                        disabled
                        className="bg-gray-300 border-none w-full py-7 rounded-lg font-semibold text-xl tracking-tighter text-gray-500 cursor-not-allowed"
                    >
                        {isEventOver ? 'Event Ended' : 'SOLD OUT'}
                    </Button>
                ) : (
                    // Case B: Active (Link to Checkout)
                    <Link
                        to={`checkout#checkout`}
                        className="w-full block"
                    >
                        <Button
                            className="bg-primary-theme border-b-4 border-indigo-800 hover:bg-indigo-400 w-full py-7 rounded-xl font-semibold text-xl tracking-tighter transition-all relative"
                        >
                            <span className="text-lg md:text-lg tracking-tighter font-black uppercase">
                                Buy Ticket
                            </span>
                        </Button>
                    </Link>
                )
            )}
        </>
    );
}