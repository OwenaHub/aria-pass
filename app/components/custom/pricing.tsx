import { ShieldCheck, Star, Zap } from "lucide-react";
import { TIER_LIMITS } from "~/lib/d.store";

export const plans = {
    BASIC: {
        name: "Basic",
        icon: <Zap className="h-6 w-6 text-slate-400" />,
        color: "border-slate-200",
        bg: "bg-slate-50",
        price: "₦0",
        amount: TIER_LIMITS.BASIC.price,
        perks: ["1 Collaborator", "1 Ticket Tier", "24/7 Support"]
    },
    STANDARD: {
        name: "Standard",
        icon: <Star className="h-6 w-6 text-amber-500" />,
        color: "border-indigo-200",
        bg: "bg-white",
        price: `₦${TIER_LIMITS.STANDARD.price.toLocaleString()}`,
        amount: TIER_LIMITS.STANDARD.price,
        perks: ["5 Collaborators", "Digital Program", "3 Ticket Tiers", "Event Reviews"]
    },
    PREMIUM: {
        name: "Premium",
        icon: <ShieldCheck className="h-6 w-6 text-primary-theme" />,
        color: "border-indigo-500",
        bg: "bg-white",
        price: `₦${TIER_LIMITS.PREMIUM.price.toLocaleString()}`,
        amount: TIER_LIMITS.PREMIUM.price,
        perks: ["Unlimited Collabs", "Digital Program", "5 Ticket Tiers", "Social Promotion", "Priority Support"]
    }
};