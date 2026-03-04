import { Link } from 'react-router';
import { RefreshCw, ShieldAlert, Clock, Wallet, ArrowRight, Mail } from 'lucide-react';
import useSession from '~/hooks/use-session';
import RevalidateButton from '~/components/utility/revalidate-button';

interface OrganiserProfileStatusProps {
    isOrganiser: boolean;
    user: any; // Type as needed (e.g., User)
}

export default function OrganiserProfileStatus({ isOrganiser, user }: OrganiserProfileStatusProps) {
    const { validateSession } = useSession();

    const handleRefresh = () => {
        validateSession();
        window.location.reload();
    };

    // 1. User is not an organiser
    if (!isOrganiser) {
        return (
            <div className="bg-primary-bg border border-indigo-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-start md:items-center gap-4 text-white">
                    <div>
                        <h2 className="font-extrabold text-primary-theme tracking-tight text-lg">
                            Ready to host your own events?
                        </h2>
                        <p className="text-sm font-medium text-slate-800 mt-1">
                            Upgrade to an organiser profile to start selling tickets commission-free.
                        </p>
                    </div>
                </div>
                <Link
                    to="/organiser-request"
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold bg-white text-slate-900 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                    Become an Organiser <ArrowRight className="size-4" />
                </Link>
            </div>
        );
    }

    // 2. Organiser profile is pending
    if (user.organiserProfile?.status === 'pending') {
        const hasPayoutSetup = Boolean(user.organiserProfile?.paystackSubaccountCode);

        return (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6 shadow-sm">
                <div className="flex items-start md:items-center gap-4 text-amber-900">
                    <div className="p-3 bg-amber-100/80 rounded-xl shrink-0">
                        <Clock className="size-6 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="font-extrabold tracking-tight text-lg flex items-center gap-2">
                            Profile Under Review
                            <span className="inline-block scale-90"><RevalidateButton /></span>
                        </h2>
                        <p className="text-sm font-medium text-amber-700 mt-1">
                            {hasPayoutSetup
                                ? "We're verifying your details. You'll be able to publish events shortly."
                                : "Your profile is pending. Please set up your payout account to receive funds."}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 flex items-center w-full md:w-auto">
                    {hasPayoutSetup ? (
                        <Link
                            to="/account"
                            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-bold bg-amber-200/50 text-amber-900 hover:bg-amber-200 rounded-xl transition-colors"
                        >
                            View Profile
                        </Link>
                    ) : (
                        <Link
                            to="/account/payouts"
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold bg-amber-600 text-white hover:bg-amber-700 rounded-xl shadow-md shadow-amber-200 transition-colors animate-pulse"
                        >
                            <Wallet className="size-4" /> Setup Payouts
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    // 3. Organiser profile is suspended
    if (user.organiserProfile?.status === 'suspended') {
        return (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6 shadow-sm">
                <div className="flex items-start md:items-center gap-4 text-rose-900">
                    <div className="p-3 bg-rose-100 rounded-xl shrink-0">
                        <ShieldAlert className="size-6 text-rose-600" />
                    </div>
                    <div>
                        <h2 className="font-extrabold tracking-tight text-lg flex items-center gap-2">
                            Account Suspended
                        </h2>
                        <p className="text-sm font-medium text-rose-700 mt-1">
                            Your organiser privileges have been paused. Please contact support to resolve this.
                        </p>
                    </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleRefresh}
                        className="p-3 text-rose-600 bg-rose-100 hover:bg-rose-200 rounded-xl transition-colors"
                        title="Refresh Status"
                    >
                        <RefreshCw className="size-5" />
                    </button>
                    <a
                        href="mailto:hello@ariapass.africa"
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl shadow-md shadow-rose-200 transition-colors"
                    >
                        <Mail className="size-4" /> Contact Support
                    </a>
                </div>
            </div>
        );
    }

    // 4. Fallback (Active Organiser)
    return null;
}