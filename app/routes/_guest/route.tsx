import { Equal, Facebook, X } from 'lucide-react'
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router'
import { Button } from '~/components/ui/button'
import AnnouncementBanner from '~/components/cards/announcement-banner';
import type { Route } from '../_guest/+types/route';
import useSession from '~/hooks/use-session';
import CustomAvatar from '~/components/custom/custom-avatar';
import MobileNav from './mobile-nav';

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

    const NAV = ['Events', 'Organisers', 'Artists']

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { session, user }: { session: boolean, user: User } = loaderData ?? { session: false, user: { name: "" } as User };

    return (
        <>
            <div className={`rounded-full mx-5 mt-2 sticky top-2 z-10 ${scrolled && 'bg-white/70 backdrop-blur-lg shadow-md transition'}`}>
                <nav className={`p-4 md:p-2 ps-3 md:ps-8 flex items-center justify-between transition-all`}>
                    <Link to="/" className='flex items-center gap-2'>
                        <img src="/images/logos/app_logo.png" alt="AriaPass Logo" className="h-auto w-10 md:w-14 object-contain" />
                    </Link>

                    <ul className='hidden md:flex gap-8'>
                        {NAV.map((item) => (
                            <li key={item} className='hover:text-gray-400 text-xs font-normal tracking-tight transition-all'>
                                <Link to={item.toLowerCase()}>{item}</Link>
                            </li>
                        ))}
                    </ul>
                    {(user && user.name)
                        ? (
                            <div className='hidden md:flex gap-5 items-center'>
                                <Link to={"/my-events/new"} className='bg-primary rounded-full px-6 py-3 text-xs text-white font-medium'>
                                    Post an Event
                                </Link>

                                <Link to={'dashboard'} className='hover:text-gray-400'>
                                    <Equal />
                                </Link>

                                <CustomAvatar name={user.name} styles='h-12 w-12 text-xs' />
                            </div>
                        )
                        : (
                            <div className='hidden md:flex items-center gap-2'>
                                <Link to={"register"}>
                                    <Button size={'sm'} variant={'ghost'} className='p-6 rounded-full cursor-pointer'>
                                        Register
                                    </Button>
                                </Link>
                                <Link to={"/login"}>
                                    <Button size={'sm'} className='p-6 bg-[#3A3546] rounded-full cursor-pointer'>
                                        Log in
                                    </Button>
                                </Link>
                            </div>
                        )

                    }
                    <div aria-label="Menu" className="block md:hidden" onClick={() => setMenu(!menu)}>
                        <MobileNav />
                    </div>
                </nav>
               
            </div>
            <div className='sticky top-22 md:top-24 z-10 mx-5 overflow-hidden rounded-lg'>
                <AnnouncementBanner />
            </div>

            <Outlet context={user} />

            <footer className="bg-white text-muted-foreground pt-5">
                <div className="flex justify-between items-center container pb-4">
                    <h5 className='font-light text-lg tracking-tighter'>
                        <Link to="/" className='flex items-center gap-2'>
                            <img src="/images/logos/alt_logo.png" alt="AriaPass" className="h-auto w-18 object-contain" />
                        </Link>
                    </h5>

                    <div className="flex flex-col items-center space-y-3">
                        <a
                            href="https://www.facebook.com/people/AriaPass/61580661771119/"
                            rel='noreferrer'
                            target='_blank'
                            aria-label="Facebook"
                            className="hover:text-foreground text-xs flex gap-2 items-center"
                        >
                            <span className="rounded-full bg-primary p-1 text-white">
                                <Facebook className="h-4 w-4 fill-white" strokeWidth={0} />
                            </span>
                            <span className='font-semibold'>Facebook</span>
                        </a>
                    </div>

                </div>

                {/* Bottom note */}
                <div className="container text-xs text-muted-foreground py-5 flex justify-center gap-3 items-center">
                    <span>
                        &copy;{new Date().getFullYear()} AriaPass.
                    </span>

                    <Link to="/terms-of-use">
                        Terms
                    </Link>

                    <Link to="/privacy-policy">
                        Policy
                    </Link>
                </div>
            </footer>
        </>
    )
}