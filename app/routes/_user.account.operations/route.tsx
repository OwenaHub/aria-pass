import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import client from "~/http/client";
import type { Route } from "../_user.account.operations/+types/route";
import { useFetcher } from "react-router";

import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import {
    Building2, CalendarClock, Check, Globe, Info, Landmark,
    Mail, Percent, Phone, Settings2, User, WalletCards, X, ChevronDown
} from "lucide-react";

dayjs.extend(relativeTime);

export async function clientLoader() {
    try {
        const { data } = await client.get('/api/admin/organiser-profiles');
        return { profiles: data }
    } catch ({ response }: any) {
        toast.error("Something went wrong");
        throw new Error("Something went wrong");
    }
}

// --- NEW SUB-COMPONENT ---
// Extracts the card logic so each card manages its own open/close state
function OrganiserCard({ profile, fetcher }: {
    profile: OrganiseProfile,
    fetcher: any
}) {
    const [isOpen, setIsOpen] = useState(false);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'suspended':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'pending':
            default:
                return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const formatStrategy = (strategy: string) => {
        return strategy.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
            {/* --- CLICKABLE HEADER --- */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-50 p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors select-none"
            >
                <div className="flex md:items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary-bg flex items-center justify-center text-primary-theme shrink-0">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-md font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            {profile.organiserName}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium uppercase tracking-wider ${getStatusStyles(profile.status)}`}>
                                {profile.status}
                            </span>
                        </h3>
                        <div className="flex flex-col md:flex-row tracking-tighter md:items-center gap-2 text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                                <User size={14} className="inline-block" />
                                <span>{profile.user}</span>
                            </div>
                            <span className="text-gray-300 hidden md:inline-block">•</span>
                            <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">ID: {profile.id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                        <CalendarClock size={16} />
                        <span>Applied {dayjs(profile.createdAt).fromNow()}</span>
                    </div>
                    {/* Animated Chevron indicator */}
                    <div className={`p-1 rounded-full hover:bg-gray-200 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-gray-500" />
                    </div>
                </div>
            </div>

            {/* --- COLLAPSIBLE BODY (Only mounts when isOpen is true) --- */}
            {isOpen && (
                <div className="border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* BODY DATA GRID */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Column 1: Profile & Contact */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Info size={14} /> Profile & Contact
                            </h4>
                            <div className="space-y-3 text-sm">
                                {profile.bio && (
                                    <p className="text-gray-600 italic">"{profile.bio}"</p>
                                )}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Mail size={16} className="text-gray-400" />
                                    <a href={`mailto:${profile.contactEmail}`} className="hover:text-blue-600 hover:underline">{profile.contactEmail}</a>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{profile.contactPhone}</span>
                                </div>
                                {profile.websiteUrl && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Globe size={16} className="text-gray-400" />
                                        <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                                            {profile.websiteUrl.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Financial/Payout Details */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Landmark size={14} /> Payout Details
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100 text-sm">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                    <span className="text-gray-500 font-medium">Bank</span>
                                    <span className="font-semibold text-gray-900 text-right">{profile.bankName}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                    <span className="text-gray-500 font-medium">Account No.</span>
                                    <span className="font-mono font-semibold text-gray-900">{profile.accountNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Account Name</span>
                                    <span className="font-medium text-gray-900 text-right truncate max-w-37.5" title={profile.accountName}>
                                        {profile.accountName}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <WalletCards size={14} />
                                <span>Subaccount: <span className="font-mono text-gray-700">{profile.paystackSubaccountCode}</span></span>
                            </div>
                        </div>

                        {/* Column 3: Platform Settings */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Settings2 size={14} /> Platform Settings
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between bg-blue-50/50 p-2.5 rounded-md border border-blue-100">
                                    <div className="flex items-center gap-2 text-blue-800">
                                        <Percent size={16} className="text-blue-600" />
                                        <span className="font-medium">Commission Rate</span>
                                    </div>
                                    <span className="font-bold text-blue-700">{profile.commissionRate}%</span>
                                </div>

                                <div className="flex flex-col gap-1 mt-2">
                                    <span className="text-gray-500 text-xs font-medium">Fee Strategy</span>
                                    <span className="inline-flex w-max items-center px-2.5 py-1 rounded bg-gray-100 text-gray-800 font-medium">
                                        {formatStrategy(profile.processingFeeStrategy)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
                        {(profile.status === 'pending' || profile.status === 'suspended') && (
                            <fetcher.Form method="POST" action={`profile-request/${profile.id}`}>
                                <input type="hidden" name="status" value="active" />
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm flex items-center gap-2 transition-colors"
                                >
                                    <Check strokeWidth={2.5} size={16} /> Approve Organiser
                                </Button>
                            </fetcher.Form>
                        )}

                        {profile.status === 'active' && (
                            <fetcher.Form method="POST" action={`profile-request/${profile.id}`}>
                                <input type="hidden" name="status" value="suspended" />
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="rounded-md shadow-sm flex items-center gap-2 transition-colors"
                                >
                                    <X strokeWidth={2.5} size={16} /> Suspend Organiser
                                </Button>
                            </fetcher.Form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function Administrator({ loaderData }: Route.ComponentProps) {
    const { profiles } = loaderData;
    const fetcher = useFetcher();

    return (
        <div>
            <section>
                <h2 className="text-lg mb-5 text-gray-400 tracking-tighter flex items-center gap-5">
                    Profile requests <div className="border-t w-20 inline-block" />
                </h2>

                <section className="space-y-2">
                    {profiles && profiles.length ? (
                        profiles.map((profile: any) => (
                            <OrganiserCard
                                key={profile.id}
                                profile={profile}
                                fetcher={fetcher}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 font-medium">No organiser profiles found.</p>
                        </div>
                    )}
                </section>
            </section>
        </div>
    );
}