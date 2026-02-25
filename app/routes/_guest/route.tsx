import { Facebook, Instagram, Phone } from 'lucide-react'
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router'
import { Button } from '~/components/ui/button'
import AnnouncementBanner from '~/components/cards/announcement-banner';
import type { Route } from '../_guest/+types/route';
import useSession from '~/hooks/use-session';
import CustomAvatar from '~/components/custom/custom-avatar';
import MobileNav from './mobile-nav';
import { Separator } from '~/components/ui/separator';
import { toast } from 'sonner';

export async function clientLoader(_: Route.ClientLoaderArgs) {
    const { getUser } = useSession();

    try {
        const user: User = await getUser();
        let session: boolean;

        if (user.name)
            session = true;
        else
            session = false;

        return { session, user };
    } catch ({ response }: any) {
        // console.error(response)
    }
}

export default function GuestLayout({ loaderData }: Route.ComponentProps) {
    const [menu, setMenu] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);

    const NAV = ['Events', 'Organisers', 'Event Programs', 'Pricing', ]

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { session, user }: { session: boolean, user: User } = loaderData ?? { session: false, user: { name: "" } as User };

    return (
        <>
            <div className={`sticky top-0 z-10 ${scrolled && 'bg-white/50 backdrop-blur-lg transition'}`}>
                <nav className={`py-3 container flex items-center justify-between transition-all`}>
                    <div className='flex items-center gap-30'>
                        <Link to="/" className='flex items-center gap-2'>
                            <img src="/images/logos/app_logo.png" alt="AriaPass Logo" className="h-auto w-10 md:w-14 object-contain" />
                        </Link>

                        <ul className='hidden md:flex gap-4 items-center'>
                            {NAV.map((item) => (
                                <li key={item}>
                                    <NavLink
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase().split(' ').join('-')}`}
                                        className={({ isActive }) => `text-sm font-semibold p-2 tracking-tight transition-all ${isActive
                                            ? 'text-primary-theme font-semibold p-2 bg-primary-bg rounded-lg ' // Styles when active
                                            : 'text-slate-600 hover:text-indigo-400' // Styles when inactive
                                            }`}
                                    >
                                        {item}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {(user && user.name)
                        ? (
                            <div className='hidden md:flex gap-2 items-center'>
                                <Link to={"/dashboard"} className='bg-gray-100 text-primary rounded-full px-6 py-2.5 text-xs font-medium'>
                                    Dashboard
                                </Link>

                                <CustomAvatar name={user.name} styles='h-12 w-12 text-xs' />
                            </div>
                        )
                        : (
                            <div className='hidden md:flex items-center gap-2'>
                                <Link to={"register"}>
                                    <Button size={'sm'} variant={'ghost'} className='p-5 tracking-tight rounded-xl cursor-pointer'>
                                        Register
                                    </Button>
                                </Link>
                                <Link to={"/login"}>
                                    <Button size={'sm'} className='p-5 bg-primary tracking-tight rounded-xl cursor-pointer'>
                                        Log in
                                    </Button>
                                </Link>
                            </div>
                        )

                    }
                    <div aria-label="Menu" className="block md:hidden" onClick={() => setMenu(!menu)}>
                        <MobileNav user={user} />
                    </div>
                </nav>

                <div className='sticky top-22 md:top-20 z-10 overflow-hidden'>
                    <AnnouncementBanner />
                </div>
            </div>

            <Outlet context={user} />

            <footer className="container bg-background border-t border-border pt-12 md:pt-16 pb-6">
                <div>
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                        <div className="lg:col-span-2 flex flex-col space-y-6">
                            <Link to="/" className="flex items-center gap-2">
                                <img
                                    src="/images/logos/alt_logo.png"
                                    alt="AriaPass"
                                    className="h-10 w-auto object-contain"
                                />
                                {/* Fallback text just in case the image fails to load */}
                                <span className="font-bold text-xl tracking-tight text-foreground sr-only">
                                    AriaPass
                                </span>
                            </Link>
                            <p className="text-muted-foreground tracking-tight max-w-sm text-xs">
                                Your premier destination for discovering and booking the best live events, concerts, and experiences around you.
                            </p>

                            <p className='text-xs tracking-tighter'>
                                Built by <a href='https://owenahub.com' target='_blank' className="font-bold">
                                    <span className="text-[#F6A700]">OwenaHub</span> Collective
                                </a>
                            </p>

                            <div className="flex items-center space-x-4" id='social'>
                                <a
                                    href="https://www.facebook.com/share/1DpDAHh6zf/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="facebook p-1 rounded-md text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Facebook">
                                    <Facebook className="h-5 w-5" strokeWidth={1} />
                                </a>
                                <a
                                    href="https://whatsapp.com/channel/0029VbBWkeGGU3BImZoq6R0k"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded-md whatsapp text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Twitter"
                                >
                                    <Phone className="h-5 w-5" strokeWidth={1} />
                                </a>
                                <a href="#"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded-md instagram text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-5 w-5" strokeWidth={1} />
                                </a>
                            </div>
                        </div>

                        {/* Attendees Links */}
                        <div className="flex flex-col space-y-5 tracking-tight">
                            <h4 className="font-semibold text-sm  text-foreground">For Attendees</h4>
                            <ul className="flex flex-col text-xs space-y-3 text-muted-foreground">
                                <li><Link to="/events" className="hover:text-foreground transition-colors">Discover Events</Link></li>
                                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                                <li><a href="mailto:ticketmaster@ariapass.africa" className="hover:text-foreground transition-colors">Help Center</a></li>
                                <li><Link to="/purchases" className="hover:text-foreground transition-colors">Track Your Ticket</Link></li>
                            </ul>
                        </div>

                        {/* Organizers Links */}
                        <div className="flex flex-col space-y-5 tracking-tight">
                            <h4 className="font-semibold text-foreground text-sm">For Organizers</h4>
                            <ul className="flex flex-col space-y-3 text-xs text-muted-foreground">
                                <li><Link to="/my-events/new" className="hover:text-foreground transition-colors">Create an Event</Link></li>
                                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Organizer Dashboard</Link></li>
                                <li>
                                    <a
                                        onClick={() => toast('Organiser guide downloaded', {
                                            description: 'Check your downloads folder'
                                        })}
                                        href="/resources/ariapass-guide.pdf"
                                        download="ariapass-organiser-guide.pdf"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Resources: <span className="italic text-gray-400">Organiser guide</span>
                                    </a>
                                </li>
                                <li><a href="mailto:ticketmaster@ariapass.africa" className="hover:text-foreground transition-colors">Contact Sales</a></li>
                            </ul>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 tracking-tight">
                            <img src="/images/logos/app_logo.png" alt="AriaPass" className="h-3 w-auto object-contain" />
                            <span>&copy; {new Date().getFullYear()} AriaPass. All rights reserved.</span>
                        </div>

                        <div className="flex items-center space-x-4 tracking-tighter">
                            <Link to="/terms-of-use" className="hover:text-foreground transition-colors">
                                Terms of Use
                            </Link>
                            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/cookie-policy" className="hover:text-foreground transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}