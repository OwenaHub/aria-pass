import dayjs from "dayjs"
import { MessageSquare, ShieldQuestionMark } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { FormatLineBreak } from "~/components/utility/format-line-break";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function EventReview({ event }: { event: OrganiserEvent }) {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant={"outline"} size={"sm"} className="flex items-center gap- px-4">
                        <span>
                            {event.reviews.length}
                        </span>
                        <MessageSquare />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>All Comments</DialogTitle>
                    </DialogHeader>
                    <div>
                        {event.reviews.map((review) => (
                            <div className="bg-gray-100 rounded-md mb-2 px-2 py-1">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium text-sm tracking-tight">
                                        {review.isAnonymous
                                            ? <div className="flex items-center gap-0.5" title="This review is anonymous">
                                                <span className="text-gray-500">
                                                    Anonymous
                                                </span>
                                                <ShieldQuestionMark
                                                    className="size-4 fill-primary text-white"
                                                />
                                            </div>
                                            : review.user.name
                                        }
                                    </div>
                                    <div className="text-xs text-gray-500 italic  tracking-tight">
                                        {dayjs(review.createdAt).fromNow()}
                                    </div>
                                </div>

                                <div className="text-gray-700 text-sm tracking-tight">
                                    <FormatLineBreak input={review.comment} />
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}
