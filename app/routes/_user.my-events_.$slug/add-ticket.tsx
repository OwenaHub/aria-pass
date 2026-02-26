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
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/components/ui/drawer"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useMediaQuery } from "~/hooks/user-media-query"
import { Textarea } from "~/components/ui/textarea"
import DefaultButton from "~/components/buttons/default-button"
import { Check, Ticket } from "lucide-react"
import { Form, useNavigation } from "react-router"
import { getUpgradeTarget } from "~/lib/d.store"
import UpgradePlan from "~/components/cards/upgrade-plan"

export default function AddTicket({ event }: { event: OrganiserEvent }) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const navigation = useNavigation();
    const formRef = React.useRef<HTMLFormElement>(null);

    const ticketUpgrade = getUpgradeTarget(event, 'ticketTierCount');

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
                        variant={'secondary'}
                        className="text-primary text-xs flex items-center gap-2 tracking-tight rounded-md"
                    >
                        <Ticket className="size-4" />
                        <span>Add Ticket</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>Add ticket to event</DialogTitle>
                        <DialogDescription>
                            {/*  */}
                        </DialogDescription>
                    </DialogHeader>
                    {ticketUpgrade
                        ? (<UpgradePlan targetTier={ticketUpgrade} featureName="Ticket Tiers" />)
                        : (<ProfileForm ref={formRef} />)
                    }
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant={'secondary'}
                    className="text-primary w-full text-xs flex items-center py-5 gap-2 tracking-tight rounded-md"
                >
                    <Ticket className="size-4" />
                    <span>Add Ticket</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add ticket to event</DrawerTitle>
                    <DrawerDescription>
                        {/*  */}
                    </DrawerDescription>
                </DrawerHeader>
                {ticketUpgrade
                    ? (<UpgradePlan targetTier={ticketUpgrade} featureName="Ticket Tiers" />)
                    : (<ProfileForm className="px-4" ref={formRef} />)
                }

                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button
                            variant="outline"
                            className="rounded-full text-primary text-xs hover:bg-gray-600 font-light cursor-pointer w-full tracking-wide py-5 uppercase"
                        >
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const ProfileForm = React.forwardRef<HTMLFormElement, React.ComponentProps<"form">>(
    function ProfileForm({ className }, ref) {
        const [theme, setTheme] = React.useState('');
        const THEMES = ["#6B7280", "#10B981", "#F59E0B", "#4F46E5",]

        return (
            <Form ref={ref} className={cn("grid items-start gap-6", className)} method="POST">
                <input type="hidden" name="type" value={'ticket.create'} required />

                <div className="grid gap-2">
                    <Label htmlFor="theme">Select theme</Label>
                    <div className="flex items-stretch gap-3">
                        {THEMES.map(color => (
                            <div className="relative h-14 flex-1" key={color}>
                                <button
                                    title={`Select ${color}`}
                                    onClick={() => setTheme(color)}
                                    type="button"
                                    style={{ backgroundColor: color }}
                                    className="inline-block h-14 w-full rounded-md"
                                />
                                {theme === color && (
                                    <Check
                                        strokeWidth={5}
                                        className="animated fadeIn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <input type="hidden" name="theme" value={theme} required />

                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        className="py-5 rounded-full placeholder:text-gray-300"
                        type="text"
                        id="name"
                        name="name"
                        defaultValue="Regular"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        className="placeholder:text-gray-300 rounded-xl"
                        id="description"
                        defaultValue="Tickets for regular members who will sit behind"
                        name="description"
                    />
                </div>

                <div className="flex items-stretch gap-5">
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            className="py-5 rounded-full placeholder:text-gray-300"
                            type="number"
                            id="price"
                            name="price"
                            placeholder="5,000"
                            required
                        />
                    </div>
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="quantity_available">Available units</Label>
                        <Input
                            className="py-5 rounded-full placeholder:text-gray-300"
                            type="number"
                            id="quantity_available"
                            name="quantity_available"
                            placeholder="50"
                            required
                        />
                    </div>
                </div>

                <DefaultButton text="Save ticket" allowed={!!theme} />
            </Form>
        )
    }
);

ProfileForm.displayName = "ProfileForm";