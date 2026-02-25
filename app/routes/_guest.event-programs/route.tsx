import {
    Plus,
    QrCode,
    LayoutList,
    Image as ImageIcon,
    Music,
    Smartphone,
    ArrowRight,
    Zap,
    Star,
    ShieldCheck,
    Check
} from 'lucide-react';
import { Link } from 'react-router';

export default function EventProgramLanding() {
    const features = [
        {
            title: "Unlimited Items",
            desc: "Add artist bios, setlists, sponsor logos, and schedule timelines without limits.",
            icon: <LayoutList className="h-6 w-6 text-primary-theme" />
        },
        {
            title: "Interactive Media",
            desc: "Embed music links, social media profiles, and gallery images for a rich fan experience.",
            icon: <Music className="h-6 w-6 text-primary-theme" />
        },
        {
            title: "Instant QR Generation",
            desc: "Download a custom QR code for your posters. Fans scan to see the program instantly.",
            icon: <QrCode className="h-6 w-6 text-primary-theme" />
        },
        {
            title: "Real-time Updates",
            desc: "Running late? Update the schedule in the app and it reflects for fans immediately.",
            icon: <Smartphone className="h-6 w-6 text-primary-theme" />
        }
    ];

    const tiers = [
        {
            name: "Basic",
            price: "0",
            description: "Perfect for upcoming artists and small community gatherings.",
            icon: <Zap className="h-6 w-6 text-slate-400" />,
            features: ["1 Collaborator", "1 Ticket Tier", "Digital Ticket Delivery", "24/7 Chat Support"],
            cta: "Start for Free",
            highlight: false
        },
        {
            name: "Standard",
            price: "9,700",
            description: "Designed for growing shows and professional event planners.",
            icon: <Star className="h-6 w-6 text-amber-500" />,
            features: ["5 Collaborators", "3 Ticket Tiers", "Digital Event Program", "Verified Event Reviews", "Historical Analytics"],
            cta: "Go Standard",
            highlight: true
        },
        {
            name: "Premium",
            price: "21,500",
            description: "The ultimate power-up for major concerts, festivals and musical events.",
            icon: <ShieldCheck className="h-6 w-6 text-primary-theme" />,
            features: ["30 Collaborators", "5 Ticket Tiers", "Social Media Promotion (5 posts)", "Priority Phone Support", "Custom Branding"],
            cta: "Get Premium",
            highlight: false
        }
    ];

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* 1. Hero Section */}
            <section className="relative pt-20 pb-16 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-primary-theme text-xs font-bold uppercase tracking-widest mb-6">
                            <Plus className="h-3 w-3" /> New Feature
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
                            Ditch the paper. <br />
                            <span className="text-primary-theme">Go Digital.</span>
                        </h1>
                        <p className="md:text-lg text-slate-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                            Create beautiful, interactive digital programs for your musical events.
                            Share with a link or a QR code. Save costs, save the planet.
                        </p>
                        <button className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-slate-200">
                            Create your event program
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Visual Mockup - The "Phone" Experience */}
                    <div className="relative flex justify-center">
                        <div className="relative w-72 h-145 bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden ring-4 ring-slate-100">
                            {/* Internal Content of Phone */}
                            <div className="bg-white h-full overflow-y-auto custom-scrollbar">
                                <div className="h-40 bg-primary-theme p-6 flex items-end">
                                    <h3 className="text-white font-black text-xl leading-tight">Lagos Jazz Night 2026</h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-primary-theme text-xs">8PM</div>
                                        <div><p className="text-xs font-bold text-slate-900">Doors Open</p></div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-primary-theme text-xs text-center leading-none">9:30<br />PM</div>
                                        <div><p className="text-xs font-bold text-slate-900">Masego Live</p><p className="text-[10px] text-slate-400">Main Stage</p></div>
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-slate-100">
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Our Sponsors</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                                            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating QR Element */}
                        <div className="absolute -bottom-6 -right-4 md:-right-12 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-2 animate-bounce-slow">
                            <QrCode className="h-12 w-12 text-primary-theme" />
                            <span className="text-[10px] font-black uppercase text-slate-400">Scan Me</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Features Grid */}
            <section className="py-24 bg-slate-50 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Built for organizers, loved by fans.</h2>
                        <p className="text-slate-500 font-medium">Everything you need to run a smooth show.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex hover:text-white items-center justify-center mb-6 group-hover:bg-primary-theme group-hover:text-white transition-colors">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-14 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, idx) => (
                    <article key={idx} className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all hover:-translate-y-2 ${tier.highlight ? 'border-primary-theme shadow-2xl' : 'border-slate-100 shadow-xl'}`}>
                        {tier.highlight && (
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[-50%] bg-primary-theme text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Most Popular
                            </span>
                        )}

                        <div className="mb-8">
                            <div className="mb-4">{tier.icon}</div>
                            <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">{tier.description}</p>
                        </div>

                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-4xl font-black">₦{tier.price}</span>
                            <span className="text-slate-400 font-bold text-sm">/ event</span>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {tier.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>

            {/* 4. Final CTA */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.3),transparent)]" />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-6">Ready to launch your event?</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
                            Setting up takes less than 5 minutes. No technical skills required.
                        </p>
                        <Link to={'/register'}>
                            <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all active:scale-95 shadow-2xl">
                                Get Started Now
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}