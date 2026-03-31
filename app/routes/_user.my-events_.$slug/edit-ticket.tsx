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
import { Check, PencilLine } from "lucide-react"
import { Form, useNavigation } from "react-router";

export default function EditTicket({ ticket }: { ticket: Ticket }) {
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
                    <PencilLine className="cursor-pointer hover:opacity-50" size={20} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle className="tracking-tighter font-bold">Edit {ticket.name} ticket</DialogTitle>
                        <DialogDescription>
                            {/*  */}
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm ticket={ticket} ref={formRef} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <PencilLine className="cursor-pointer hover:opacity-50" size={20} />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit {ticket.name} ticket</DrawerTitle>
                    <DrawerDescription>
                        {/*  */}
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" ticket={ticket} ref={formRef} />
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

type ProfileFormProps = {
    ticket: Ticket;
} & React.ComponentProps<"form">;

const ProfileForm = React.forwardRef<HTMLFormElement, ProfileFormProps>(
    function ProfileForm({ className, ticket }, ref) {
        const THEMES = ["#6B7280", "#10B981", "#F59E0B", "#4F46E5"];
        const [theme, setTheme] = React.useState(ticket.theme);

        return (
            <Form ref={ref} className={cn("grid items-start gap-6", className)} method="POST">
                <input type="hidden" name="type" value={'ticket.edit'} required />
                <input type="hidden" name="ticket_id" value={ticket.id} required />

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
                        defaultValue={ticket.name}
                        required
                    />
                </div>

                <input
                    type="hidden"
                    className="placeholder:text-gray-300 rounded-xl"
                    id="description"
                    defaultValue={ticket.description}
                    name="description"
                />

                <div className="flex items-stretch gap-5">
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            className="py-5 rounded-full placeholder:text-gray-300"
                            type="number"
                            id="price"
                            name="price"
                            placeholder="5,000"
                            defaultValue={ticket.price}
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
                            defaultValue={ticket.quantityAvailable}
                            placeholder="50"
                            required
                        />
                    </div>
                </div>

                <DefaultButton text="Edit ticket" allowed={!!theme} />
            </Form>
        );
    }
);

// Set the displayName for clarity in DevTools
ProfileForm.displayName = "ProfileForm";