export const eventCategory = [
    "Opera",
    "Recital",
    "Workshop",
    "Carol",
    "Concert",
];

export const nigerianStates = [
    'abia',
    'abuja',
    'adamawa',
    'akwa ibom',
    'anambra',
    'bauchi',
    'bayelsa',
    'benue',
    'borno',
    'cross river',
    'delta',
    'ebonyi',
    'edo',
    'ekiti',
    'enugu',
    'gombe',
    'imo',
    'jigawa',
    'kaduna',
    'kano',
    'katsina',
    'kebbi',
    'kogi',
    'kwara',
    'lagos',
    'nasarawa',
    'niger',
    'ogun',
    'ondo',
    'osun',
    'oyo',
    'plateau',
    'rivers',
    'sokoto',
    'taraba',
    'yobe',
    'zamfara'
];

export const TIER_LIMITS = {
    BASIC: {
        collaborators: 1,
        hasEventProgram: false,
        isSavedPostEvent: false,
        isPromoted: false,
        ticketTierCount: 1,
        allowsReviews: false,
        price: 0
    },
    STANDARD: {
        collaborators: 5,
        hasEventProgram: true,
        isSavedPostEvent: true,
        isPromoted: true,
        ticketTierCount: 3,
        allowsReviews: true,
        price: 9700
    },
    PREMIUM: {
        collaborators: Infinity,
        hasEventProgram: true,
        isSavedPostEvent: true,
        isPromoted: true,
        ticketTierCount: 5,
        allowsReviews: true,
        price: 21500
    }
};

type TFeatureKey = keyof Omit<typeof TIER_LIMITS["BASIC"], "price" | "next">;

// Defined order for automatic escalation
const TIER_ORDER: (keyof typeof TIER_LIMITS)[] = ["BASIC", "STANDARD", "PREMIUM"];

// Map the Limit Key to the Actual Model Property
const FEATURE_MAP: Record<string, keyof OrganiserEvent> = {
    collaborators: 'members',
    ticketTierCount: 'tickets',
    hasEventProgram: 'eventProgram',
    allowsReviews: 'reviews',
};

export const getUpgradeTarget = (event: OrganiserEvent | null | undefined, featureKey: TFeatureKey) => {
    if (!event) return null;

    // 2. Defensive Tier Check
    const currentTier = (event?.eventPlan?.tier?.toUpperCase() || "BASIC") as keyof typeof TIER_LIMITS;

    // Ensure the tier exists in our TIER_LIMITS constant to prevent "limit is undefined"
    const tierConfig = TIER_LIMITS[currentTier];
    if (!tierConfig) return null;

    const limit = tierConfig[featureKey];
    const modelKey = FEATURE_MAP[featureKey] || featureKey;

    let isLocked = false;

    // Logic A: Numeric Limits
    if (typeof limit === 'number') {
        // Use type assertion safely and check for existence
        const data = (event as any)[modelKey];

        // If data is null/undefined, usage is 0. If it's an array, get length. 
        // If it's a number (like views), use the number itself.
        const currentUsage = Array.isArray(data)
            ? data.length
            : (typeof data === 'number' ? data : 0);

        isLocked = currentUsage >= limit;
    }
    // Logic B: Boolean Permissions
    else if (typeof limit === 'boolean') {
        isLocked = limit === false;
    }

    // ... (rest of your tier-looping logic remains the same)
    if (isLocked) {
        const currentIndex = TIER_ORDER.indexOf(currentTier);

        for (let i = currentIndex + 1; i < TIER_ORDER.length; i++) {
            const nextTierName = TIER_ORDER[i];
            const nextTierLimit = TIER_LIMITS[nextTierName][featureKey];

            if (typeof nextTierLimit === 'number' && nextTierLimit > (limit as number)) {
                return nextTierName;
            }
            if (typeof nextTierLimit === 'boolean' && nextTierLimit === true) {
                return nextTierName;
            }
        }
    }

    return null;
};