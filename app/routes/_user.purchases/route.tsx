import client from '~/http/client';
import type { Route } from '../_user.purchases/+types/route';
import { Link, redirect, useSearchParams, type MetaFunction } from 'react-router';
import { useEffect, useState } from 'react';
import { Calendar, Check, Clock, Info, Link2Icon, Ticket, X } from 'lucide-react';
import RecordFilter from '~/components/utility/record-filter';
import FormatPrice from '~/components/utility/format-price';
import { defaultMeta } from '~/lib/meta';
import PaymentStatusModal from './payment-status-modal';
import QRCode from "react-qr-code";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { to12HourFormat } from '~/lib/utils';
import { STORAGE_URL } from '~/config/defaults';

type TGroupedPurchases = {
    eventId: number,
    eventTitle: string,
    tickets: TicketPurchase[];
}

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Purchases | AriaPass" },
    ];
}

export async function clientLoader() {
    try {
        const { data } = await client.get('/api/tickets/purchases');

        return { tickets: data }
    } catch ({ response }: any) {
        return redirect('/dashboard')
    }
}

export default function Purchases({ loaderData }: Route.ComponentProps) {
    const { tickets }: { tickets: TicketPurchase[] } = loaderData;

    const [searchParams] = useSearchParams();
    const [filteredData, setFilteredData] = useState<TGroupedPurchases[]>([]);

    const FILTERS = [
        {
            label: "Completed",
            icon: <Check size={16} strokeWidth={1} />,
        },
        {
            label: "Failed",
            icon: <X size={16} strokeWidth={1} />,
        },
        {
            label: "Pending",
            icon: <Clock size={16} strokeWidth={1} />,
        },
    ]

    useEffect(() => {
        const data = tickets.filter((item: any) => {
            if (searchParams.get("status")) {
                return item.status === searchParams.get("status");
            }
            return true;
        });

        const sorted = sortPurchases(data);
        setFilteredData(sorted);
    }, [searchParams, tickets]);

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
            <PaymentStatusModal />
            <section>
                <div className="flex flex-col lg:flex-row gap-7 justify-between lg:items-end sticky top-5 z-5">
                    <div>
                        <h1 className='text-primary text-3xl font-bold tracking-tight mb-5'>
                            Purchases
                        </h1>
                        <small></small>
                        <RecordFilter data={FILTERS} />
                    </div>
                </div>

                {(filteredData && filteredData.length) ? (
                    <div className='flex flex-col gap-4 mt-8'>
                        {filteredData.map((group: TGroupedPurchases) => (
                            <section className='flex md:flex-row flex-col gap-3 place-items-stretch' key={group.eventId}>
                                <div className='bg-gray-100 py-5 rounded-md px-5 sticky top-30 z-1 md:w-[300px]'>
                                    <small className='font-light'>Event</small>
                                    <h3 className='font-semibold tracking-tighter text-sm text-primary '>{group.eventTitle}</h3>
                                </div>
                                <div className='flex flex-col gap-2 flex-1'>
                                    {group.tickets.map((purchase) => (
                                        <div key={purchase.id} className='border rounded-md py-2.5 px-2 flex gap-2 hover:cursor-pointer hover:shadow-lg transition'>
                                            <div className='w-1.5 min-h-f] bg-red-500 rounded'
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
                            {searchParams.get('status')
                                ? <span>
                                    No {searchParams.get('status')} purchase
                                </span>
                                : <span>
                                    No purchases yet
                                </span>
                            }
                        </p>
                    </div>
                )
                }
            </section >
        </div >
    )
}
