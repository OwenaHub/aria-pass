import { ArrowRight, Building2, PlusCircle, Users } from "lucide-react";
import { Suspense } from "react";
import { Await, Link, redirect, useOutletContext } from "react-router";
import LoaderWithText from "~/components/skeletons/loader-with-text";
import type { Route } from "./+types/route";
import client from "~/http/client";
import { extractNames } from "~/lib/utils";
import AvatarGroup from "~/components/custom/avatar-group";
import useSession from "~/hooks/use-session";

export async function clientLoader() {
  const { getUser, validateSession } = useSession();

  try {
    const user = await getUser();
    const isOrganiser = Boolean(user && user.organiserProfile);

    const collaborations = Promise.all([
      client.get('api/spaces/invited').then(res => res.data).catch(() => []),
      isOrganiser ? client.get('api/spaces').then(res => res.data).catch(() => []) : Promise.resolve([])
    ]);

    return {
      collaborations: collaborations,
    };

  } catch (error: any) {
    if (error.response?.status === 409) await validateSession();
    console.error("Failed to fetch dashboard data:", error);
    return redirect('/dashboard');
  }
}

export default function Spaces({ loaderData }: Route.ComponentProps) {
  const { collaborations } = loaderData;
  const user: any = useOutletContext();

  const SpaceCard = ({ space, user, type }: { space: any, user: any, type: 'invited' | 'owned' }) => {
    const isInvited = type === 'invited';
    const userRole = isInvited ? space.members.find((mem: any) => mem.email === user.email) : null;

    return (
      <Link to={`/spaces/${space.slug}`} className="group block bg-gray-50 border border-gray-200 p-5 rounded-2xl hover:border-indigo-300 transition-all">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${isInvited ? 'bg-emerald-50 text-emerald-600 border border-emerald-300' : 'bg-indigo-50 text-indigo-600 border border-indigo-300'}`}>
              {isInvited ? <Users className="size-3.5" /> : <Building2 className="size-3.5" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {isInvited ? 'Invited' : 'Owner'}
            </span>
          </div>
          {isInvited && userRole?.role && (
            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
              {userRole.role}
            </span>
          )}
        </div>

        <h4 className="font-bold text-gray-900 tracking-tight mb-4 truncate">{space.title}</h4>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <AvatarGroup names={extractNames(space.members)} max={3} />
          <ArrowRight className="size-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
        </div>
      </Link>
    );
  };

  return (
    <div className="lg:col-span-6 space-y-8">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tighter text-gray-900">
            Event Spaces
          </h2>
        </div>

        <Suspense fallback={<LoaderWithText text="Loading workspaces..." />}>
          <Await resolve={collaborations}>
            {([invitedSpaces, ownedSpaces]) => {
              const hasSpaces = invitedSpaces?.length > 0 || ownedSpaces?.length > 0;

              return hasSpaces ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ownedSpaces?.map((space: any) => (
                    <SpaceCard key={`owned-${space.id}`} space={space} user={user} type="owned" />
                  ))}
                  {invitedSpaces?.map((space: any) => (
                    <SpaceCard key={`invited-${space.id}`} space={space} user={user} type="invited" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PlusCircle className="size-5 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-600 mb-1">No collaborations</p>
                  <p className="text-xs text-gray-400">When invited to an event, it will appear here.</p>
                </div>
              );
            }}
          </Await>
        </Suspense>
      </section>
    </div>
  )
}
