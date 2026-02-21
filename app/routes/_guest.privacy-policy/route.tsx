import { useState, useEffect } from 'react';
import { ArrowLeft, Database, Eye, Share2, Cookie, Lock, UserCheck, Mail } from 'lucide-react';
import { Link } from 'react-router';

const PrivacyPolicy = () => {
  const lastUpdated = "December 23, 2025";
  const [activeSection, setActiveSection] = useState('collection');

  // Defined sections for the Privacy Policy
  const sections = [
    { id: 'collection', title: '1. Info We Collect', icon: Database },
    { id: 'usage', title: '2. How We Use Data', icon: Eye },
    { id: 'sharing', title: '3. Sharing Data', icon: Share2 },
    { id: 'cookies', title: '4. Cookies & Tracking', icon: Cookie },
    { id: 'security', title: '5. Data Security', icon: Lock },
    { id: 'rights', title: '6. Your Rights', icon: UserCheck },
    { id: 'contact', title: '7. Contact Us', icon: Mail },
  ];

  // Handle smooth scrolling
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Highlight active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px' }
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
            <h1 className="text-xl font-bold text-indigo-900">Privacy Policy</h1>
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
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200
                    ${activeSection === section.id 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                      : 'text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <section.icon className={`flex-shrink-0 -ml-1 mr-3 h-4 w-4 ${activeSection === section.id ? 'text-indigo-500' : 'text-gray-400'}`} />
                  <span className="truncate">{section.title}</span>
                </button>
              ))}
              
              <div className="mt-8 px-3">
                <p className="text-xs text-gray-400">
                  Last Updated:<br/> {lastUpdated}
                </p>
              </div>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            
            {/* Mobile "Table of Contents" */}
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
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your privacy matters to <strong>AriaPass</strong>. This policy outlines how we collect, use, and protect your personal information when you use our platform to discover events and purchase tickets.
                </p>
              </div>

              {/* SECTION 1: Collection */}
              <section id="collection" className="scroll-mt-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-indigo-500 mr-2">1.</span> Information We Collect
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  We collect information to provide our services effectively:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <h4 className="font-semibold text-gray-800">Account Info</h4>
                        <p className="text-sm text-gray-600  mt-1">Name, email address, password, and profile image.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <h4 className="font-semibold text-gray-800">Transaction Data</h4>
                        <p className="text-sm text-gray-600 mt-1">Billing address and payment details (processed securely via Paystack).</p>
                    </div>
                </div>
              </section>

              {/* SECTION 2: Usage */}
              <section id="usage" className="scroll-mt-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                   <span className="text-indigo-500 mr-2">2.</span> How We Use Your Data
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                  <li>To process ticket purchases and deliver electronic tickets.</li>
                  <li>To notify you of event changes, cancellations, or updates.</li>
                  <li>To recommend musical events based on your location and past preferences.</li>
                  <li>To prevent fraud and ensure the security of our platform.</li>
                </ul>
              </section>

              {/* SECTION 3: Sharing */}
              <section id="sharing" className="scroll-mt-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                   <span className="text-indigo-500 mr-2">3.</span> Sharing with Event Organizers
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  When you purchase a ticket, essential information (such as your name and email) is shared with the <strong>Event Organizer</strong>.
                </p>
                <div className="bg-amber-50 p-5 rounded-lg border border-amber-100 text-amber-900 text-sm">
                  <strong>Important:</strong> Event Organizers use this data for check-in purposes. They are bound by our data agreements, but we recommend reviewing the privacy policies of specific organizers for major events.
                </div>
              </section>

              {/* SECTION 4: Cookies */}
              <section id="cookies" className="scroll-mt-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                   <span className="text-indigo-500 mr-2">4.</span> Cookies & Tracking
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                    We use cookies to keep you logged in and to analyze site traffic.
                </p>
                <p className="text-gray-600 text-sm">
                  You can control cookie preferences through your browser settings. However, disabling cookies may limit your ability to purchase tickets.
                </p>
              </section>

              {/* SECTION 5: Security */}
              <section id="security" className="scroll-mt-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                   <span className="text-indigo-500 mr-2">5.</span> Data Security
                </h2>
                <p className="text-gray-600 text-sm">
                  We implement industry-standard encryption (SSL) to protect your data during transmission. We do not store full credit card numbers on our servers; transactions are handled by PCI-compliant payment processors.
                </p>
              </section>

               {/* SECTION 6: Rights */}
               <section id="rights" className="scroll-mt-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                   <span className="text-indigo-500 mr-2">6.</span> Your Rights
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                  <li>Request access to the personal data we hold about you.</li>
                  <li>Request correction of inaccurate data.</li>
                  <li>Request deletion of your account and associated data (Subject to data retention laws for financial records).</li>
                </ul>
              </section>

              {/* SECTION 7: Contact */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                   <span className="text-indigo-500 mr-2">7.</span> Contact Us
                </h2>
                <p className="text-gray-600 text-sm">
                  If you have privacy concerns, please contact our Data Protection Officer at:
                </p>
                <div className="mt-4">
                    <a href="mailto:ticketmaster@ariapass.africa" className="text-indigo-600 font-medium hover:underline text-sm">
                        ticketmaster@ariapass.africa
                    </a>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-10 pt-10 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">
                    © {new Date().getFullYear()} AriaPass. All rights reserved.
                </p>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;