import { Calendar, Ellipsis, Heart, MapPin, Share, Ticket } from "lucide-react";
import { STORAGE_URL } from "~/config/defaults";
import dayjs from "dayjs";
import Placeholder from "~/components/utility/placeholder";
import { Button } from "~/components/ui/button";
import { Link, useOutletContext } from "react-router";
import RedirectOrFetcher from "~/components/navigation/like-event";
import SharePage from "~/components/utility/share-page";
import FormatPrice from "~/components/utility/format-price";
import { FormatLineBreak } from "~/components/utility/format-line-break";
import { isPastEventDate, to12HourFormat } from "~/lib/utils";
import CheckoutButton from "./checkout-button";
import { TERMS_AND_CONDITIONS } from "./terms-and-conditions";
import Countdown from "~/components/utility/countdown";
import PostReview from "../_guest.events_.$slug.review/post-review";

export default function DesktopView({ event }: { event: OrganiserEvent }) {
    const user: User = useOutletContext();

    let banner = event.bannerUrl
        ? `${STORAGE_URL}/${event.bannerUrl}`
        : "/images/banners/default-course-img.png";

    const formattedDate = dayjs(event.date).format('MMMM D, YYYY');

    const TOTAL_TICKETS: number = event.tickets.reduce((sum: number, ticket: Ticket) => {
        return sum + ticket.quantityAvailable;
    }, 0);

    const TOTAL_TICKETS_SALES: number = event.tickets.reduce((sum: number, ticket: Ticket) => {
        return sum + ticket.ticketPurchases;
    }, 0);

    return (
        <div>
            <div className="container py-10 flex gap-10 items-start">
                <div className="basis-6/10">
                    <section className="rounded-3xl border border-gray-100 bg-white mb-8">
                        <div className="bg-white w-full overflow-hidden rounded-t-3xl relative">
                            <img
                                src={banner}
                                alt={event.title}
                                className="h-120 w-full object-cover"
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
                        <div className='px-8 py-8'>
                            <div className='text-sm'>
                                Curated by {" "}
                                <Link to="#creator" className="font-bold text-primary-theme underline underline-offset-2">
                                    {event.organiser.organiserName}
                                </Link>
                            </div>
                            <div className="flex items-center gap-10 justify-between mb-6">
                                <h1 className="text-xl md:text-3xl font-medium tracking-tighter leading-10">
                                    {event.title}
                                </h1>

                                <div className="flex items-center gap-6">
                                    <RedirectOrFetcher route={`/events/toggle-like/${event.slug}`}>
                                        <button title="Add to favourites" className='relative border p-3 border-gray-200 rounded-full hover:bg-gray-100 cursor-pointer transition'>
                                            <span className="absolute -top-2 -right-2 bg-muted text-muted-foreground border text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                                {(event.likes ?? 0) > 0 && "+"}{event.likes === 0 ? '👀' : event.likes}
                                            </span>
                                            <Heart
                                                className={`${event.liked && 'text-destructive fill-current'}`}
                                            />
                                        </button>
                                    </RedirectOrFetcher>
                                    <SharePage>
                                        <div className='border p-3 border-gray-200 rounded-full hover:bg-gray-100 cursor-pointer transition'>
                                            <Share />
                                        </div>
                                    </SharePage>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div className='flex flex-col gap-3'>
                                    <div className='text-gray-500 flex items-center gap-2'>
                                        <Calendar size={18} />
                                        <span className='text-normal'>{formattedDate}</span> — {" "}
                                        <span className="text-primary font-semibold tracking-tighter">
                                            {to12HourFormat(event.startTime)}
                                        </span>
                                    </div>
                                    <div className='text-gray-500 flex items-center gap-2'>
                                        <MapPin size={18} />
                                        <span className='text-normal capitalize'>{event.city}, {event.country}</span>
                                    </div>
                                </div>

                                <div className='flex items-end gap-16'>
                                    <div className='text-gray-500 flex flex-col items-end gap-1'>
                                        <span className="text-sm">Starts from</span>
                                        <span>
                                            <span className="text-3xl font-bold text-primary-theme">
                                                {event.tickets.length
                                                    ? <FormatPrice price={Math.min(...event.tickets.map(ticket => Number(ticket.price)))} />
                                                    : 'No tickets available'
                                                }
                                            </span>
                                        </span>
                                    </div>
                                    {event.engagementVisible ? (
                                        <div className='text-gray-500 flex flex-col items-end gap-1'>
                                            <span className="text-sm">Tickets Sold</span>
                                            <span>
                                                <span className="text-3xl font-bold text-primary">
                                                    {TOTAL_TICKETS_SALES}
                                                </span>
                                                <span>/{TOTAL_TICKETS}</span>
                                            </span>
                                        </div>
                                    ) : ''}
                                </div>
                            </div>

                            <hr className="my-10" />

                            <div>
                                <h2 className="font-semibold tracking-tighter text-xl text-indigo-800 mb-4">About Event</h2>
                                <div>
                                    <FormatLineBreak input={event.description} />
                                </div>
                            </div>

                            <hr className="my-10" />

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-semibold tracking-tighter text-xl text-indigo-800">Venue and Address</h2>
                                    <Button
                                        size={"sm"} variant={"outline"}
                                        className="shadow-none rounded-full text-primary-theme border-primary-bg tracking-tighter"
                                    >
                                        <MapPin /> View Map
                                    </Button>
                                </div>
                                <div className="mb-5">
                                    <h3 className="font-semibold">Venue & Hall name</h3>
                                    {event.venueName}
                                </div>
                                <div className="mb-5">
                                    <h3 className="font-semibold">Address</h3>
                                    {event.venueAddress}, {" "}
                                    <span className="capitalize">
                                        {event.city}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </section>

                    <section className="rounded-3xl border border-gray-100 bg-white px-8 py-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold tracking-tighter text-xl text-indigo-800">
                                Terms and Conditions
                            </h3>
                            <Ellipsis />
                        </div>

                        <div className="my-6">
                            {TERMS_AND_CONDITIONS.map(term => (
                                <div key={term.id} className="term-section">
                                    <h4 className="text-xs font-semibold mt-4 mb-2">{term.title}</h4>
                                    <ul className="list-disc list-inside text-xs text-gray-600">
                                        {term.details.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                    </section>
                </div>

                <div className="basis-4/10 min-w-0">
                    <aside className="bg-white px-8 py-6 rounded-3xl border border-gray-100 mb-8">
                        <div className="text-sm relative">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-xl tracking-tighter flex items-center gap-2">
                                    <Ticket className="-rotate-45" />
                                    <span>Available tickets</span>
                                </h3>

                                <Ellipsis />
                            </div>
                            <div className="mt-8 overflow-x-auto pb-5 flex flex-col gap-6">
                                {event.tickets.length
                                    ? event.tickets.map(ticket => (
                                        <div className="flex items-center justify-between">
                                            <div className="font-light text-lg tracking-tighter">
                                                {ticket.name}
                                            </div>
                                            <div className="font-light text-lg tracking-tighter">
                                                <FormatPrice price={ticket.price} />
                                            </div>
                                        </div>
                                    ))
                                    : <span className="text-gray-400">No tickets yet</span>
                                }
                            </div>
                        </div>

                        <hr className="my-10" />

                        <div className="text-sm relative mb-10 pb-8 border-b">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-semibold text-xl">Notes</h3>
                                <Ellipsis />
                            </div>
                            <p>{event.extraInfo || <Placeholder text="No notes created by organiser" />}</p>
                        </div>

                        <fieldset className="p-2 mb-6 text-center shadow border mx-auto rounded-lg bg-white">
                            <legend className="rounded-full text-xs font-serif font-semibold px-2 py-1 bg-primary-bg text-primary-theme">
                                Count Down
                            </legend>
                            <Countdown
                                eventDate={event.date}
                                startTime={event.startTime}
                                onComplete={() => console.log("Event has started!")}
                                className="text-gray-500 flex items-start gap-1 mx-auto"
                            />
                        </fieldset>

                        <CheckoutButton event={event} />
                    </aside>

                    <div className="bg-white px-8 py-6 rounded-3xl border border-gray-100 mb-8">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-xl">
                                Comments <span className="font-light text-sm">(0)</span>
                            </h3>
                            <Ellipsis />
                        </div>

                        <div className="my-6">
                            <PostReview event={event} user={user} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
