import { ChevronRight, Equal, Facebook, X } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react';
import { Await, Link, NavLink, Outlet } from 'react-router'
import { Button } from '~/components/ui/button'
import AnnouncementBanner from '~/components/cards/announcement-banner';
import type { Route } from '../_guest/+types/route';
import useSession from '~/hooks/use-session';
import CustomAvatar from '~/components/custom/custom-avatar';

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
            <div className={`rounded-lg mx-5 my-3 sticky top-3 z-10 ${scrolled && 'bg-white/70 backdrop-blur-lg shadow-md transition'}`}>
                <nav className={`py-3 container flex items-center justify-between transition-all`}>
                    <Link to="/" className='flex items-center gap-2'>
                        <img src="/images/logos/app_logo.png" alt="AriaPass Logo" className="h-auto w-18 object-contain" />
                    </Link>

                    <ul className='hidden md:flex gap-8'>
                        {NAV.map((item) => (
                            <li key={item} className='hover:text-gray-400 text-sm font-normal tracking-tight transition-all'>
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
                                    <Button size={'sm'} variant={'ghost'} className='px-6 py-5 rounded-full cursor-pointer'>
                                        Register
                                    </Button>
                                </Link>
                                <Link to={"/login"}>
                                    <Button size={'sm'} className='px-6 py-5 bg-[#3A3546] rounded-full cursor-pointer'>
                                        Log in
                                    </Button>
                                </Link>
                            </div>
                        )

                    }
                    <button aria-label="Menu" className="block md:hidden" type="button" onClick={() => setMenu(!menu)}>
                        {!menu
                            ? <Equal />
                            : <X />
                        }
                    </button>
                </nav>
                {menu && (
                    <div className="bg-white animated fadeIn rounded-lg block md:hidden mx-auto px-4 py-4 z-50">
                        <div>
                            <div className="mb-3">
                                {NAV.map((link) => (
                                    <div key={link} className="border-b py-4">
                                        <NavLink
                                            onClick={() => setMenu(!menu)}
                                            to={link}
                                            className={({ isActive }) => isActive ? "text-primary font-bold" : "text-gray-500"}
                                        >
                                            {link}
                                        </NavLink>
                                    </div>
                                ))}
                                <div className="py-4">
                                    <a href="tel:+2348026658956" className="flex text-foreground text-sm font-light gap-2 items-center">
                                        <span>Contact support</span> <ChevronRight size={12} />
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Suspense fallback={<div className="h-10 w-full rounded bg-gray-100 animate-pulse" />}>
                                    <Await resolve={session}>
                                        {(session: boolean) =>
                                            session ? (
                                                <Link
                                                    onClick={() => setMenu(!menu)}
                                                    to="/dashboard"
                                                    className="bg-secondary rounded-[6px] text-secondary-foreground text-xs font-medium hover:shadow-lg py-3 text-center uppercase"
                                                >
                                                    Dashboard
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        onClick={() => setMenu(!menu)}
                                                        to="/login"
                                                        className="bg-white border border-gray-100 rounded-full text-center text-gray-600 text-sm w-full block font-bold hover:shadow-lg py-3"
                                                    >
                                                        Log in
                                                    </Link>
                                                    <Link
                                                        onClick={() => setMenu(!menu)}
                                                        to="/register"
                                                        className="rounded-full text-white text-center text-sm w-full block font-bold bg-[#3A3546] py-3"
                                                    >
                                                        Sign up
                                                    </Link>
                                                </>
                                            )
                                        }
                                    </Await>
                                </Suspense>
                            </div>
                        </div>
                    </div>
                )}
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