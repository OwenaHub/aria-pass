import { Await, Link, redirect, useSearchParams } from "react-router";
import {
    ArrowRight, ChevronLeft, ChevronRight, Crown,
    ShieldCheck, Stars,
    UsersRound, UserStar, QrCode,
    Zap, Mic2, Heart, Headphones
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Suspense, useState } from "react";
import EventCardSkeleton from "~/components/skeletons/events-card-skeleton";
import client from "~/http/client";
import EventsMapper from "~/components/mappers/event-mapper";
import { STORAGE_URL } from "~/config/defaults";
import DefaultError from "~/components/errors/default-error";
import { eventCategory } from "~/lib/d.store";
import type { Route } from "../_guest._index/+types/route";

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
        <div className="fadeIn animated bg-white overflow-x-hidden">
            {/* 1. HERO SECTION: The Hook */}
            <header className="relative pt-10 lg:pt-20 pb-16">
                <div className="container grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-primary-theme font-semibold text-xs uppercase tracking-tighter mb-8">
                            <Stars className="size-4 fill-current" />
                            Music-Only Ecosystem
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-8">
                            The Beat <br /> Starts <span className="text-primary-theme">Here.</span>
                        </h1>
                        <p className="md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-10">
                            The only niche platform dedicated exclusively to live musical events.
                            Zero commission for partners. 100% passion for music.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 mb-10">
                            <Link to="/events" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-all active:scale-95">
                                <span>Explore Events</span> <ArrowRight className="size-5" />
                            </Link>
                            <Link to="/pricing" className="bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 text-center rounded-2xl font-bold hover:border-indigo-200 transition-all">
                                See Pricing
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block relative">
                        <div className="absolute -inset-4 bg-indigo-100/50 rounded-[3rem] blur-2xl -z-10" />
                        <div className="h-137.5 w-full bg-slate-100 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden relative group">
                            <Suspense fallback={<div className="h-full w-full bg-slate-200 animate-pulse" />}>
                                <Await resolve={events}>
                                    {(resolvedEvents) => {
                                        const [index, setIndex] = useState(0);
                                        const current = resolvedEvents[index];
                                        return resolvedEvents.length > 0 ? (
                                            <>
                                                <img
                                                    src={`${STORAGE_URL}/${current.bannerUrl}`}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    alt={current.title}
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">Featured Event</p>
                                                    <h3 className="text-3xl font-bold mb-4">{current.title}</h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                                                            {current.organiser.organiserName} <Crown className="size-4 text-amber-400 fill-current" />
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setIndex((i) => (i - 1 + resolvedEvents.length) % resolvedEvents.length)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"><ChevronLeft /></button>
                                                            <button onClick={() => setIndex((i) => (i + 1) % resolvedEvents.length)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"><ChevronRight /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null;
                                    }}
                                </Await>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. THE DIFFERENTIATOR: Why AriaPass? */}
            <section className="py-24 bg-slate-50">
                <div className="container">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <h2 className="text-4xl font-black tracking-tighter mb-6 leading-none">
                                Why we’re <br /><span className="text-primary-theme">different.</span>
                            </h2>
                            <p className="text-slate-500 font-medium mb-8">
                                We didn't build just another ticketing app. We built a home for the Nigerian music industry.
                            </p>
                            <Link to="/pricing" className="text-primary-theme font-bold flex items-center gap-2 group">
                                Learn about 0% commission <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Zap className="fill-current" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tighter mb-3">0% Commission Model</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Choose our <strong>Partner Track</strong>. By giving us a shoutout at your event, you pay ₦0 in platform fees. You keep the gate, we keep the culture alive.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Mic2 className="fill-current" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tighter mb-3">Music-Only Niche</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    No conferences, no workshops. AriaPass is built strictly for concerts, carols, recitals, and gigs. Your audience is already here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. WHO IS IT FOR? (The Three Identities) */}
            <section className="py-24 container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tighter mb-4">Built for the whole ecosystem.</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "For Fans", icon: Headphones, desc: "Discover hidden gems and major arena shows. Manage all your tickets in one sleek dashboard." },
                        { title: "For Artists", icon: UserStar, desc: "A profile that shines. Direct access to organizers and a community that loves your sound." },
                        { title: "For Organisers", icon: UsersRound, desc: "Powerful tools to manage collaborators, track real-time sales, and launch digital programs." }
                    ].map((role, i) => (
                        <div key={i} className="group p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <role.icon className="size-8 text-primary-theme" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">{role.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">{role.desc}</p>
                            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-primary-theme hover:underline">Get Started</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. DIGITAL PROGRAMS: The "Aha" Moment */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-theme/20 blur-3xl rounded-full translate-x-1/2" />
                <div className="container grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            Exclusive Feature
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                            Ditch the Paper. <br /> <span className="text-indigo-400">Go Digital.</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            AriaPass Digital Programs allow you to create interactive, shareable event booklets.
                            Add artist bios, setlists, and sponsor logos—all accessible via a single QR code scan.
                        </p>
                        <div className="flex flex-col gap-6 mb-12">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><QrCode /></div>
                                <div>
                                    <h4 className="font-bold text-white">Instant QR Access</h4>
                                    <p className="text-sm text-slate-500">Fans scan at the door to see the full event schedule.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Heart /></div>
                                <div>
                                    <h4 className="font-bold text-white">Interactive Artist Bios</h4>
                                    <p className="text-sm text-slate-500">Links to Spotify, Apple Music, and social profiles.</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/event-programs" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-colors">
                            Explore Event Programs <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="aspect-4/5 bg-slate-800 rounded-[3rem] border-8 border-slate-700 shadow-2xl relative overflow-hidden group">
                            <div className="p-8 h-full bg-linear-to-b from-slate-800 to-slate-900">
                                <div className="w-full h-48 bg-slate-700 rounded-2xl mb-6 animate-pulse" />
                                <div className="space-y-4">
                                    <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse" />
                                    <div className="h-4 w-1/2 bg-slate-700 rounded animate-pulse" />
                                    <div className="grid grid-cols-2 gap-4 pt-8">
                                        <div className="h-20 bg-slate-700/50 rounded-2xl" />
                                        <div className="h-20 bg-slate-700/50 rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/60 backdrop-blur-sm">
                                <QrCode className="size-32 text-indigo-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. EVENT EXPLORER: The Action */}
            <section className="py-24 container" id="explore">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter mb-2 italic">Happening Soon</h2>
                        <p className="text-slate-500 font-medium text-sm tracking-tight">Hand-picked musical experiences near you.</p>
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                        <Link
                            preventScrollReset
                            to="?category="
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${!searchParams.get('category') ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500'}`}
                        >
                            All
                        </Link>
                        {eventCategory.map((cat) => (
                            <Link
                                preventScrollReset
                                key={cat}
                                to={`?category=${cat.toLowerCase()}`}
                                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${searchParams.get('category') === cat.toLowerCase() ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                <Suspense fallback={<EventCardSkeleton />}>
                    <Await resolve={events}>
                        {(resolvedEvents) => <EventsMapper events={resolvedEvents} />}
                    </Await>
                </Suspense>

                <div className="mt-12 text-center">
                    <Link to="/events?filter=all">
                        <Button variant="outline" className="rounded-full px-12 py-6 border-2 font-bold group">
                            <span>Explore All Events</span> <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* 6. PARTNERSHIP CTA: The Scale */}
            <section className="pb-24 container">
                <div className="bg-primary-theme rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden text-center md:text-left">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-24" />
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                                Keep 100% of <br /> your gate.
                            </h2>
                            <p className="text-indigo-100 text-lg font-medium mb-10">
                                AriaPass is built for the culture. We want to sponsor your event.
                                We don't take your profit, we just help you fill the seats as you keep 100% of your ticket sales.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Link to="/pricing" className="bg-white text-primary-theme px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/20 active:scale-95 transition-all">
                                    Partnership Tiers
                                </Link>
                                <Link to="/my-events/new" className="bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-lg border border-indigo-400 hover:bg-indigo-400 transition-all">
                                    Create Event
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:flex justify-end">
                            <div className="p-8 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20">
                                <div className="space-y-4">
                                    {[
                                        "Instant Paystack Payouts",
                                        "Digital Program Access",
                                        "Audience Insights Dashboard",
                                        "Priority Support"
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-center gap-3 text-white font-bold">
                                            <ShieldCheck className="text-indigo-300" /> {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return <DefaultError error={error} />
}