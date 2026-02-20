import { RefreshCw } from 'lucide-react'
import useSession from '~/hooks/use-session'

export default function RevalidateButton() {
    const { validateSession } = useSession();

    const handleRefresh = () => {
        validateSession();
        window.location.reload();
    };

    return <RefreshCw
        size={18}
        onClick={handleRefresh}
        className='cursor-pointer text-primary'
    />
}
