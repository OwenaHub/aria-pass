import * as React from "react"
import { cn } from "~/lib/utils"
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
import { ChevronRight } from "lucide-react"
import { Switch } from "~/components/ui/switch"

interface PostReviewProps {
    event: OrganiserEvent;
    user: User;
    children: React.ReactNode; // This allows you to wrap any button
}

export default function PostReviewWrapper({ event, user, children }: PostReviewProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const navigation = useNavigation();
    const formRef = React.useRef<HTMLFormElement>(null);

    React.useEffect(() => {
        if (navigation.state === "idle") {
            setOpen(false);
            formRef.current?.reset();
        }
    }, [navigation.state]);

    // Shared content to avoid repetition
    const renderContent = () => (
        <>
            {!user.email ? (
                <div className="text-start pb-5 px-4 md:px-0">
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
            ) : <ProfileForm event={event} ref={formRef} className="px-4 md:px-0" />}
        </>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Review</DialogTitle>
                        <DialogDescription>Share your thoughts about this event.</DialogDescription>
                    </DialogHeader>
                    {renderContent()}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Review</DrawerTitle>
                    <DrawerDescription>Share your thoughts about this event.</DrawerDescription>
                </DrawerHeader>
                {renderContent()}
                <DrawerFooter className="pt-2" />
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
                    <Textarea
                        className="placeholder:text-gray-300 rounded-lg min-h-[140px]"
                        id="comment"
                        name="comment"
                        rows={6}
                        required
                        placeholder="Write your review here..."
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