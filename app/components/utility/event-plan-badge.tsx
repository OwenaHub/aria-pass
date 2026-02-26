import { Zap, Star, ShieldCheck } from 'lucide-react';

export default function EventPlanBadge({ tier }: { tier?: string }) {
    const normalizedTier = tier?.toUpperCase() || 'BASIC';

    const configs: Record<string, { label: string; classes: string; icon: any }> = {
        BASIC: {
            label: 'Free Tier',
            classes: 'bg-gray-100 text-gray-600 border-gray-200',
            icon: <Zap className="h-3 w-3" />
        },
        STANDARD: {
            label: 'Standard',
            classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            icon: <Star className="h-3 w-3 fill-current" />
        },
        PREMIUM: {
            label: 'Premium',
            classes: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent',
            icon: <ShieldCheck className="h-3 w-3" />
        }
    };

    const config = configs[normalizedTier] || configs.BASIC;

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold capitalize tracking-tight w-max transition-all duration-300 ${config.classes}`}>
            {config.icon}
            {config.label}
        </div>
    );
};