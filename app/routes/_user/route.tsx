import { NavLink, Outlet, redirect } from "react-router";
import { toast } from "sonner";
import useRoute from "~/hooks/use-route";
import useSession from "~/hooks/use-session";
import { AppSidebar } from "~/components/app-sidebar"

import { Separator } from "~/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "~/components/ui/sidebar"
import type { Route } from "../_user/+types/route";
import Breadcrumb from "~/components/navigation/breadcrumb";
import client from "~/http/client";
import { CalendarCheck, Heart, Home, ShoppingCart, Square, User } from "lucide-react";
import React from "react";
import DefaultError from "~/components/errors/default-error";

export async function clientLoader() {
    const { getUser, validateSession } = useSession();
    const { intendedRoute } = useRoute();

    async function getSpaces() {
        const user = getUser();
        const isOrganiser = user && (await user).organiserProfile;

        if (!isOrganiser) return [];

        const spaces = await client.get('api/spaces');
        return spaces.data;
    }

    async function getInvitedSpaces() {
        const spaces = await client.get('api/spaces/invited');
        return spaces.data;
    }

    try {
        const user = await validateSession();
        const spaces = getSpaces();
        const invitedSpaces = getInvitedSpaces();

        return { user, spaces, invitedSpaces };
    } catch ({ response }: any) {
        if (response?.status === 401) {
            intendedRoute(window.location.pathname);

            toast.warning("Your session has expired!", {
                description: "Login to continue using OwenaHub",
            });
            
            return redirect('/login');
        } else {
            toast.error("Something went wrong", {
                action: {
                    label: "Reload",
                    onClick: () => window.location.reload(),
                },
            })
        }

        return redirect('/login');
    }
}

const app_menu = [
    {
        icon: <Home size={20} strokeWidth={2.2} />,
        label: "Dashboard",
        href: "dashboard"
    },
    {
        icon: <CalendarCheck size={20} strokeWidth={2.2} />,
        label: "My Events",
        href: "my-events"
    },
    {
        icon: <Heart size={20} strokeWidth={2.2} />,
        label: "Favourites",
        href: "favourites"
    },
    {
        icon: <ShoppingCart size={20} strokeWidth={2.2} />,
        label: "Purchases",
        href: "purchases"
    },
    {
        icon: <User size={20} strokeWidth={2.2} />,
        label: "Account",
        href: "account"
    },
];

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
    const { user, spaces, invitedSpaces }: {
        user: User, spaces: Promise<OrganiserEvent[]>, invitedSpaces: Promise<OrganiserEvent[]>
    } = loaderData;

    return (
        <SidebarProvider>
            <AppSidebar user={user} />
            <SidebarInset>
                <header className="z-50 bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-y px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb />
                </header>
                <div className="flex flex-1 flex-col gap-4 px-6 py-10 max-w-[94rem] w-full b mx-auto">
                    <Outlet context={user} />

                    <div className="h-20 w-full" />

                    <div className="border p-1 border-gray-100 shadow bg-white/35 backdrop-blur-xs rounded-full w-max fixed bottom-10 z-50 left-1/2 -translate-x-1/2">
                        <section className="flex items-center gap-2">
                            {app_menu.map((menu, index) => (
                                <NavLink
                                    key={index + menu.href}
                                    to={menu.href}
                                    className={({ isActive, isPending }) =>
                                        isActive
                                            ? "block rounded-full p-1 bg-indigo-100/50 border border-primary-theme backdrop-blur-sm transition-all text-primary-theme "
                                            : isPending
                                                ? "block rounded-full p-1  hover:bg-gray-100 transition-all text-primary"
                                                : "block rounded-full p-1 hover:bg-gray-100 transition-all text-primary"
                                    }
                                >
                                    {({ isActive }) => (
                                        <div className="flex items-center justify-between gap-1">
                                            <div className="flex items-center">
                                                <span className={`
                                                    inline-block p-1.5 ${isActive ? "text-primary-theme rounded" : ""}
                                                    ${menu.href === 'my-events' && !user.organiserProfile?.id ? ' opacity-30' : ''}
                                                    `}>
                                                    {menu.icon ? (React.cloneElement(menu.icon))
                                                        : (<span>
                                                            <Square size={16} />
                                                        </span>)
                                                    }
                                                </span>

                                                <div
                                                    className={`
                                                        grid transition-all duration-300 ease-in-out
                                                        ${isActive ? 'grid-cols-[1fr] opacity-100 pe-2' : 'grid-cols-[0fr] opacity-0'}
                                                        `}>
                                                    <span className="capitalize text-sm font-medium tracking-tighter whitespace-nowrap overflow-hidden">
                                                        {menu.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </NavLink>
                            ))
                            }
                        </section>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return <DefaultError error={error} />
}