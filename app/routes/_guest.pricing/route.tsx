import { useState } from 'react';
import {
    Check, HelpCircle, Zap, Star, ShieldCheck, Globe,
    ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { BrMd, BrSm } from '~/components/utility/line-break';

const PricingPage = () => {
    const [isPartner, setIsPartner] = useState(true);

    const tiers = [
        {
            name: "Basic",
            price: "0",
            description: "Perfect for upcoming artists and small community gatherings.",
            icon: <Zap className="h-6 w-6 text-slate-400" />,
            features: ["1 Collaborator (You)", "5 Ticket Tiers", "Digital Ticket Delivery", "24/7 Chat Support"],
            cta: "Start for Free",
            highlight: false
        },
        {
            name: "Standard",
            price: "9,700",
            description: "Designed for growing shows and professional event planners.",
            icon: <Star className="h-6 w-6 text-amber-500" />,
            features: ["5 Collaborators", "5 Ticket Tiers", "Digital Event Program", "Verified Event Reviews", "Historical Analytics"],
            cta: "Go Standard",
            highlight: true
        },
        {
            name: "Premium",
            price: "21,500",
            description: "The ultimate power-up for major concerts, festivals and musical events.",
            icon: <ShieldCheck className="h-6 w-6 text-primary-theme" />,
            features: ["30 Collaborators", "Unlimited Ticket Tiers", "Social Media Promotion (5 posts)", "Priority Phone Support", "Custom Branding"],
            cta: "Get Premium",
            highlight: false
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900 animated fadeIn">
            {/* 1. SEO Header Section */}
            <header className="py-20 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
                    <span className="text-gray-500 tracking-tighter">Simple Tools</span> for <BrMd /> <span className="text-primary-theme">Extraordinary</span> Events
                </h1>
                <p className="text-sm md:text-lg text-slate-600 mb-10 leading-relaxed">
                    Whether you're hosting an intimate lounge session in Lagos or a stadium concert in Nairobi,
                    our platform scales with you. No hidden fees. Just pure value.
                </p>

                {/* 2. The Partnership Toggle (The Hook) */}
                <div className="w-full md:max-w-md inline-flex items-center p-1 bg-white border border-slate-200 rounded-2xl shadow-sm mb-12">
                    <button
                        onClick={() => setIsPartner(true)}
                        className={`flex-1 px-2 py-3 rounded-xl text-sm font-bold transition-all ${isPartner ? 'bg-primary-theme text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Partner <BrSm /> (0% Fee)
                    </button>
                    <button
                        onClick={() => setIsPartner(false)}
                        className={`flex-1 px-2 py-3 rounded-xl text-sm font-bold transition-all ${!isPartner ? 'bg-primary-theme text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Independent <BrSm /> (5% Fee)
                    </button>
                </div>

                <div className="max-w-xl mx-auto p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4 items-center text-left">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Globe className="h-5 w-5 text-primary-theme" />
                    </div>
                    <p className="text-xs text-indigo-800 font-medium">
                        {isPartner
                            ? "Partnering with us means 0% platform commission in exchange for on-site sponsorship (shoutouts/flyer logo)."
                            : "Keep your event strictly your own brand. We take a small 5% fee to maintain the infrastructure."}
                    </p>
                </div>
            </header>

            {/* 3. Pricing Cards */}
            <section className="container pb-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, idx) => (
                    <article key={idx} className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all hover:-translate-y-2 ${tier.highlight ? 'border-primary-theme shadow-2xl z-10' : 'border-slate-100 shadow-xl'}`}>
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

                        {/* <button className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${tier.highlight ? 'bg-primary-theme text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                            {tier.cta}
                            <ArrowRight className="h-4 w-4" />
                        </button> */}
                    </article>

                ))}
            </section>
            <div className='mx-auto max-w-md pb-20 px-4'>
                <Link to={"/my-events/new"} className="w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 bg-primary-theme text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                    Get started
                    <ArrowRight className="size-5" strokeWidth={3} />
                </Link>
            </div>


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
                                <a href="mailto:ticketmaster@ariapass.africa" className="bg-white text-primary-theme px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/20 active:scale-95 transition-all">
                                    Contact Us
                                </a>
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

            <hr className='mb-20' />

            {/* 4. Comparison Table (Critical for SEO & Detail) */}
            <section className="max-w-5xl mx-auto px-6 pb-24 hidden md:block">
                <h2 className="text-3xl font-black text-center mb-12 text-slate-900">Compare Features</h2>
                <div className="bg-white rounded-4xl shadow-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 text-sm font-black uppercase tracking-wider text-slate-400">Feature</th>
                                <th className="p-6 text-sm font-black uppercase tracking-wider text-slate-900">Basic</th>
                                <th className="p-6 text-sm font-black uppercase tracking-wider text-primary-theme">Standard</th>
                                <th className="p-6 text-sm font-black uppercase tracking-wider text-purple-600">Premium</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr>
                                <td className="p-6 text-sm font-bold text-slate-700">Ticket Tiers</td>
                                <td className="p-6 text-sm">5 tickets</td>
                                <td className="p-6 text-sm">5 tickets</td>
                                <td className="p-6 text-sm">Unlimited</td>
                            </tr>
                            <tr>
                                <td className="p-6 text-sm font-bold text-slate-700">Collaborators</td>
                                <td className="p-6 text-sm">1 (Just you)</td>
                                <td className="p-6 text-sm">Up to 5</td>
                                <td className="p-6 text-sm">Up to 30</td>
                            </tr>
                            <tr>
                                <td className="p-6 text-sm font-bold text-slate-700">Social Promotion</td>
                                <td className="p-6 text-sm text-slate-300">—</td>
                                <td className="p-6 text-sm">2 Posts</td>
                                <td className="p-6 text-sm">5 Posts + Newsletter</td>
                            </tr>
                            <tr>
                                <td className="p-6 text-sm font-bold text-slate-700">Digital Program</td>
                                <td className="p-6 text-sm text-slate-300">—</td>
                                <td className="p-6 text-sm font-bold text-emerald-600">Included</td>
                                <td className="p-6 text-sm font-bold text-emerald-600">Included</td>
                            </tr>
                            <tr>
                                <td className="p-6 text-sm font-bold text-slate-700">Event Reviews</td>
                                <td className="p-6 text-sm text-slate-300">—</td>
                                <td className="p-6 text-sm font-bold text-emerald-600">Included</td>
                                <td className="p-6 text-sm font-bold text-emerald-600">Included</td>
                            </tr>
                            <tr>
                                <td className="p-6 text-sm font-bold text-slate-700">Event QR Code</td>
                                <td className="p-6 text-sm font-bold text-emerald-600">Included</td>
                                <td className="p-6 text-sm font-bold text-emerald-600">Included</td>
                                <td className="p-6 text-sm font-bold text-emerald-600">Included</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 5. FAQ Section (SEO/FAQ Schema) */}
            <section className="bg-white py-24 px-6 border-t border-slate-100">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black text-center mb-16">Frequently Asked Questions</h2>
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary-theme" />
                                How does the 0% commission work?
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                If you choose the Partner track, we waive our 5% platform fee. In return, we ask for
                                a shoutout from the MC and our logo on your event flyers. It's a barter that helps
                                both of us grow!
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary-theme" />
                                When do I receive my ticket payouts?
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                Standard payouts occur immediately your fans make purchase using your link.
                                Payments made in the weekends (Friday 5pm GMT - Sunday 11pm GMT) will be processed on Monday morning.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;