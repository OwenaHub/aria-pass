interface EventPlan extends Model {
    tier: 'BASIC' | 'PREMIUM' | 'STANDARD';
    amount: string;
    status: 'active' | 'pending' | 'expired';
    features: string;
}