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
            features: ["1 Collaborator", "1 Ticket Tier", "Digital Ticket Delivery", "24/7 Chat Support"],
            cta: "Start for Free",
            highlight: false
        },
        {
            name: "Standard",
            price: "14,250",
            description: "Designed for growing shows and professional event planners.",
            icon: <Star className="h-6 w-6 text-amber-500" />,
            features: ["5 Collaborators", "3 Ticket Tiers", "Digital Event Program", "Verified Event Reviews", "Historical Analytics"],
            cta: "Go Standard",
            highlight: true
        },
        {
            name: "Premium",
            price: "53,500",
            description: "The ultimate power-up for major concerts and festivals.",
            icon: <ShieldCheck className="h-6 w-6 text-primary-theme" />,
            features: ["30 Collaborators", "5 Ticket Tiers", "Social Media Promotion (5 posts)", "Priority Phone Support", "Custom Branding"],
            cta: "Get Premium",
            highlight: false
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900 animated fadeIn">
            {/* 1. SEO Header Section */}
            <header className="py-20 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    <span className="italic font-serif font-medium text-gray-500 tracking-tighter">Simple Tools</span> for <BrMd /> <span className="text-primary-theme">Extraordinary</span> Events
                </h1>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
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
                            <span className="absolute top-0 right-12 translate-y-[-50%] bg-primary-theme text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
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
                                <td className="p-6 text-sm">1 tier</td>
                                <td className="p-6 text-sm">2 tiers</td>
                                <td className="p-6 text-sm">5 tiers</td>
                            </tr>
                            <tr>
                                <td className="p-6 text-sm font-bold text-slate-700">Collaborators</td>
                                <td className="p-6 text-sm">1 person</td>
                                <td className="p-6 text-sm">5 people</td>
                                <td className="p-6 text-sm">30 people</td>
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
                                <td className="p-6 text-sm font-bold text-slate-700">Fan Reviews</td>
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