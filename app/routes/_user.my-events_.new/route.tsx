import { Eye, MapPinHouse, MapPlus, Scroll } from "lucide-react";
import { Form, redirect, unstable_usePrompt, type MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import React, { useState } from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "~/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import DefaultButton from "~/components/buttons/default-button";
import type { Route } from "../_user.my-events_.new/+types/route";
import { parseForm } from "~/lib/utils";
import PreviewCard from "./preview-card";
import InputError from "~/components/utility/input-error";
import formRequest from "~/http/form.request";
import { toast } from "sonner";
import { Switch } from "~/components/ui/switch";
import useSession from "~/hooks/use-session";
import client from "~/http/client";

import { defaultMeta } from '~/lib/meta';

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "New Event | AriaPass" },
    ];
}

export async function clientLoader() {
    const { getUser } = useSession();

    try {
        const user = getUser();
        const isOrganiser = user && (await user).organiserProfile?.status === 'active'

        if (!isOrganiser) {
            toast.warning("Unauthorized page", {
                description: 'No active orgainiser profile'
            });
            return redirect('/dashboard')

        }
        const { data } = await client.get('/api/organiser/events');

        return { events: data }
    } catch ({ response }: any) {
        console.error(response);
        return redirect('/dashboard')
    }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
    const credentials = await parseForm(request);

    return await formRequest(credentials, 'organiser/events', "POST")
        .then((res) => {
            toast.success("Event Created", {
                description: "You can now add tickets to this event"
            });

            return redirect(`/my-events/${res.slug}`);
        })
        .catch(({ response }) => {
            toast.error("Something went wrong", {
                description: `Status code ${response.status}`
            });
            return response.data.errors
        })
}

interface FormProps {
    title: string,
    description: string,
    banner_url: File | null,
    event_type: string
    status: 'draft' | 'suspended' | 'cancelled' | 'completed' | 'published',
    engagement_visible: boolean,
    extra_info: string,
    venue_name: string,
    venue_address: string,
    city: string,
    country: string,
    start_time: Date | undefined,
}

// If you use date-fns, you can replace toLocalYMD with format(date, 'yyyy-MM-dd')

/** Parse 'YYYY-MM-DD' as a local Date at midnight (no UTC shift). */
function parseLocalDateFromYMD(ymd?: string): Date | undefined {
    if (!ymd) return undefined;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) return undefined;
    const [_, y, mo, d] = m;
    return new Date(Number(y), Number(mo) - 1, Number(d)); // local midnight
}

