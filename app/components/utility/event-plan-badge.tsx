import { Zap, Star, ShieldCheck } from 'lucide-react';

export default function EventPlanBadge({ tier }: { tier?: string }) {
    const normalizedTier = tier?.toUpperCase() || 'BASIC';

    const configs: Record<string, { label: string; classes: string; icon: any }> = {
        BASIC: {
            label: 'Free Tier',
            classes: 'bg-slate-100 text-slate-600 border-slate-200',
            icon: <Zap className="h-3 w-3" />
        },
        STANDARD: {
            label: 'Standard',
            classes: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm shadow-indigo-100',
            icon: <Star className="h-3 w-3 fill-current" />
        },
        PREMIUM: {
            label: 'Premium',
            classes: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-md shadow-indigo-200',
            icon: <ShieldCheck className="h-3 w-3" />
        }
    };

    const config = configs[normalizedTier] || configs.BASIC;

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-tight w-max transition-all duration-300 ${config.classes}`}>
            {config.icon}
            {config.label}
        </div>
    );
};