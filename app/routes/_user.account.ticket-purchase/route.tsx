import { redirect, useSearchParams } from "react-router";
import client from "~/http/client";
import type { Route } from "../_user.account.ticket-purchase/+types/route";
import FormatPrice from "~/components/utility/format-price";
import PurchaseStatus from "~/components/utility/purchase-status";

export async function loader() {
    try {
        const { data } = await client.get('/api/tickets/purchases');

        return { tickets: data }
    } catch ({ response }: any) {
        console.error(response);
        return redirect('/dashboard')
    }
}

export default function TicketPurchase({ loaderData }: Route.ComponentProps) {
    const { tickets }: { tickets: TicketPurchase[] } = loaderData;

    const [searchParams] = useSearchParams();

    return (
        <div>
            <section>
                {(tickets && tickets.length) ? (
                    <div className="grid grid-cols-1 gap-3 items-stretch justify-start">
                        {tickets.map((purchase) => (
                            <div className='p-4 rounded-lg bg-gray-50' key={purchase.id}>
                                <small>{purchase.ticket.name}</small>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="font-bold">
                                        <FormatPrice price={purchase.ticket.price} />
                                    </div>
                                    <PurchaseStatus status={purchase.status} />
                                </div>
                                <div className="font-mono text-xs">
                                    {purchase.code}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='pt-10 flex flex-col items-start gap-5'>
                        <p className="text-light text-sm text-muted-foreground text-center">
                            {searchParams.get('status')
                                ? <span>
                                    No {searchParams.get('status')} events
                                </span>
                                : <span>
                                    No purchases yet
                                </span>
                            }
                        </p>
                    </div>
                )}
            </section>
        </div>
    )
}