/** Try to safely parse any server value into a local calendar Date. */
function safeParseEventDate(input?: string): Date | undefined {
    if (!input) return undefined;

    // If server sends plain 'YYYY-MM-DD'
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return parseLocalDateFromYMD(input);
    }

    // Otherwise, let JS parse (ISO, etc.), then normalize to local midnight
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return undefined;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Format a Date into 'YYYY-MM-DD' using **local** calendar. */
function toLocalYMD(d?: Date): string {
    return d
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`
        : "";
}

export default function CreateEvent({ actionData }: Route.ComponentProps) {
    const errors = actionData;

    const [openDate, setOpenDate] = useState(false)

    const [date, setDate] = React.useState<Date | undefined>(undefined);

    // ✅ Controlled, local‑safe 'YYYY-MM-DD' string to submit
    const dateYMD = React.useMemo(() => toLocalYMD(date), [date]);

    const [bannerPreview, setBannerPreview] = useState('');
    const [shareEngagement, setSetEngagement] = useState(false);

    const [form, setForm] = useState<FormProps>({
        title: '',
        description: '',
        event_type: '',
        banner_url: null,
        status: 'draft',
        engagement_visible: true,
        extra_info: '',
        venue_name: '',
        venue_address: '',
        city: '',
        country: '',
        start_time: date,
    });

    unstable_usePrompt({
        message: "Your progress will be lost if you leave this page",
        when: ({ currentLocation, nextLocation }) =>
            form.title !== "" && currentLocation.pathname !== nextLocation.pathname,
    });

    return (
        <Form className="relative flex flex-col lg:flex-row items-stretch gap-20 justify-between" method="post" encType="multipart/form-data">
            <section className="basis-4/6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold tracking-tighter ">New Event</h1>
                </div>

                <div className="flex flex-col gap-5">
                    {/* Event type selection */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-sm font-light">
                            What type of event are you hosting?
                        </Label>
                        <div className="flex flex-wrap gap-2 items-stretch">
                            {['Opera', 'Recital', 'Workshop', 'Cantata', "Carol", "Concert", "Other"]
                                .map((item) => (
                                    <Button
                                        key={item}
                                        type="button"
                                        size={"sm"} variant={"outline"}
                                        className={`rounded-full shadow-none text-xs font-light 
                                            ${form.event_type === item && 'bg-primary-theme text-white font-medium'}`}
                                        onClick={() => setForm((i) => ({ ...i, event_type: item }))}
                                    >
                                        {item}
                                    </Button>
                                ))
                            }
                        </div>
                        <input type="hidden" name="event_type" value={form.event_type} />
                        {form.event_type === "Other" && (
                            <Input
                                onChange={(e) => setForm((i) => (
                                    { ...i, event_type: e.target.value }
                                ))}
                                className="py-5 rounded-none shadow-none border-0 border-b"
                                placeholder="15 characters"
                                maxLength={15}
                                required
                            />
                        )}
                        <InputError for="event_type" error={errors} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-sm font-light">
                            Event title
                        </Label>
                        <Input
                            onChange={(e) => setForm((i) => (
                                { ...i, title: e.target.value }
                            ))}
                            name="title"
                            className="py-5 rounded-full placeholder:text-gray-300"
                            placeholder="Phantom of the Opera"
                            required
                        />
                        <InputError for="title" error={errors} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-sm font-light">
                            Add a description
                        </Label>
                        <Textarea
                            onChange={(e) => setForm((i) => (
                                { ...i, description: e.target.value }
                            ))}
                            rows={5}
                            cols={20}
                            maxLength={255}
                            name="description"
                            className="rounded-xl placeholder:text-gray-300"
                            placeholder="..."
                        />
                        <InputError for="description" error={errors} />
                    </div>

                    {/* Banner image */}
                    {form.banner_url
                        ? (<div className="mb-5">
                            <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-white">Cover photo</label>
                            <div className="flex justify-center bg-gray-100 rounded-xl  border-gray-300 px-6 py-10">
                                <div className="text-center">
                                    <img src={bannerPreview} alt="Banner preview" className="mx-auto max-h-60 object-contain rounded-md" />
                                    <div className="mt-4 flex text-sm/6 text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary-theme focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300">
                                            <span>Change file</span>
                                            <Input onChange={(e) => {
                                                const file = e.target.files![0];
                                                if (file) {
                                                    setForm((i) => ({
                                                        ...i, banner_url: file
                                                    }));
                                                    setBannerPreview(URL.createObjectURL(file))
                                                }
                                            }}
                                                id="file-upload" type="file" accept="image/*" name="banner_url" className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs/5 text-gray-400">PNG,ß JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            <InputError for="banner_url" error={errors} />
                        </div>)
                        : (<div className="mb-5">
                            <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-white">Cover photo</label>
                            <div className="flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-10">
                                <div className="text-center">
                                    <svg viewBox="0 0 24 24" fill="currentColor" data-slot="icon" aria-hidden="true" className="mx-auto size-12 text-gray-600">
                                        <path d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" fillRule="evenodd" />
                                    </svg>
                                    <div className="mt-4 flex text-sm/6 text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary-theme focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300">
                                            <span>Upload a file</span>
                                            <Input onChange={(e) => {
                                                const file = e.target.files![0];
                                                if (file) {
                                                    setForm((i) => ({
                                                        ...i, banner_url: file
                                                    }));
                                                    setBannerPreview(URL.createObjectURL(file))
                                                }
                                            }}
                                                id="file-upload" type="file" accept="image/*" name="banner_url" className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            <InputError for="banner_url" error={errors} />
                        </div>)
                    }


                    <div className="flex flex-row gap-4">
                        <div className="flex-1">
                            <Select
                                name='city'
                                onValueChange={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        city: value
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full rounded-full py-5">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Cities we support</SelectLabel>
                                        <SelectItem value="abuja">Abuja</SelectItem>
                                        <SelectItem value="lagos">Lagos</SelectItem>
                                        <SelectItem value="imo">Imo</SelectItem>
                                        <SelectItem value="kaduna">Kaduna</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError for="city" error={errors} />
                        </div>

                        <div className="flex-1">
                            <Select
                                name='country'
                                onValueChange={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        country: value
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full rounded-full py-5">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="nigeria">Nigeria</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError for="country" error={errors} />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col gap-2">
                            <Label htmlFor="date-picker" className="text-muted-foreground text-sm font-light">
                                Date
                            </Label>
                            <Popover open={openDate} onOpenChange={setOpenDate}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date-picker"
                                        className="rounded-full py-5 justify-between font-normal"
                                    >
                                        {date ? date.toLocaleDateString() : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        className="rounded [--cell-size:--spacing(11)] md:[--cell-size:--spacing(10)]"
                                        // captionLayout=""
                                        buttonVariant="ghost"
                                        onSelect={(date) => {
                                            setDate(date)
                                            //* setOpenDate(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <input type="hidden" name="date" value={dateYMD} />
                            <InputError for="date" error={errors} />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <Label htmlFor="time-picker" className="text-muted-foreground text-sm font-light">
                                Start time
                            </Label>
                            <Input
                                type="time"
                                id="time-picker"
                                step="1"
                                name="start_time"
                                defaultValue="10:30:00"
                                className="rounded-full py-5 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                            <InputError for="start_time" error={errors} />
                        </div>
                    </div>
                </div>
            </section>

            <aside className="sticky top-0 flex flex-col gap-4 lg:min-w-[400px] max-w-[400px] w-full">
                <h2 className="font-light text-lg flex items-center gap-2 tracking-tight">
                    Event preview <Eye strokeWidth={1} size={20} />
                </h2>

                <PreviewCard event={form} bannerImage={bannerPreview} />

                <hr className="mt-7 pb-3" />

                <section className="flex flex-col gap-5 mb-5">
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-sm font-light">
                            <MapPinHouse size={16} /> Hall name
                        </Label>
                        <Input
                            name="venue_name"
                            className="py-5 rounded-full placeholder:text-gray-300"
                            placeholder="Merit Hall"
                        />
                        <InputError for="venue_name" error={errors} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-sm font-light">
                            <MapPlus size={16} /> Address
                        </Label>
                        <Input
                            name="venue_address"
                            className="py-5 rounded-full placeholder:text-gray-300"
                            placeholder="5th Crescent Ave, Gaduwa close"
                        />
                        <InputError for="venue_address" error={errors} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-sm font-light">
                            <Scroll size={16} /> Extra notes
                        </Label>
                        <Textarea
                            name="extra_info"
                            className="rounded-xl placeholder:text-gray-300"
                            placeholder="Ensure to not bring children"
                        />
                        <InputError for="extra_info" error={errors} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="allow-engagement-visibility"
                                checked={shareEngagement}
                                onCheckedChange={(checked) => setSetEngagement(checked)}
                            />
                            <Label htmlFor="allow-engagement-visibility">
                                Share post engagement with audience
                            </Label>
                        </div>
                        <input type="hidden" name="engagement_visible" value={shareEngagement ? 1 : 0} />
                        <InputError for="engagement_visible" error={errors} />
                    </div>
                </section>

                <DefaultButton text="Save event" />
            </aside>
        </Form>
    )
}
