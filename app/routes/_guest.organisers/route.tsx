import { ArrowRight, CheckCircle, ChevronRight, Smartphone, Users, Zap } from 'lucide-react'
import { Link, type MetaFunction } from 'react-router'
import EmptyState from '~/components/skeletons/empty-state'
import { Button } from '~/components/ui/button'
import { defaultMeta } from '~/lib/meta'

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Organisers | AriaPass" },
    ];
}

export default function Organisers() {
    return (
        <main className='animated fadeIn'>
            <section className="pt-28 pb-16 md:pt-30 md:pb-24 px-4 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide mb-6">
                        <Zap className="w-3 h-3 text-pink-500" /> <span className="font-bold text-pink-500">NEW:</span> <span>Digital Event Programs</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
                        Sell tickets. <br className="hidden md:block" />
                        Keep <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">100% of the profit.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The only event platform that combines <strong>0% commission ticketing</strong> with real-time team collaboration and immersive digital programs.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button className="tracking-tighter w-full sm:w-auto px-12 py-3 bg-primary-theme hover:bg-indigo-700 text-white font-semibold rounded-full text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1">
                            <Link to="/organiser-request">
                                Get Started
                            </Link>
                        </button>
                        <button className="tracking-tighter w-full sm:w-auto px-12 py-3 bg-white border hover:bg-primary-bg text-primary font-semibold rounded-full text-lg shadow-indigo-200 transition-all transform hover:-translate-y-1">
                            <Link to="/events">
                                Explore events
                            </Link>
                        </button>
                    </div>

                    {/* Abstract Dashboard Visual */}
                    <div className="relative mx-auto max-w-4xl">
                        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Fake Browser Header */}
                            <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="flex -space-x-2">
                                    {/* Team Collaboration Visual Hint */}
                                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">JD</div>
                                    <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs font-bold text-pink-600">AS</div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500">+3</div>
                                </div>
                            </div>
                            {/* Fake Content */}
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                <div className="col-span-2 space-y-4">
                                    <div className="h-32 bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                                        <div className="h-4 w-1/3 bg-slate-100 rounded mb-2"></div>
                                        <div className="text-3xl font-bold text-slate-800">$12,450</div>
                                        <div className="text-sm text-green-600 mt-1">Commission Fees: $0.00</div>
                                    </div>
                                    <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm"></div>
                                </div>
                                <div className="hidden md:block bg-indigo-50 rounded-xl border border-indigo-100 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Smartphone className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-bold text-indigo-900">Digital Program</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-indigo-200 rounded w-full"></div>
                                        <div className="h-2 bg-indigo-200 rounded w-3/4"></div>
                                        <div className="h-2 bg-indigo-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-20 bg-slate-50 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Zero Commission Fees</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Why pay for your own success? We don't take a cut of your ticket sales. You keep every penny you earn, instantly.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Don't run the show alone. Invite your team to the dashboard, assign roles, and manage attendees together in real-time.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <Smartphone className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Digital Programs</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Ditch the paper. Create interactive digital brochures and schedules that attendees can access directly from their phones.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Short CTA */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter">Ready to launch your next event?</h2>
                    <p className="text-slate-600 mb-8">Join our community of organizers saving money and working smarter.</p>
                    <Link to={'/register'} className='cursor-pointer'>
                        <button className="px-8 py-4 bg-primary hover:bg-slate-800 text-white font-semibold rounded-full text-base transition-colors">
                            Get Started for Free
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    )
}
