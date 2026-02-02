import { LoaderCircle, Trash } from "lucide-react"
import { useState } from "react"
import { Form, useNavigation } from "react-router"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

export function DeleteTicket({ ticket }: { ticket: Ticket }) {
    const [input, setInput] = useState('');

    const { state } = useNavigation();
    const busy: boolean = state === "submitting" || state === "loading";

    return (
        <Dialog>
            <div>
                <DialogTrigger asChild>
                    <Trash size={20} strokeWidth={1} />
                </DialogTrigger>

                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete the {ticket.name} ticket ?</DialogTitle>
                        <DialogDescription>
                            This will delete all related payment records associated with this ticket.
                        </DialogDescription>
                    </DialogHeader>

                    <Form method='post'>
                        <input type="hidden" name="type" value={'ticket.delete'} required />
                        <input type="hidden" name="ticket_id" value={ticket.id} required />

                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Write "Delete {ticket.name} ticket" to continue</Label>
                                <Input
                                    className="rounded-full py-5 text-sm"
                                    autoComplete="off"
                                    id="name-1"
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter text"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 flex justify-between flex-row-reverse">
                            <Button
                                type="submit"
                                className="w-full py-5 bg-destructive rounded-full"
                                disabled={(input !== `Delete ${ticket.name} ticket`) || busy}
                            >
                                {busy ? (<LoaderCircle className="animate-spin" />) : " Delete Ticket"}
                            </Button>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </div>
        </Dialog>
    )
}
