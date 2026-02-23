import { ChevronRight, Pencil, Plus, Trash, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useFetcher } from "react-router"
import DefaultButton from "~/components/buttons/default-button"
import EmptyState from "~/components/skeletons/empty-state"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "~/components/ui/sheet"

import { Textarea } from "~/components/ui/textarea"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion"
import { FormatLineBreak } from "~/components/utility/format-line-break"
import UpgradePlan from "../cards/upgrade-plan"
import { getUpgradeTarget } from "~/lib/d.store"

export default function EventProgram({ event }: { event: OrganiserEvent }) {
    const fetcher = useFetcher();

    const eventProgramUpgrade = getUpgradeTarget(event, 'hasEventProgram');

    const [newProgram, setNewProgram] = useState<boolean>(false);
    const [editProgram, setEditedProgram] = useState<boolean>(false);
    const [newItem, setNewItem] = useState<boolean>(false);
    const [itemToEdit, setItemToEdit] = useState<{ id: string, title: string, description: string } | null>(null);

    useEffect(() => {
        setNewProgram(false);
        setEditedProgram(false);
        setNewItem(false);
        setItemToEdit(null);
    }, [fetcher.state, fetcher]);

    //! READ THE COMMENTS

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 shadow-none rounded-lg">
                    <span className="tracking-tighter text-sm">
                        {event?.eventProgram && event.eventProgram.length > 0 ? "Edit program" : "Add program"}
                    </span>
                    <ChevronRight />
                </Button>
            </SheetTrigger>

            <SheetContent className="px-4 w-[95vw] md:min-w-110">
                <SheetHeader className="h-15" />
                <div className="no-scrollbar h-full overflow-y-auto px-1">
                    {event.eventProgram && event.eventProgram.length > 0
                        ? (event.eventProgram.map((item) => (
                            <div key={item.id} className="">
                                <p className="tracking-tight text-sm font-light">Event Program</p>
                                {editProgram ? (
                                    // Edit program title
                                    <fetcher.Form action={`/my-events/${event.slug}/programs`} method="POST" className="grid gap-5">
                                        <h3 className="font-semibold text-lg tracking-tighter">Create new program</h3>
                                        <input type="hidden" name="type" value="program.edit" />
                                        <input type="hidden" name="program_id" value={item.id} />
                                        <div>
                                            <Label htmlFor={`sheet-demo-name-new`}>Edit title</Label>
                                            <Input
                                                name="title"
                                                className="py-5 rounded-lg mt-1 text-sm"
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
                                    </fetcher.Form>
                                ) : (<>
                                    <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between mb-7">
                                        <h3 className="font-semibold text-xl tracking-tighter flex items-center gap-3">
                                            <span>{item.title}</span>
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => setEditedProgram(true)} className="rounded-full cursor-pointer" size={'sm'} variant={'secondary'}>
                                                <Pencil
                                                    className="size-4 hover:text-primary-theme cursor-pointer"
                                                    strokeWidth={2}
                                                />
                                            </Button>

                                            <fetcher.Form action={`/my-events/${event.slug}/programs`} method={'POST'}>
                                                <input type="hidden" name="type" value="program.delete" />
                                                <input type="hidden" name="program_id" value={item.id} />
                                                <Button className="rounded-full cursor-pointer" size={'sm'} variant={'secondary'}>
                                                    <Trash
                                                        className="size-4 hover:text-destructive text "
                                                        strokeWidth={2}
                                                    />
                                                </Button>
                                            </fetcher.Form>
                                        </div>
                                    </div>

                                    {(!newItem && !itemToEdit) && (
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue={`item-0`}
                                            className="max-w-lg bg-gray-100 px-2 rounded"
                                        >
                                            {item.programItems.map((programItem, index) => (
                                                <AccordionItem key={programItem.id} value={`item-${index}`}>
                                                    <AccordionTrigger className="text-sm tracking-tighter">
                                                        <div>
                                                            <span className="font-bold inline-block me-1">{index + 1}.{" "} </span>
                                                            <span> {programItem.title}</span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-xs">
                                                        {programItem.description
                                                            ? (
                                                                <div>
                                                                    <FormatLineBreak input={programItem.description} />
                                                                </div>
                                                            )
                                                            : <span className="text-gray-400 text-xs italic">No content</span>}

                                                        <div className="mt-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-full shadow-none cursor-pointer me-2"
                                                                onClick={() => setItemToEdit({
                                                                    id: programItem.id,
                                                                    title: programItem.title,
                                                                    description: programItem.description || ''
                                                                })}
                                                            >
                                                                <Pencil className="size-3" strokeWidth={2} />
                                                            </Button>
                                                            <fetcher.Form action={`/my-events/${event.slug}/programs`} method={'POST'} className="inline">
                                                                <input type="hidden" name="type" value="program.item.delete" />
                                                                <input type="hidden" name="program_id" value={item.id} />
                                                                <input type="hidden" name="item_id" value={programItem.id} />
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="rounded-full shadow-none cursor-pointer me-2"
                                                                >
                                                                    <Trash className="size-3" strokeWidth={2} />
                                                                </Button>
                                                            </fetcher.Form>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    )}

                                    {/* Edit event item */}
                                    {itemToEdit && (
                                        <>
                                            <h3 className="text-md tracking-tight font-medium">Editing {itemToEdit.title}</h3>
                                            <fetcher.Form action={`/my-events/${event.slug}/programs`} method={'POST'} className="mt-5">
                                                <input type="hidden" name="type" value="program.item.update" />
                                                <input type="hidden" name="program_id" value={item.id} />
                                                <input type="hidden" name="item_id" value={itemToEdit.id} />

                                                <Label htmlFor={`sheet-demo-name-new`}>Heading</Label>
                                                <Input
                                                    name="title"
                                                    className="py-5 rounded-lg mt-1 text-xs"
                                                    placeholder="Item title"
                                                    defaultValue={itemToEdit.title}
                                                    autoFocus

                                                />

                                                <div className="my-5">
                                                    <Label htmlFor={`sheet-demo-name-new`}>
                                                        Content <span className="font-light">(optional)</span>
                                                    </Label>
                                                    <Textarea
                                                        name="description"
                                                        className="rounded-lg mt-1 text-xs h-50"
                                                        placeholder="...."
                                                        rows={10}
                                                        defaultValue={itemToEdit.description}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <div className="basis-10/12">
                                                        <DefaultButton text="Update Item" />
                                                    </div>
                                                    <Button
                                                        className="basis-2/12 rounded-full py-6 cursor-pointer"
                                                        variant="secondary"
                                                        size={'icon'}
                                                        onClick={() => setItemToEdit(null)}
                                                    >
                                                        <X className="size-3" strokeWidth={2} />
                                                    </Button>
                                                </div>
                                            </fetcher.Form>
                                        </>
                                    )}
                                </>
                                )}

                                {/* Add new event item */}
                                {(newItem && !editProgram) && (
                                    <fetcher.Form action={`/my-events/${event.slug}/programs`} method={'POST'} className="mt-5">
                                        <h3 className="text-md tracking-tight font-medium mb-4">Create new entry</h3>
                                        <input type="hidden" name="type" value="program.item.create" />
                                        <input type="hidden" name="program_id" value={item.id} />

                                        <Label htmlFor={`sheet-demo-name-new`}>Heading</Label>
                                        <Input
                                            name="title"
                                            className="py-5 rounded-lg mt-1 text-xs"
                                            placeholder="Item title"
                                            autoFocus
                                            required
                                        />
                                        <div className="my-5">
                                            <Label htmlFor={`sheet-demo-name-new`}>
                                                Content <span className="font-light">(optional)</span>
                                            </Label>
                                            <Textarea
                                                name="description"
                                                className="rounded-lg mt-1 text-xs"
                                                placeholder="...."
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <div className="basis-10/12">
                                                <DefaultButton text="Add Item" />
                                            </div>

                                            <Button
                                                className="basis-2/12 rounded-full py-6 cursor-pointer"
                                                variant="secondary"
                                                size={'icon'}
                                                onClick={() => setNewItem(false)}>
                                                <X />
                                            </Button>

                                        </div>
                                    </fetcher.Form>
                                )}
                            </div>
                        )))

                        // Empty state 
                        : <div>
                            {newProgram
                                // Create program
                                ? (<fetcher.Form action={`/my-events/${event.slug}/programs`} method="POST" className="grid gap-5">
                                    <h3 className="font-semibold text-lg tracking-tighter">Create new program</h3>
                                    <input type="hidden" name="type" value="program.create" />
                                    <div>
                                        <Label htmlFor={`sheet-demo-name-new`}>Add title</Label>
                                        <Input
                                            name="title"
                                            className="py-5 rounded-lg mt-1 text-sm"
                                            defaultValue={event.title + ' program'}
                                            autoFocus
                                        />
                                    </div>
                                    <DefaultButton text="Add program" />
                                </fetcher.Form>)
                                : (<>
                                    {eventProgramUpgrade ? (
                                        <UpgradePlan targetTier={eventProgramUpgrade} featureName="Event program" />
                                    ) : (
                                        <>
                                            <EmptyState resource="programs" />
                                            <div className="mx-auto w-max">
                                                <Button
                                                    variant="outline"
                                                    className="shadow-none text-sm py-5 rounded-lg cursor-pointer"
                                                    onClick={() => setNewProgram(true)}
                                                >
                                                    Add program
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </>)}
                        </div>
                    }
                </div>
                <SheetFooter className="px-0">
                    {(
                        (event?.eventProgram?.length as number > 0)
                        && !editProgram
                        && !newItem
                        && !itemToEdit
                    )
                        && (
                            <div className="mt-8">
                                <Button
                                    variant={'outline'}
                                    className="flex w-full py-5 shadow-none items-center gap-1 rounded-lg cursor-pointer"
                                    onClick={() => setNewItem(true)}
                                >
                                    <Plus />
                                    <span>Add item</span>
                                </Button>
                            </div>
                        )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}