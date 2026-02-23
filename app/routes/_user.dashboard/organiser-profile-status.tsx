import { Link } from 'react-router';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import useSession from '~/hooks/use-session';
import RevalidateButton from '~/components/utility/revalidate-button';

interface OrganiserProfileStatusProps {
    isOrganiser: boolean;
    user: User;
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
            <div className="mt-3 rounded-full bg-slate-100 flex justify-between items-center gap-2 px-4 py-3 text-sm">
                <div className='text-primary'>
                    <h2 className='font-bold tracking-tighter text-sm'>
                        Become an organiser
                    </h2>
                    <p className='text-xs'>No active organiser profile</p>
                </div>
                <Link to="/organiser-request" className="py-1.5 px-3 tracking-tighter text-xs bg-primary text-white rounded-full">
                    Become an organiser
                </Link>
            </div>
        );
    }

    // 2. Organiser profile is pending
    if (user.organiserProfile?.status === 'pending') {
        return (
            <div className="mt-3 rounded-md bg-amber-100 flex flex-col md:flex-row md:justify-between md:items-center gap-8 px-4 py-3 text-sm">
                <div className='text-primary'>
                    <h2 className='font-bold tracking-tighter text-sm flex items-center gap-1'>
                        <span>Under review</span>
                        <RevalidateButton />
                    </h2>
                    <p className='text-xs'>
                        Your request is currently under review.
                    </p>
                </div>

                <div className='pb-3 md:pb-0'>
                    {user.organiserProfile?.paystackSubaccountCode
                        ? (<Link to={'/account'} className='bg-amber-900 text-white tracking-tighter text-xs font-semibold p-2.5 rounded-full'>
                            Go to profile
                        </Link>)
                        : (<Link
                            to={'/account/payouts'}
                            className='bg-amber-900 text-white tracking-tighter text-xs font-semibold p-2.5 rounded-full'
                        >
                            Setup payout account
                        </Link>
                        )
                    }
                </div>
            </div>
        );
    }

    // 3. Organiser profile is suspended
    if (user.organiserProfile?.status === 'suspended') {
        return (
            <div className="mt-3 rounded-md bg-red-100 flex flex-col md:flex-row md:justify-between md:items-center gap-8 px-4 py-3 text-sm">
                <div className='text-primary'>
                    <h2 className='font-bold tracking-tighter text-sm flex items-center gap-1'>
                        <span>Account suspended</span>
                        <RefreshCw
                            size={18}
                            onClick={handleRefresh}
                            className='cursor-pointer'
                        />
                    </h2>
                    <p className='text-xs'>
                        Please contact hello@ariapass.africa for assistance.
                    </p>
                </div>

                <ShieldAlert />
            </div>
        );
    }

    // 4. Fallback (e.g., if status is 'active')
    return null;
}