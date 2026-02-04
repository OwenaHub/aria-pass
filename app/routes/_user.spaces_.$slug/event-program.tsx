import { ChevronRight, Pencil, Plus, X } from "lucide-react"
import { useState } from "react"
import { Form } from "react-router"
import DefaultButton from "~/components/buttons/default-button"
import EmptyState from "~/components/skeletons/empty-state"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "~/components/ui/sheet"

export default function EventProgram({ event }: { event: OrganiserEvent }) {
    const [newProgram, setNewProgram] = useState<boolean>(false);
    const [editProgram, setEditedProgram] = useState<boolean>(false);

    //! READ THE COMMENTS

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 shadow-none rounded-lg">
                    <span className="tracking-tighter text-sm">Event program</span>
                    <ChevronRight />
                </Button>
            </SheetTrigger>
            <SheetContent className="px-4 border-2">
                <SheetHeader className="h-15" />
                {event.eventProgram && event.eventProgram.length > 0
                    ? (event.eventProgram.map((item) => (
                        <div key={item.id} className="">
                            <p className="tracking-tight text-sm font-light">Event Program</p>
                            {editProgram ? (
                                // Edit program title
                                <Form method="POST" className="grid gap-5">
                                    <h3 className="font-semibold text-lg tracking-tighter">Create new program</h3>
                                    <input type="hidden" name="type" value="program.edit" />
                                    <input type="hidden" name="program_id" value={item.id} />
                                    <div>
                                        <Label htmlFor={`sheet-demo-name-new`}>Edit title</Label>
                                        <Input
                                            name="title"
                                            className="py-5 rounded-lg mt-1"
                                            defaultValue={item.title}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="basis-10/12">
                                            <DefaultButton text="Update program" />
                                        </div>
                                        <Button
                                            className="basis-2/12 rounded-full py-6 cursor-pointer"
                                            variant="secondary"
                                            size={'icon'}
                                            onClick={() => setEditedProgram(false)}>
                                            <X />
                                        </Button>
                                    </div>
                                </Form>
                            ) : (<>
                                <h3 className="font-semibold text-xl tracking-tighter flex items-center gap-3">
                                    <span>{item.title}</span>
                                    <Pencil
                                        className="size-4 hover:text-primary-theme cursor-pointer"
                                        strokeWidth={2}
                                        onClick={() => setEditedProgram(true)}
                                    />
                                </h3>
                            </>
                            )}

                            {!editProgram && (
                                <div className="mt-8">
                                    <Button variant={'secondary'} className="flex items-center gap-1 rounded-lg">
                                        <Plus />
                                        <span>Add item</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )))

                    // Empty state 
                    : <div>
                        {newProgram
                            // Create program
                            ? (<Form method="POST" className="grid gap-5">
                                <h3 className="font-semibold text-lg tracking-tighter">Create new program</h3>
                                <input type="hidden" name="type" value="program.create" />
                                <div>
                                    <Label htmlFor={`sheet-demo-name-new`}>Add title</Label>
                                    <Input
                                        name="title"
                                        className="py-5 rounded-lg mt-1"
                                        defaultValue={event.title + ' program'}
                                        autoFocus
                                    />
                                </div>
                                <DefaultButton text="Add program" />
                            </Form>)
                            : (<>
                                <EmptyState />
                                <Button
                                    variant="outline"
                                    className="mx-auto block"
                                    onClick={() => setNewProgram(true)}
                                >
                                    Add program
                                </Button>
                            </>)}
                    </div>
                }
            </SheetContent >
        </Sheet >
    )
}