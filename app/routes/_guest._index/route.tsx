import { Await, Link, redirect, useSearchParams } from "react-router";
import { BrMd } from "~/components/utility/line-break";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Crown, HelpCircle, Music, Piano, ShieldCheck, Stars, Ticket, UsersRound, UserStar } from "lucide-react";
import SearchBar from "~/components/utility/search-bar";
import { FeedFilter } from "~/components/utility/feed-filter";
import { Button } from "~/components/ui/button";
// import StackedSwipeDeck from "~/components/cards/stacked-swipe-deck";
import type { Route } from "../_guest._index/+types/route";
import { Suspense, useState } from "react";
import EventCardSkeleton from "~/components/skeletons/events-card-skeleton";
import client from "~/http/client";
import EventsMapper from "~/components/mappers/event-mapper";
import { STORAGE_URL } from "~/config/defaults";
import DefaultError from "~/components/errors/default-error";
import { eventCategory } from "~/lib/d.store";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const filter = url.searchParams.get("filter");

    try {
        const getEvents = async (
            eventType: string | null,
            timeFilter: string | null
        ): Promise<OrganiserEvent[]> => {
            const response = await client.get('/api/events', {
                params: {
                    category: eventType,
                    filter: timeFilter
                }
            });
            return response.data;
        }

        const events = getEvents(category, filter);

        return { events };

    } catch ({ response }: any) {
        return redirect('/');
    }
}

// const sample = [
//     { id: 1, title: "Beethoven: Symphony No.5", subtitle: "Royal Hall • London", image: "/images/event-flyer.jpg" },
//     { id: 2, title: "Verdi: Requiem", subtitle: "Opera House • Milan", image: "/images/event-flyer.jpg" },
//     { id: 3, title: "Mozart: Piano Recital", subtitle: "Concert Hall • Berlin", image: "/images/event-flyer.jpg" },
//     { id: 4, title: "Brahms: Chamber Night", subtitle: "Studio • New York", image: "/images/event-flyer.jpg" },
// ];

