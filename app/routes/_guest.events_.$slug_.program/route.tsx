import client from "~/http/client";
import type { Route } from "../_guest.events_.$slug/+types/route";
import { toast } from "sonner";
import { redirect } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { FormatLineBreak } from "~/components/utility/format-line-break";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import { to12HourFormat } from "~/lib/utils";

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
        <div>
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
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tighter mb-5">{event.title}</h1>
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
        </div>
    )
}
