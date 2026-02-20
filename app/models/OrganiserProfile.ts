interface OrganiseProfile extends Model {
    bio: string;
    contactEmail: null | string
    contactPhone: null | string
    organiserName: null | string
    websiteUrl: null | string
    user: string
    status: 'active' | 'suspended' | 'pending';

    paystackSubaccountCode?: string;
    bankCode?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    commissionRate: string;
    processingFeeStrategy: 'buyer_pays' | 'organiser_pays' | 'split_fee';
}