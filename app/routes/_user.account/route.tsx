import { Outlet, useOutletContext, type MetaFunction } from "react-router";
import { defaultMeta } from '~/lib/meta';

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Account | AriaPass" },
    ];
}

export default function AccountLayout() {
    const user: User = useOutletContext();

    return (
        <div>
            <section className=" mx-auto">
                <p className="text-gray-500 tracking-tight">{user.name}</p>
                <h1 className="text-3xl font-extrabold tracking-tighter">Account Setting</h1>
            </section>

            <section className=" mx-auto mt-8">
                <Outlet context={user} />
            </section>
        </div>
    );
}
