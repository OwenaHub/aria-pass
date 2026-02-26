import { Check, Send, SquarePen, Ticket, X, AlertCircle } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { isPastEventDate } from "~/lib/utils";

export default function UpdateEventStatus({ event }: { event: any }) {
    const fetcher = useFetcher();

    // Derived state for cleaner JSX
    const hasTickets = event.tickets && event.tickets.length > 0;
    const isPublished = event.status === 'published';
    const isPast = isPastEventDate(event.date, event.startTime);

    return (
        <div className="flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-4 bg-gray-50 border border-gray-100 p-3 xl:p-2 rounded-2xl w-full xl:w-max">
            {!hasTickets && (
                <div className="flex items-center justify-between xl:justify-start gap-3 pb-3 xl:pb-0 border-b xl:border-b-0 xl:border-r border-gray-200 xl:pr-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight text-amber-600 bg-white px-2 py-1 rounded">
                        <AlertCircle className="size-3 shrink-0" strokeWidth={3} />
                        <span className="inline">Add tickets to publish</span>
                    </span>
                </div>
            )}

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">

                <fetcher.Form method="post" action={`/my-events/${event.slug}/status`} className="m-0 col-span-2 sm:w-auto">
                    <input type="hidden" name="status" value="published" />
                    <Button
                        type="submit"
                        disabled={!hasTickets || isPublished}
                        className={`w-full h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${isPublished
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-primary-theme text-white shadow-md shadow-indigo-200 hover:bg-indigo-700'
                            }`}
                        variant={isPublished ? "ghost" : "default"}
                    >
                        <Send className="size-3.5 shrink-0" /> Publish Event
                    </Button>
                </fetcher.Form>

                <fetcher.Form method="post" action={`/my-events/${event.slug}/status`} className="m-0 col-span-1 sm:w-auto">
                    <input type="hidden" name="status" value="draft" />
                    <Button
                        type="submit"
                        disabled={!isPublished}
                        variant="outline"
                        className="w-full h-9 rounded-lg text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 px-3"
                    >
                        <SquarePen className="size-3.5 shrink-0" />
                        <span className="hidden sm:inline">Revert to Draft</span>
                        <span className="sm:hidden">Draft</span>
                    </Button>
                </fetcher.Form>

                <fetcher.Form method="post" action={`/my-events/${event.slug}/status`} className="m-0 col-span-1 sm:w-auto">
                    <input type="hidden" name="status" value="completed" />
                    <Button
                        type="submit"
                        disabled={!isPublished}
                        variant="outline"
                        className="w-full h-9 rounded-lg text-xs font-bold border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 flex items-center justify-center gap-2 px-3 transition-colors"
                    >
                        {isPast ? (
                            <><Check className="size-3.5 shrink-0" /> <span className="hidden sm:inline">Mark Done</span><span className="sm:hidden">Done</span></>
                        ) : (
                            <><Ticket className="size-3.5 shrink-0" /> <span className="hidden sm:inline">Close Sales</span><span className="sm:hidden">Close</span></>
                        )}
                    </Button>
                </fetcher.Form>

                {/* Cancel Action - Full width on mobile */}
                <Button
                    disabled
                    variant="ghost"
                    className="w-full sm:w-auto h-9 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-700 flex items-center justify-center gap-2 opacity-60 col-span-2 mt-1 sm:mt-0"
                >
                    <X className="size-3.5 shrink-0" /> Cancel Event
                </Button>

            </div>
        </div>
    );
}