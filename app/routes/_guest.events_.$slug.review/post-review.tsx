import * as React from "react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "~/components/ui/drawer"
import { Label } from "~/components/ui/label"
import { useMediaQuery } from "~/hooks/user-media-query"
import { Textarea } from "~/components/ui/textarea"
import DefaultButton from "~/components/buttons/default-button"
import { Link, useFetcher, useNavigation } from "react-router";
import { ChevronRight, Pen } from "lucide-react"
import { Switch } from "~/components/ui/switch"

export default function PostReview({ event, user }: { event: OrganiserEvent, user: User }) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const navigation = useNavigation();
    const formRef = React.useRef<HTMLFormElement>(null);

    React.useEffect(() => {
        // We only want to close the dialog if the form submission is successful
        // and the state is returning to "idle" from a "submitting" state.]
        if (navigation.state === "idle") {
            setOpen(false);

            formRef.current?.reset();
        }
    }, [navigation.state, navigation.formData]);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        size={'sm'}
                        variant={'secondary'}
                        className="rounded-md px-0 text-primary text-sm font-light cursor-pointer tracking-tight"
                    >
                        <span className="border-e border-primary pe-2">
                            Write a review
                        </span>
                        <Pen size={14} strokeWidth={2.5} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Review</DialogTitle>
                        <DialogDescription>
                            {/*  */}
                        </DialogDescription>
                    </DialogHeader>
                    {!user.email ? (
                        <div className="text-start pb-5">
                            <p className="text-sm text-gray-500">
                                You need to log in before posting a review.
                            </p>
                            <Link
                                to={`/login?redirect=/events/${event.slug}/review`}
                                className="text-center text-sm pt-4 inline-block underline underline-offset-2"
                            >
                                <span>Continue</span>
                                <ChevronRight className="inline-block ms-1" size={14} strokeWidth={2.5} />
                            </Link>
                        </div>
                    ) : <ProfileForm event={event} ref={formRef} />}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size={'sm'}
                    variant={'secondary'}
                    className="rounded-md px-0 text-primary text-sm font-light cursor-pointer tracking-tight"
                >
                    <span className="border-e border-primary pe-2">
                        Write a review
                    </span>
                    <Pen size={14} strokeWidth={2.5} />
                </Button>
            </DialogTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Review</DrawerTitle>
                    <DrawerDescription>
                        {/*  */}
                    </DrawerDescription>
                </DrawerHeader>
                {!user.email ? (
                    <div className="text-center container pb-5">
                        <p className="text-sm text-gray-500">
                            You need to log in before posting a review.
                        </p>
                        <Link
                            to={`/login?redirect=/events/${event.slug}/review`}
                            className="text-center text-sm pt-4 inline-block underline underline-offset-2"
                        >
                            <span>Continue</span>
                            <ChevronRight className="inline-block ms-1" size={14} strokeWidth={2.5} />
                        </Link>
                    </div>
                ) : <ProfileForm event={event} className="px-4" ref={formRef} />}
                <DrawerFooter className="pt-2">
                    {/* <DrawerClose asChild>
                        <Button
                            variant="outline"
                            className="rounded-full text-primary text-xs hover:bg-gray-600 font-light cursor-pointer w-full tracking-wide py-5 uppercase"
                        >
                            Cancel
                        </Button>
                    </DrawerClose> */}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

type ProfileFormProps = {
    event: OrganiserEvent;
} & React.ComponentProps<"form">;

const ProfileForm = React.forwardRef<HTMLFormElement, ProfileFormProps>(

    function ProfileForm({ className, event }, ref) {
        const fetcher = useFetcher();

        const [isAnonymous, setIsAnonymous] = React.useState(false);
        const [toOrganiser, setToOrganiser] = React.useState(false);

        return (
            <fetcher.Form
                ref={ref}
                method="POST"
                action={`/events/${event.slug}/review`}
                className={cn("grid items-start gap-3", className)}
            >
                {/* <input type="hidden" name="type" value={'ticket.edit'} required /> */}
                <div className="grid gap-2">
                    <Label htmlFor="comment">Content</Label>
                    <Textarea
                        className="placeholder:text-gray-300 rounded-lg min-h-[140px]"
                        id="comment"
                        name="comment"
                        rows={6}
                    />
                </div>

                <div className="mb-5 rounded-lg w-full flex gap-2 items-center">
                    <div className="bg-gray-100 flex-1 p-4 rounded-md flex items-center space-x-2">
                        <Switch
                            id="post-anonymously"
                            checked={isAnonymous}
                            onCheckedChange={(checked) => setIsAnonymous(checked)}
                        />
                        <Label htmlFor="post-anonymously" className="text-[10px] text-nowrap">
                            Post anonymously
                        </Label>
                        <input type="hidden" name="is_anonymous" value={isAnonymous ? 1 : 0} />
                    </div>

                    <div className="bg-gray-100 flex-1 p-4 rounded-md flex items-center space-x-2">
                        <Switch
                            id="to-organiser"
                            checked={toOrganiser}
                            onCheckedChange={(checked) => setToOrganiser(checked)}
                        />
                        <Label htmlFor="to-organiser" className="text-[10px]">
                            To organiser only
                        </Label>
                        <input type="hidden" name="is_public" value={toOrganiser ? 1 : 0} />
                    </div>
                </div>

                <DefaultButton text="Post review" />
            </fetcher.Form>
        );
    }
);

// Set the displayName for clarity in DevTools
ProfileForm.displayName = "ProfileForm";