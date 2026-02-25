import { redirect, useNavigate, useSearchParams, type MetaFunction } from "react-router";
import { defaultMeta } from "~/lib/meta";
import type { Route } from "../_user.my-events_.$slug/+types/route";
import client from "~/http/client";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { TIER_LIMITS } from "~/lib/d.store";
import { PaystackButton } from "react-paystack";
import useSession from "~/hooks/use-session";
import { PAYSTACK_PUBK } from "~/config/defaults";
import { plans } from "~/components/custom/pricing";

export const meta: MetaFunction = (args: any) => {
    if (!args.data.event) {
        return [
            { title: "AriaPass - Discover the community behind the concerts" },
        ];
    }
    const event = args.data.event;
    return [
        ...defaultMeta(args) || [],
        { title: `${event.title} upgrade | AriaPass` },
    ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    try {
        const res = await client.get(`api/organiser/events/${params.slug}`);
        const { getUser } = useSession();

        const user: User = await getUser();

        return { event: res.data, user: user }
    } catch ({ response }: any) {
        toast.warning("Something broke", {
            description: response.data.message || ""
        })
        return redirect('/my-events')
    }
}

export default function EventUpgrade({ loaderData }: Route.ComponentProps) {
    const { event, user }: { event: OrganiserEvent, user: User } | any = loaderData;

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const targetTier = searchParams.get("tier") as keyof typeof TIER_LIMITS;

    const currentTier = (event?.eventPlan?.tier?.toUpperCase() || 'BASIC') as keyof typeof TIER_LIMITS;


    const currentData = plans[currentTier];
    const targetData = plans[targetTier];

    const publicKey = PAYSTACK_PUBK;

    const componentProps = {
        email: user?.email || "",
        amount: targetData.amount * 100,
        metadata: {
            custom_fields: [
                {
                    display_name: "Name",
                    variable_name: "name",
                    value: user.name,
                },
            ]
        },
        publicKey,
        text: "Upgrade Now",

        onSuccess: async (e: any) => {
            const promise = new Promise(async (resolve, reject) => {
                try {
                    if (e.status !== "success") {
                        toast.error("Payment failed", {
                            description: "Please try again later, contact support——support@ariapass.africa"
                        });
                        throw new Error("Payment failed");
                    }

                    await client.patch(`/api/organiser/events/${event.slug}/upgrade`, {
                        reference: e.reference,
                        currency: "NGN",
                        payment_method: "paystack",
                        tier_name: targetData.name.toUpperCase(),
                        feature_snapshot: JSON.stringify(targetData.perks),
                        amount_paid: targetData.amount,
                        status: "active",
                    });

                    resolve('Congratulations! Upgrade successful');
                    return navigate(`/my-events/${event.slug}`);
                } catch (error: any) {
                    toast.warning('Something went wrong', {
                        description: error.response?.data?.error || "Please try again later"
                    });
                    reject(error);
                }
            });

            toast.promise(promise, {
                loading: 'Processing purchase...',
                success: (message) => message as string,
                error: 'Error occured!, contact support——support@ariapass.africa',
            });

            return;
        },
        onClose: () => {
            toast.warning('Abandoning purchase, why?', {
                description: "Email ticketmaster@ariapass.africa"
            });
        },
    }


    return (
        <div className="w-full max-w-5xl mx-auto py-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">

                {/* Current Plan Card */}
                <div className={`w-full max-w-sm rounded-3xl border-2 ${currentData.color} ${currentData.bg} p-8 opacity-70 grayscale-[0.5]`}>
                    <div className="flex items-center gap-3 mb-6">
                        {currentData.icon}
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Current Plan</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{currentData.name}</h2>
                    <p className="text-slate-500 text-sm mb-8 italic">Your current active setup</p>

                    <ul className="space-y-4">
                        {currentData.perks.map((perk, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-slate-300" />
                                {perk}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* The Transition Arrow */}
                <div className="flex items-center justify-center bg-indigo-100 rounded-full p-4 md:rotate-0 rotate-90 shadow-inner">
                    <ArrowRight className="h-8 w-8 text-primary-theme animate-pulse" />
                </div>

                {/* Target Plan Card */}
                <div className={`w-full max-w-sm rounded-3xl border-4 border-primary-theme bg-white p-8 shadow-2xl shadow-indigo-100 relative overflow-hidden`}>
                    {/* Highlighting Tag */}
                    <div className="absolute top-0 right-0 bg-primary-theme text-white px-4 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-tighter">
                        Recommended Upgrade
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        {targetData.icon}
                        <span className="text-sm font-bold uppercase tracking-widest text-primary-theme">New Potential</span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-1">{targetData.name}</h2>
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-black text-primary-theme">{targetData.price}</span>
                        <span className="text-slate-400 text-xs font-bold">/ event</span>
                    </div>

                    <ul className="space-y-4 mb-10">
                        {targetData.perks.map((perk, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-900 text-sm font-semibold">
                                <div className="bg-emerald-100 rounded-full p-0.5">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                </div>
                                {perk}
                            </li>
                        ))}
                    </ul>

                    <PaystackButton
                        className="w-full group relative flex items-center justify-center gap-3 bg-primary-theme hover:bg-indigo-700 text-white font-semibold tracking-tighter py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-200"
                        {...componentProps}
                    />

                    <p className="text-center mt-4 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                        Instant unlock via Paystack
                    </p>
                </div>

            </div>
        </div>
    )
}
