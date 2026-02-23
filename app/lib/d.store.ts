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
        price: 14250
    },
    PREMIUM: {
        collaborators: Infinity,
        hasEventProgram: true,
        isSavedPostEvent: true,
        isPromoted: true,
        ticketTierCount: 5,
        allowsReviews: true,
        price: 53500
    }
};

type TFeatureKey = keyof Omit<typeof TIER_LIMITS["BASIC"], "price" | "next">;

// Define the order for automatic escalation
const TIER_ORDER: (keyof typeof TIER_LIMITS)[] = ["BASIC", "STANDARD", "PREMIUM"];

// Map the Limit Key to the Actual Model Property
const FEATURE_MAP: Record<string, keyof OrganiserEvent> = {
    collaborators: 'members',
    ticketTierCount: 'tickets',
    hasEventProgram: 'eventProgram',
    allowsReviews: 'reviews',
};

export const getUpgradeTarget = (event: OrganiserEvent, featureKey: TFeatureKey) => {
    const currentTier = (event?.eventPlan?.tier?.toUpperCase() || "BASIC") as keyof typeof TIER_LIMITS;
    const limit = TIER_LIMITS[currentTier][featureKey];
    const modelKey = FEATURE_MAP[featureKey] || featureKey;

    let isLocked = false;

    // Logic A: Numeric Limits (Collaborators, Tickets)
    if (typeof limit === 'number') {
        const data = event[modelKey as keyof OrganiserEvent];
        const currentUsage = Array.isArray(data) ? data.length : 0;
        isLocked = currentUsage >= limit;
    }
    // Logic B: Boolean Permissions (Program, Reviews, Promotion)
    else if (typeof limit === 'boolean') {
        // If the limit is false, it means this tier doesn't allow the feature at all
        isLocked = limit === false;
    }

    if (isLocked) {
        const currentIndex = TIER_ORDER.indexOf(currentTier);

        // Loop through higher tiers to find the first one that unlocks this
        for (let i = currentIndex + 1; i < TIER_ORDER.length; i++) {
            const nextTierName = TIER_ORDER[i];
            const nextTierLimit = TIER_LIMITS[nextTierName][featureKey];

            // If it's a number, check if it's higher than the current limit
            if (typeof nextTierLimit === 'number' && nextTierLimit > (limit as number)) {
                return nextTierName;
            }
            // If it's a boolean, check if it's true (unlocked)
            if (typeof nextTierLimit === 'boolean' && nextTierLimit === true) {
                return nextTierName;
            }
        }
    }

    return null; // Feature is available or no higher tier unlocks it
};