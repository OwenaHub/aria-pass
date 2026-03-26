import { redirect, useSearchParams } from "react-router";
import client from "~/http/client";
import type { Route } from "../_user.account.event-staff/+types/route";
import MembersTable from "./members-table";

export async function loader() {
    try {
        const { data } = await client.get('/api/organiser/members');

        return { eventMembers: data }
    } catch ({ response }: any) {
        console.error(response);
        return redirect('/dashboard')
    }
}

export default function EventStaff({ loaderData }: Route.ComponentProps) {
    const { eventMembers }: { eventMembers: EventMember[] } = loaderData;
    
    const [searchParams] = useSearchParams();

    return (
        <div>
            <section>

                {(eventMembers && eventMembers.length) ? (
                    <MembersTable members={eventMembers} />
                ) : (
                    <div className='pt-10 flex flex-col items-start gap-5'>
                        <p className="text-light text-sm text-muted-foreground text-center">
                            {searchParams.get('status')
                                ? <span>
                                    No {searchParams.get('status')} events
                                </span>
                                : <span>
                                    No teammates added yet
                                </span>
                            }
                        </p>
                    </div>
                )}
            </section>
        </div>
    )
}
