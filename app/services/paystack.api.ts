import client from "~/http/client";

export async function getBankList(params?: {
    country?: string
    currency?: string
    perPage?: number
    page?: number
}) {
    const response = await client.get('/api/organiser-profile/banks', { params });
    return response.data;
}

export async function verifyAccount(params: {
    accountNumber: string
    bankCode: string
}) {
    const response = await client.post('/api/organiser-profile/resolve-account', params);
    return response.data;
}
