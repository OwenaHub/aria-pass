import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Shield, Ticket, Users, AlertTriangle, Copyright, Scale } from 'lucide-react';
import { Link } from 'react-router';

const TermsOfUse = () => {
    const lastUpdated = "December 23, 2025";
    const [activeSection, setActiveSection] = useState('acceptance');

    // Define your sections here for easy mapping
    const sections = [
        { id: 'acceptance', title: '1. Acceptance of Terms', icon: FileText },
        { id: 'accounts', title: '2. User Accounts', icon: Users },
        { id: 'organizers', title: '3. For Organizers', icon: Shield },
        { id: 'ticketing', title: '4. Ticketing & Refunds', icon: Ticket },
        { id: 'conduct', title: '5. User Conduct', icon: AlertTriangle },
        { id: 'ip', title: '6. Intellectual Property', icon: Copyright },
        { id: 'liability', title: '7. Limitation of Liability', icon: Scale },
    ];

    // Handle smooth scrolling
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for sticky headers if you have a top navbar (adjust -100 as needed)
            const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Optional: Highlight active section on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -50% 0px' } // Adjusts trigger point
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold text-indigo-900">Terms of Use</h1>
                        <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">

                    {/* SIDEBAR MENU (Hidden on mobile, sticky on desktop) */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <nav className="sticky top-40 space-y-1">
                            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Table of Contents
                            </p>
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${activeSection === section.id
                                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                                        : 'text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <section.icon className={`flex-shrink-0 -ml-1 mr-3 h-4 w-4 ${activeSection === section.id ? 'text-indigo-500' : 'text-gray-400'}`} />
                                    <span className="truncate">{section.title}</span>
                                </button>
                            ))}

                            <div className="mt-8 px-3">
                                <p className="text-xs text-gray-400">
                                    Last Updated:<br /> {lastUpdated}
                                </p>
                            </div>
                        </nav>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="lg:col-span-9 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">

                        {/* Mobile "Table of Contents" (Visible only on small screens) */}
                        <div className="lg:hidden p-4 border-b border-gray-100 bg-gray-50">
                            <p className="text-sm font-bold text-gray-700 mb-2">Quick Jump To:</p>
                            <div className="flex flex-wrap gap-2">
                                {sections.map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-600"
                                    >
                                        {section.title.split('.')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-8 sm:px-10 space-y-12">

                            {/* Introduction */}
                            <div className="border-b border-gray-100 pb-8">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Welcome to <strong>AriaPass</strong>. By accessing our platform to discover, promote, or purchase tickets for musical events, you agree to be bound by these Terms.
                                </p>
                            </div>

                            {/* SECTION 1 */}
                            <section id="acceptance" className="scroll-mt-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="text-indigo-500 mr-2">1.</span> Acceptance of Terms
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    By creating an account or accessing any part of our platform, you agree to comply with these terms. If you represent an event organization, you warrant that you have the authority to bind that entity to these terms.
                                </p>
                            </section>

                            {/* SECTION 2 */}
                            <section id="accounts" className="scroll-mt-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="text-indigo-500 mr-2">2.</span> User Accounts
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    To access certain features (such as buying tickets or posting events), you may be required to register. You agree to:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                                    <li>Provide accurate and current information.</li>
                                    <li>Maintain the security of your password.</li>
                                    <li>Accept responsibility for all activities under your account.</li>
                                </ul>
                            </section>

                            {/* SECTION 3 */}
                            <section id="organizers" className="scroll-mt-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="text-indigo-500 mr-2">3.</span> For Event Organizers
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    When posting an event, you warrant that:
                                </p>
                                <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100 text-indigo-900 text-sm">
                                    You have the legal right to use all media (images/audio) uploaded and possess all necessary permits for the event execution.
                                </div>
                            </section>

                            {/* SECTION 4 */}
                            <section id="ticketing" className="scroll-mt-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="text-indigo-500 mr-2">4.</span> Ticketing & Refunds
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    We act as an intermediary. Refunds are generally subject to the specific Event Organizer's policy.
                                </p>
                                <p className="text-gray-600 text-sm">
                                    <strong>Fees:</strong> Booking fees are non-refundable unless the event is cancelled by the organizer or AriaPass.
                                </p>
                            </section>

                            {/* SECTION 5 */}
                            <section id="conduct" className="scroll-mt-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="text-indigo-500 mr-2">5.</span> User Conduct
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    You agree not to upload malicious code, harass others, engage in scalping, or interfere with the platform's operation. Violation of these rules may result in immediate account suspension.
                                </p>
                            </section>

                            {/* SECTION 6 */}
                            <section id="ip" className="scroll-mt-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="text-indigo-500 mr-2">6.</span> Intellectual Property
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    The design and code of AriaPass are our property. User-generated content remains yours but you grant us a license to display it for promotional purposes.
                                </p>
                            </section>

                            {/* SECTION 7 */}
                            <section id="liability" className="scroll-mt-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="text-indigo-500 mr-2">7.</span> Limitation of Liability
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    We are not liable for indirect damages arising from your use of the service. We do not guarantee the quality or safety of events promoted by third parties.
                                </p>
                            </section>

                            {/* Footer Contact */}
                            <div className="mt-10 pt-10 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900">Questions?</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Contact us at <a href="mailto:legal@example.com" className="text-indigo-600 hover:underline">hello@owenahub.com</a>
                                </p>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;