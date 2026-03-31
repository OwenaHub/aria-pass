import { Link } from "react-router";
import {
    ArrowRight, ShieldCheck, Stars,
    UsersRound, UserStar, QrCode,
    Zap, Mic2, Heart, Headphones
} from "lucide-react";
import DefaultError from "~/components/errors/default-error";
import type { Route } from "../_guest._index/+types/route";
import { BrMd } from "~/components/utility/line-break";

export default function Home(_: Route.ComponentProps) {
    return (
        <div className="fadeIn animated bg-white overflow-x-hidden">
            <header className="relative pt-26 lg:pt-26 pb-16 overflow-hidden rounded-b-3xl shadow-xl">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/videos/ariapass-atf/placeholder.jpg"
                    className="absolute inset-0 w-full h-full object-cover -z-10"
                >
                    <source src="/videos/ariapass-atf/video.mp4" type="video/mp4" />
                </video>

                {/* 🌑 Overlay (for readability) */}
                <div className="absolute inset-0 bg-black/50 -z-10" />

                {/* 🔥 Your existing content */}
                <div className="container relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-900 font-semibold text-xs tracking-tighter mb-8">
                            <Stars className="size-4 fill-primary" />
                            Music-Only Ecosystem
                        </div>

                        <h1 className="text-5xl md:text-7xl capitalize font-extrabold text-white tracking-tighter mb-8">
                            We promote live <BrMd /> musical events
                        </h1>

                        <p className="md:text-lg text-gray-200 leading-relaxed mx-auto max-w-lg mb-10">
                            The only niche platform dedicated exclusively to live musical events.
                            Zero commission for partners. 100% passion for music.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 mb-10 mx-auto md:w-max">
                            <Link to="/events" className="bg-gray-800/90 text-white px-8 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-all active:scale-95">
                                <span>Explore Events</span> <ArrowRight className="size-5" />
                            </Link>
                            <Link to="/pricing" className="bg-white/20 text-white px-8 py-3.5 text-center rounded-xl font-bold hover:bg-white/60 transition-all">
                                See Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-24 bg-gray-50">
                <div className="container">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <h2 className="text-4xl font-black tracking-tighter mb-6 leading-none">
                                Why we’re <br /><span className="text-primary-theme">different.</span>
                            </h2>
                            <p className="text-gray-500 font-medium mb-8">
                                We didn't build just another ticketing app. We built a home for the Nigerian music industry.
                            </p>
                            <Link to="/pricing" className="text-primary-theme font-bold flex items-center gap-2 group">
                                Learn about 0% commission <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Zap className="fill-current" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tighter mb-3">0% Commission Model</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Choose our <strong>Partner Track</strong>. By giving us a shoutout at your event, you pay ₦0 in platform fees. You keep the gate, we keep the culture alive.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Mic2 className="fill-current" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tighter mb-3">Music-Only Niche</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
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
                        { title: "Fans", icon: Headphones, desc: "Discover hidden gems and major arena shows. Manage all your tickets in one sleek dashboard." },
                        { title: "Artists", icon: UserStar, desc: "A profile that shines. Direct access to organizers and a community that loves your sound." },
                        { title: "Organisers", icon: UsersRound, desc: "Powerful tools to manage collaborators, track real-time sales, and launch digital programs." }
                    ].map((role, i) => (
                        <div key={i} className="group p-8 rounded-[2.5rem] border-2 border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <role.icon className="size-8 text-primary-theme" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tighter mb-4">{role.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">{role.desc}</p>
                            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-primary-theme hover:underline">Get Started</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. DIGITAL PROGRAMS: The "Aha" Moment */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-theme/20 blur-3xl rounded-full translate-x-1/2" />
                <div className="container grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            Exclusive Feature
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                            Ditch the Paper. <br /> <span className="text-indigo-400">Go Digital.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            AriaPass Digital Programs allow you to create interactive, shareable event booklets.
                            Add artist bios, setlists, and sponsor logos—all accessible via a single QR code scan.
                        </p>
                        <div className="flex flex-col gap-6 mb-12">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><QrCode /></div>
                                <div>
                                    <h4 className="font-bold text-white">Instant QR Access</h4>
                                    <p className="text-sm text-gray-500">Fans scan at the door to see the full event schedule.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Heart /></div>
                                <div>
                                    <h4 className="font-bold text-white">Interactive Artist Bios</h4>
                                    <p className="text-sm text-gray-500">Links to Spotify, Apple Music, and social profiles.</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/event-programs" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-colors">
                            Explore Event Programs <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="aspect-4/5 bg-gray-800 rounded-[3rem] border-8 border-gray-700 shadow-2xl relative overflow-hidden group">
                            <div className="p-8 h-full bg-linear-to-b from-gray-800 to-gray-900">
                                <div className="w-full h-48 bg-gray-700 rounded-2xl mb-6 animate-pulse" />
                                <div className="space-y-4">
                                    <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" />
                                    <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse" />
                                    <div className="grid grid-cols-2 gap-4 pt-8">
                                        <div className="h-20 bg-gray-700/50 rounded-2xl" />
                                        <div className="h-20 bg-gray-700/50 rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/60 backdrop-blur-sm">
                                <QrCode className="size-32 text-indigo-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="py-24 container"> */}
            <div className="bg-primary-theme p-6 md:p-20 relative overflow-hidden text-center md:text-left">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-24" />
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none my-6">
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
            {/* </section> */}
        </div>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return <DefaultError error={error} />
}