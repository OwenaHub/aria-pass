import { Check, ChevronDown, Send, SquarePen, Ticket, X } from "lucide-react"
import { useFetcher } from "react-router"
import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { isPastEventDate } from "~/lib/utils";

export default function UpdateEventStatus({ event }: { event: OrganiserEvent }) {
    const fetcher = useFetcher();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex flex-col gap-1 items-center">
                    <Button variant="secondary" size="sm">
                        Change status <ChevronDown />
                    </Button>
                    {event.tickets.length === 0 && (
                        <span className="text-xs text-destructive">
                            No ticket added
                        </span>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-max relative">
                <DropdownMenuItem disabled>
                    Cancel event
                    <DropdownMenuShortcut><X /></DropdownMenuShortcut>
                </DropdownMenuItem>

                <fetcher.Form method="post" action={`/my-events/${event.slug}/status`}>
                    <DropdownMenuItem disabled={!(event.tickets.length > 0) || (event.status === 'published')}>
                        <input type="hidden" name="status" value="published" />
                        <button>Publish</button>
                        <DropdownMenuShortcut><Send /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </fetcher.Form>

                <fetcher.Form method="post" action={`/my-events/${event.slug}/status`}>
                    <DropdownMenuItem disabled={event.status !== 'published'}>
                        <input type="hidden" name="status" value="draft" />
                        <button>Turn to draft</button>
                        <DropdownMenuShortcut><SquarePen /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </fetcher.Form>

                {isPastEventDate(event.date, event.startTime)
                    ? (
                        <fetcher.Form method="post" action={`/my-events/${event.slug}/status`}>
                            <DropdownMenuItem disabled={event.status !== 'published'}>
                                <input type="hidden" name="status" value="completed" />
                                <button>Mark done</button>
                                <DropdownMenuShortcut><Check /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </fetcher.Form>
                    ) : (
                        <fetcher.Form method="post" action={`/my-events/${event.slug}/status`}>
                            <DropdownMenuItem disabled={event.status !== 'published'}>
                                <input type="hidden" name="status" value="completed" />
                                <button>Close sales</button>
                                <DropdownMenuShortcut><Ticket /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </fetcher.Form>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu >
    )
}
