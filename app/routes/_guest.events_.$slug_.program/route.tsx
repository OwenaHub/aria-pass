import client from "~/http/client";
import type { Route } from "../_guest.events_.$slug/+types/route";
import { toast } from "sonner";
import { Link, redirect } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { FormatLineBreak } from "~/components/utility/format-line-break";
import { Calendar, Share } from "lucide-react";
import dayjs from "dayjs";
import { to12HourFormat } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    try {
        const { data } = await client.get(`api/events/${params.slug}/program`);

        return { event: data }
    } catch (error: any) {
        toast.error("Something went wrong", {
            description: `Status code ${error.status} - Unable to load resource`
        });
        return redirect('/')
    }
}


export default function EventProgram({ loaderData }: Route.ComponentProps) {
    const { event }: { event: OrganiserEvent } = loaderData;
    const formattedDate = dayjs(event.date).format('MMMM D, YYYY');

    return (
        <div className="relative">
            <section
                className="container sticky top-0 py-18 h-80 bg-primary-theme flex flex-col justify-between"
                style={{
                    backgroundImage: `linear-gradient(360deg, #625DF5, #625DF5aa), url('/images/logos/alt_logo.png')`,
                    backgroundSize: 'cover, 100%',
                    backgroundPosition: 'center, center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div />
                <div className="text-white">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-5">{event.title}</h1>
                    <div className='text-white flex items-center gap-2 tracking-tighter font-medium'>
                        <Calendar size={18} />
                        <span className='text-normal'>{formattedDate}</span> — {" "}
                        <span className="text-primary font-semibold tracking-tighter">
                            {to12HourFormat(event.startTime)}
                        </span>
                    </div>
                </div>
            </section>

            <section className="container pt-14 bg-white relative -top-10 rounded-t-3xl">
                <Accordion
                    type="single"
                    collapsible
                    defaultValue={`item-0`}
                    className=" bg-gray-50 rounded-lg"
                >
                    {event?.eventProgram && event.eventProgram[0].programItems.map((programItem, index) => (
                        <AccordionItem key={programItem.id} value={`item-${index}`} className="px-5">
                            <AccordionTrigger className="text-sm tracking-tighter">
                                <div>
                                    <span className="font-bold inline-block me-1">{index + 1}.{" "} </span>
                                    <span> {programItem.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-xs">
                                {programItem.description
                                    ? (
                                        <div>
                                            <FormatLineBreak input={programItem.description} />
                                        </div>
                                    )
                                    : <span className="text-gray-400 text-xs italic">No content</span>}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            <div className="border p-1.5 border-gray-100 shadow-lg  bg-white/35 backdrop-blur-xs rounded-full w-max fixed bottom-10 z-50 left-1/2 -translate-x-1/2">
                <section className="flex items-center gap-2">
                    <Link to={`/events/${event.slug}/checkout`}>
                        <Button
                            variant={'secondary'}
                            className="rounded-full flex gap-2 items-center text-xs font-bold tracking-tight"
                        >
                            {/* <Share className="w-4 h-4 text-primary" /> */}
                            <span className="font-medium">
                                Buy Ticket
                            </span>
                        </Button>
                    </Link>
                    <Button
                        variant={'outline'}
                        className="rounded-full flex gap-2 items-center text-xs font-bold tracking-tight"
                        onClick={() => {
                            const shareData = {
                                title: event.title,
                                text: event.description,
                                url: window.location.href
                            };
                            navigator.share(shareData);
                        }}
                    >
                        <Share className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                            Share
                        </span>
                    </Button>
                </section>
            </div>
        </div>
    )
}
