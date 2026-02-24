import dayjs from 'dayjs';
import { STORAGE_URL } from '~/config/defaults';

import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { EllipsisVertical, Eye, LoaderCircle, Pen, Share, Trash } from 'lucide-react';
import { Form, Link, useNavigation } from 'react-router';
import EventStatus from '../utility/event-status';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useState } from 'react';
import EventPlanBadge from '../utility/event-plan-badge';

export default function DetailedEventCard({ event }: { event: OrganiserEvent }) {
    const formattedDate = dayjs(event.date).format('MMMM D, YYYY');

    const TOTAL_TICKETS: number = event.tickets.reduce((sum: number, ticket: Ticket) => {
        return sum + ticket.quantityAvailable;
    }, 0);
    const TOTAL_TICKETS_SALES: number = event.tickets.reduce((sum: number, ticket: Ticket) => {
        return sum + ticket.ticketPurchases;
    }, 0);

    return (
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
            {/* Left side */}
            <div className="flex gap-3 items-start w-full relative">
                <div className="bg-gray-100 rounded border group-hover:opacity-85 aspect-auto h-30 min-w-18 max-w-18 md:max-w-full overflow-hidden transition">
                    {event.bannerUrl && (
                        <img
                            src={event.bannerUrl && `${STORAGE_URL}/${event.bannerUrl}`}
                            alt={event.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    )}
                </div>
                <div className='flex flex-col gap-2'>
                    <h4 className='text-md font-medium tracking-tight md:font-medium leading-5'>{event.title}</h4>
                    <p className='text-gray-700 text-xs'>
                        {formattedDate} at {event.startTime.split(":")[0]}:{event.startTime.split(":")[1]} ∙ {event.venueName}, <span className="capitalize">{event.city}, {event.country}</span>
                    </p>
                    <p className='font-light text-gray-500 text-[12px]'>
                        {TOTAL_TICKETS_SALES}/{TOTAL_TICKETS} tickets sold
                    </p>
                    <EventPlanBadge tier={event.eventPlan?.tier} />
                </div>
                <Link to={`/my-events/${event.slug}`} aria-hidden="true" className="absolute inset-0" />
            </div>

            {/* Right side */}
            <div className="flex gap-3 items-center w-max">
                <div className="hidden md:inline-block">
                    <EventStatus date={event.date} startTime={event.startTime} status={event.status} />
                </div>
                {window.location.pathname === '/my-events' && (
                    <Actions event={event} />
                )}
            </div>
        </div>
    )
}

function Actions({ event }: { event: OrganiserEvent }) {
    const [input, setInput] = useState('');

    const { state } = useNavigation();
    const busy: boolean = state === "submitting" || state === "loading";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                    <EllipsisVertical size={14} strokeWidth={3} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-max relative md:right-[40%]">
                <Link to={`${event.slug}`}>
                    <DropdownMenuItem className='cursor-pointer flex items-center gap-2'>
                        <Eye size={16} strokeWidth={1.5} />
                        <span>View</span>
                    </DropdownMenuItem>
                </Link>

                <DropdownMenuItem className='cursor-pointer flex items-center gap-2' onClick={() => {
                    const shareData = {
                        title: event.title,
                        text: event.description,
                        url: window.location.href
                    };
                    navigator.share(shareData);
                }}>
                    <Share size={16} strokeWidth={1.5} />
                    <span>Share</span>
                </DropdownMenuItem>

                <Link to={`${event.slug}/edit`}>
                    <DropdownMenuItem className='cursor-pointer flex items-center gap-2'>
                        <Pen size={16} strokeWidth={1.5} />
                        <span>Edit</span>
                    </DropdownMenuItem>
                </Link>

                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className='rounded-sm w-full h-8 py-0 border-0 text-start text-destructive hover:bg-red-50 hover:text-destructive cursor-pointer flex items-center justify-start gap-2'
                            >
                                <Trash size={16} strokeWidth={1.5} />
                                <span>Delete</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-106.25">
                            <Form method='POST'>
                                <input type="hidden" name="event_slug" value={event.slug} />
                                <DialogHeader>
                                    <DialogTitle className="text-destructive">Delete Event ?</DialogTitle>
                                    <DialogDescription>
                                        This will delete all related tickets, and payment records associated with this event.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 my-5">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name-1">Write "Delete {event.title}" to continue</Label>
                                        <Input
                                            className="rounded-full py-5 text-sm"
                                            autoComplete="off"
                                            id="name-1"
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Enter text"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        className="w-full py-5 bg-destructive rounded-full"
                                        disabled={(input !== `Delete ${event.title}`) || busy}
                                    >
                                        {busy ? (<LoaderCircle className="animate-spin" />) : " Delete Ticket"}
                                    </Button>
                                </DialogFooter>
                            </Form>
                        </DialogContent>
                    </form>
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}