export interface Bank {
    id: number | null;
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string | null;
    pay_with_bank: boolean;
    supports_transfer: boolean;
    available_for_direct_debit: boolean;
    active: boolean;
    country: string;
    currency: string;
    type: string;
    is_deleted: boolean;
    createdAt: string; // or Date if you parse it later
    updatedAt: string;
}