import { Outlet, redirect } from 'react-router'
import useSession from '~/hooks/use-session';
import type { Route } from '../_auth/+types/route';

export async function loader(_: Route.LoaderArgs) {
    const { validateSession } = useSession();

    try {
        await validateSession();
        return redirect('/dashboard');
    } catch ({ response }: any) {
        return {};
    }
}

export default function AuthLayout() {
    return (
        <div className='h-screen'>
            <Outlet />
        </div>
    )
}
