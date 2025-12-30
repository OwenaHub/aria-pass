import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Pen, ShieldQuestionMark, Trash } from "lucide-react";
import React from "react";
import { Textarea } from "../ui/textarea";
import { useFetcher } from "react-router";
import { Button } from "../ui/button";
import { FormatLineBreak } from "../utility/format-line-break";

dayjs.extend(relativeTime);

export default function ReviewCard({ review, user }: {
    review: EventReviews, user: User,
}) {
    const [isEditing, setIsEditing] = React.useState(false);

    const fetcher = useFetcher();

    React.useEffect(() => {
        if (fetcher.state === 'loading') {
            setIsEditing(false);
        }
    }, [fetcher.state]);

    return (
        <div key={review.id} className="mb-5">
            {isEditing ? (
                <div>
                    <fetcher.Form
                        preventScrollReset
                        method="patch"
                        action={`reviews/${review.id}/edit`}
                    >
                        <Textarea name="comment"className="text-sm"  defaultValue={review.comment} />

                        <div className="flex items-center gap-2 mt-2">
                            <Button
                                className="text-xs"
                                size={'sm'}
                                type="submit"
                            >
                                Save
                            </Button>
                            <Button
                                className="text-xs " size={'sm'}
                                variant={'secondary'}
                                type="button"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </fetcher.Form>
                </div>
            ) : (
                <>
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
                </>
            )}

            <div className="flex items-center gap-4 mt-2">
                {(user.id === review.user.id && !isEditing) &&
                    <>
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="text-xs font-light text-gray-500 flex items-center gap-1 mt-2 hover:text-primary transition cursor-pointer"
                        >
                            <span>Edit</span> <Pen className="size-3" />
                        </button>

                        <fetcher.Form
                            preventScrollReset
                            method="DELETE"
                            action={`reviews/${review.id}/delete`}
                        >
                            <button
                                type="submit"
                                className="text-xs font-light text-destructive flex items-center gap-1 mt-2 transition cursor-pointer"
                            >
                                <span>Delete</span> <Trash className="size-3" />
                            </button>
                        </fetcher.Form>
                    </>
                }
            </div>
        </div>
    )
}
