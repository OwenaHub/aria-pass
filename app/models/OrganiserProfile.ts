interface OrganiseProfile extends Model {
    bio: string;
    contactEmail: null | string
    contactPhone: null | string
    organiserName: null | string
    websiteUrl: null | string
    user: string
    status: 'active' | 'suspended' | 'pending' | 'draft'

    paystackSubaccountCode?: string;
    bankCode?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    commissionRate: number;
}