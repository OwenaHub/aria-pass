import { Link, useFetcher, useOutletContext } from 'react-router';
import {
    UserCircle, Ticket, Settings, Wallet,
    Users, ShieldCheck, LogOut
} from 'lucide-react';

export default function AccountMenu() {
    // Assuming user comes from a higher-level route
    const user: any = useOutletContext();
    const fetcher = useFetcher();

    // 1. Data-Driven Grid Configuration
    // Added 'desc' to give the boxes a more premium, descriptive feel
    const MENU_ITEMS = [
        {
            label: "My Profile",
            path: "/account/my-account",
            icon: UserCircle,
            desc: "Personal details & security",
            show: true
        },
        {
            label: "Purchases",
            path: "/account/ticket-purchase",
            icon: Ticket,
            desc: "Your event tickets",
            show: true
        },
        {
            label: "Preferences",
            path: "/account/preferences",
            icon: Settings,
            desc: "Notifications & display",
            show: true
        },
        {
            label: "Payouts",
            path: "/account/payouts",
            icon: Wallet,
            desc: "Bank accounts & earnings",
            show: Boolean(user?.organiserProfile)
        },
        {
            label: "Event Staff",
            path: "/account/event-staff",
            icon: Users,
            desc: "Manage your team",
            show: Boolean(user?.organiserProfile)
        },
        {
            label: "Operations",
            path: "/account/operations",
            icon: ShieldCheck,
            desc: "Admin tools & settings",
            show: user?.accountType === 'admin'
        }
    ].filter(item => item.show);

    return (
        <div className="mx-auto min-h-[80vh]">
            {/* The 2x2 (Mobile) and 3x3 (Desktop) Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all text-center relative overflow-hidden"
                    >
                        {/* Decorative Background Hover Glow */}
                        <div className="absolute inset-0 bg-linear-to-b from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/50 group-hover:to-transparent transition-colors" />
                        <div className="relative z-10 flex flex-col items-center">

                            <div className="w-14 h-14 bg-slate-50 text-slate-600 group-hover:bg-primary-theme group-hover:text-white rounded-2xl flex items-center justify-center mb-4 transition-colors shadow-sm">
                                <item.icon className="size-6 shrink-0" strokeWidth={2.5} />
                            </div>
                            <h3 className="font-bold text-slate-900 tracking-tight mb-1">
                                {item.label}
                            </h3>
                            {/* The description is hidden on very small phones to keep the 2x2 grid neat, but shows on slightly larger screens */}
                            <p className="text-[10px] sm:text-xs font-medium text-slate-500 hidden sm:block">
                                {item.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center border-t border-slate-200 pt-10">
                <fetcher.Form
                    method="POST"
                    action="/logout"
                    title="Logout out your account"
                >
                    <button
                        type="submit"
                        disabled={fetcher.state === "loading" || fetcher.state === "submitting"}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors active:scale-95">
                        <LogOut className="size-4 shrink-0" /> Sign Out
                    </button>
                </fetcher.Form>
            </div>
        </div>
    );
}