export default function Home({ loaderData }: Route.ComponentProps) {
    const { events }: { events: Promise<OrganiserEvent[]> } = loaderData;
    const [searchParams] = useSearchParams();

    const updateCategoryParam = (categoryValue: string) => {
        const newParams = new URLSearchParams(searchParams);

        if (categoryValue) {
            newParams.set('category', categoryValue);
        } else {
            newParams.delete('category');
        }
        return `?${newParams.toString()}`;
    };

    return (
        <div className="fadeIn animated">
            <div className="relative isolate px-6 pt-5 lg:px-8 -z-10">
                <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-indigo-100 to-indigo-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
                    />
                </div>
            </div>
            <header className="flex flex-col gap-5 lg:min-h-[65vh]">
                <section className="container flex justify-between gap-20 items-center mt-10 mb-16">
                    <div className="lg:basis-7/12 text-center md:text-start overflow-auto">
                        <div className="bg-white border text-xs md:text-xs rounded-full px-4 py-2 w-max mb-8 tracking-tight flex items-center gap-0 mx-auto md:mx-0">
                            <span className="text-primary-theme font-semibold flex items-center gap-1.5">
                                <span>Commission-free</span> <Stars className="text-pink-300 fill-pink-300" strokeWidth={1} size={16} />
                            </span>
                            <span className="h-4 border-r mx-3" />
                            <Link to={'/my-events/new'} className="text-muted-foreground flex items-center gap-1">
                                <span>Sell tickets</span>
                                <ChevronRight strokeWidth={1} size={16} />
                            </Link>
                        </div>
                        <h1 className="font-semibold font-erif text-4xl md:text-6xl text-primary tracking-tighter mb-6">
                            Promoting Live <br />
                            Musical <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-theme to-pink-500">Concerts</span>
                        </h1>
                        <p className="tracking-tight  font-medium text-gray-500 text-md md:text-base mt-5 leading-6">
                            Discover events, buy tickets, and connect with fellow <BrMd /> music enthusiasts on AriaPass.
                        </p>

                        <div className="mt-10 flex flex-col items-start gap-3 ">
                            <div className="flex gap-4 items-stretch mx-auto md:mx-0">
                                <Link to="/events" className="flex gap-1.5 items-center py-3 px-4 font-medium text-sm rounded-full bg-[#3A3546] text-white ">
                                    <Piano size={16} /> <span>Events</span>
                                </Link>
                                <Link to="/organisers" className="flex gap-1.5 items-center py-3 px-4 font-medium text-sm rounded-full hover:bg-gray-50">
                                    <UsersRound size={16} /> <span>Organisers</span>
                                </Link>
                                <Link to="/artists" className="flex gap-1.5 items-center py-3 px-4 font-medium text-sm rounded-full hover:bg-gray-50">
                                    <UserStar size={16} /> <span>Artists</span>
                                </Link>
                            </div>

                            <div className="w-full ">
                                <div className="mb-4">
                                    <SearchBar />
                                </div>

                                <div className="flex items-center gap-3 overflow-x-auto">
                                    <span className="font-semibold text-xs">Popular:</span>
                                    {["Free ticket", "Christmas Carol", "Concert", "Classical"].map((item, index) => (
                                        <Link to={'?' + item.toLowerCase()} key={item + index} className="text-nowrap px-4 py-1.5 border border-gray-200 text-xs font-light rounded-full hover:bg-gray-50">
                                            {item.toLowerCase()}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Banners */}
                    <div className="hidden lg:block lg:basis-6/12">
                        <div className="h-110 w-full bg-gray-50 rounded-3xl border overflow-hidden relative">
                            <Suspense fallback={<div className="h-100 w-full bg-gray-200 animate-pulse" />}>
                                <Await resolve={events}>
                                    {(events) => {
                                        const [index, setIndex] = useState(0);

                                        const handlePrev = () => {
                                            setIndex(i => (i - 1 + events.length) % events.length);
                                        };

                                        const handleNext = () => {
                                            setIndex(i => (i + 1) % events.length);
                                        };

                                        return (
                                            <>
                                                {events.length > 0 && (
                                                    <>
                                                        {/* Overlay background */}
                                                        <div className='absolute top-0 left-0 w-full min-h-full bg-linear-to-t from-black/50 to-black/10' />
                                                        <img
                                                            src={events[index].bannerUrl && `${STORAGE_URL}/${events[index].bannerUrl}`}
                                                            alt={events[index].title}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        <button
                                                            title="Previous"
                                                            onClick={() => handlePrev()}
                                                            className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-white/50 rounded-full text-gray-800 hover:bg-white transition-colors"
                                                        >
                                                            <ChevronLeft />
                                                        </button>
                                                        <button
                                                            title="Next"
                                                            onClick={() => handleNext()}
                                                            className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-white/50 rounded-full text-gray-800 hover:bg-white transition-colors"
                                                        >
                                                            <ChevronRight />
                                                        </button>
                                                        <div className="absolute bottom-5 right-5 py-2 px-3 rounded-full bg-white text-xs shadow-lg flex items-center gap-1">
                                                            {events[index].organiser.organiserName} <Crown className="inline-block h-4 w-4 fill-amber-500 text-amber-500" />
                                                        </div>

                                                    </>
                                                )}
                                            </>
                                        )
                                    }}
                                </Await>
                            </Suspense>
                        </div>
                    </div>
                </section>
            </header>

            <main>
                {/* Desktop */}
                <div className="hidden container lg:flex items-center justify-between mb-8">
                    <FeedFilter />
                    <div className="flex gap-4 items-center">
                        <Link
                            preventScrollReset
                            to={`?category=`}
                            className={`rounded-full py-2 px-4 hover:bg-stone-100 text-sm font-medium tracking-tight ${!searchParams.get('category') && 'bg-stone-100 outline'}`}
                        >
                            All
                        </Link>
                        {eventCategory.map((item) => (
                            <Link
                                preventScrollReset
                                to={updateCategoryParam(item.toLowerCase())}
                                className={`${searchParams.get('category') === item.toLowerCase() && 'bg-stone-100 outline'} rounded-full py-2 px-4 hover:bg-stone-100 text-sm font-medium tracking-tight`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                    <Link to={"/my-events/new"}>
                        <Button variant={"secondary"} className="cursor-pointer rounded-full flex justify-between gap-2 px-5">
                            <span>Create Event</span>
                            <ChevronRight />
                        </Button>
                    </Link>
                </div>

                {/* Mobile */}
                <div className="lg:hidden mb-4">
                    <div className="container flex justify-between items-center">
                        <FeedFilter />
                        <Link to={"/my-events/new"}>
                            <Button variant={"secondary"} className="cursor-pointer rounded-full flex justify-between gap-2 h-10">
                                <span>Create Event</span>
                                <ChevronRight />
                            </Button>
                        </Link>
                    </div>

                    <hr className="mt-5 mb-2" />

                    <div className="container py-2 flex gap-4 items-center overflow-x-auto">
                        <Link
                            preventScrollReset
                            to={`?category=`}
                            className={`text-nowrap rounded-full py-2 px-4 hover:bg-stone-100 text-sm tracking-tight ${!searchParams.get('category') && 'bg-stone-100 outline'}`}
                        >
                            All
                        </Link>
                        {eventCategory.map((item) => (
                            <Link
                                to={updateCategoryParam(item.toLowerCase())}
                                key={item}
                                preventScrollReset
                                className={`${searchParams.get('category') === item.toLowerCase() && 'bg-stone-100 outline'} text-nowrap rounded-full py-2 px-4 hover:bg-stone-100 text-sm tracking-tight`}>
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Events ---------------------------------------------- */}
                <div className="container block">
                    <Suspense fallback={<EventCardSkeleton />}>
                        <Await resolve={events}>
                            {(events) => <EventsMapper events={events} />}
                        </Await>
                    </Suspense>
                </div>

                <Link to={"events?filter=all"} className="block mx-auto w-max mt-3">
                    <Button variant={"outline"} className="py-5 px-10 rounded-full tracking-tighter">
                        All Events <ArrowRight />
                    </Button>
                </Link>

                {/* <div className="md:hidden flex items-center justify-center py-10">
                    <StackedSwipeDeck
                        initialCards={sample}
                        width={350}
                        height={520}
                        onSwipe={(card, dir) => console.log("swiped", card.title, dir > 0 ? "right" : "left")}
                    />
                </div> */}
                {/* Events End ---------------------------------------------- */}

                {/* <hr className="mt-10" /> */}

                <section className="container py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                            Your Backstage Pass to Live Music
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Whether you're looking to discover underground classical ensembles or buy tickets to the biggest Christmas Carols, AriaPass makes it effortless.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 rounded-2xl bg-gray-50 hover:bg-stone-100 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs text-primary-theme">
                                <Music size={24} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">1. Discover Events</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Browse hundreds of live musical concerts, from intimate gigs to massive arena shows tailored to your taste.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 hover:bg-stone-100 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs text-primary-theme">
                                <Ticket size={24} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">2. Secure Your Tickets</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Purchase tickets instantly with our secure checkout. No hidden fees, no stress—just your pass to the show.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 hover:bg-stone-100 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs text-primary-theme">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">3. Enjoy the Music</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Scan your digital ticket at the door and immerse yourself in the live music experience with fellow fans.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-[#3A3546] text-white py-20 mt-10">
                    <div className="container flex flex-col lg:flex-row gap-12 items-center">
                        <div className="lg:basis-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                                The Commission-Free Ticketing Platform for Organisers & Fans
                            </h2>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                AriaPass is redefining how live music events are promoted. We bridge the gap between talented artists, dedicated organisers, and passionate music enthusiasts without taking a cut of your hard-earned ticket sales.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Zero commission fees on ticket sales",
                                    "Direct payouts for event organisers",
                                    "Real-time analytics and audience insights",
                                    "Seamless QR code ticket scanning"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                                        <div className="bg-pink-500/20 p-1 rounded-full text-pink-400">
                                            <ShieldCheck size={16} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:basis-1/2 w-full">
                            {/* You can replace this placeholder with an actual dashboard image later */}
                            <div className="aspect-video bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
                                <span className="text-white/50 flex items-center gap-2">
                                    <Music /> Platform Preview
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SEO FAQ Section */}
                <section className="container py-20">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center justify-center gap-2">
                                <HelpCircle className="text-primary-theme" /> FAQ
                            </h2>
                            <p className="text-gray-500">Everything you need to know about buying and selling tickets on AriaPass.</p>
                        </div>

                        <div className="space-y-4">
                            {/* Note: In a real app, you might want to make these functional accordions with state, 
                                but standard CSS/Details works great for SEO and simplicity */}
                            <details className="group border border-gray-200 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                                    <span>Is AriaPass really commission-free for organisers?</span>
                                    <ChevronDown className="transition duration-300 group-open:-rotate-180" size={20} />
                                </summary>
                                <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                                    Yes! We believe organisers and artists should keep what they earn. AriaPass charges $0 in commission fees for listing your concerts and selling tickets through our platform.
                                </p>
                            </details>
                            <details className="group border border-gray-200 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                                    <span>How do I receive my event tickets?</span>
                                    <ChevronDown className="transition duration-300 group-open:-rotate-180" size={20} />
                                </summary>
                                <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                                    Once purchased, your tickets are instantly emailed to you and are always accessible via your AriaPass dashboard. Just show the digital QR code at the venue!
                                </p>
                            </details>
                            <details className="group border border-gray-200 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                                    <span>What types of events are on AriaPass?</span>
                                    <ChevronDown className="transition duration-300 group-open:-rotate-180" size={20} />
                                </summary>
                                <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                                    We specialize in live musical events, ranging from classical ensembles, Christmas carols, underground gigs, to massive stadium tours.
                                </p>
                            </details>
                        </div>
                    </div>
                </section>

                <div className="container mt-10">
                    <div
                        className="h-100 rounded-3xl py-6 px-6 my-10 flex flex-col justify-between"
                        style={{
                            backgroundImage: `linear-gradient(90deg, #000000, #cccccc00), url('/images/ensemble-banner.png')`,
                            backgroundSize: 'cover, cover',
                            backgroundPosition: 'center, center',
                        }}
                    >
                        <div />
                        <div className="text-white">
                            <div className="mb-10 tracking-tighter">
                                <h2 className="text-3xl font-bold tracking-tighter mb-4">
                                    Get more leads, <br className="md:hidden" /> Pay no fees
                                </h2>
                                <p className="font-light text-sm">Rank higher, skip the fees, and level up your profile — all <BrMd /> for $0/month.</p>
                            </div>

                            <Link to={"/organisers"}>
                                <Button className="w-full md:w-max rounded-full px-10 py-6 bg-white/20">
                                    Become an Organiser
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return <DefaultError error={error} />
}