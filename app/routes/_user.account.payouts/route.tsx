import { Check, ChevronDown, Info, Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { Form, useOutletContext, useNavigation } from 'react-router';

import { Button } from "~/components/ui/button"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from "~/components/ui/combobox";
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { getBankList, verifyAccount } from '~/services/paystack.api';
import type { Bank } from '~/types/Bank';
import type { VerifiedAccount } from '~/types/VerifiedAccount';
import type { Route } from '../_user.account.payouts/+types/route';
import { parseForm } from '~/lib/utils';
import useSession from '~/hooks/use-session';
import formRequest from '~/http/form.request';
import DefaultButton from '~/components/buttons/default-button';
import { toast } from 'sonner';

const defaultBank = {
    id: null,
    name: "Test bank",
    slug: "test-bank",
    code: "001",
    longcode: "",
    gateway: null,
    pay_with_bank: false,
    supports_transfer: true,
    available_for_direct_debit: false,
    active: false,
    country: "",
    currency: "",
    type: "",
    is_deleted: false,
    createdAt: "",
    updatedAt: ""
};

export async function clientLoader() {
    const { getUser } = useSession();
    const user = await getUser();

    try {
        if (user.organiserProfile?.paystackSubaccountCode)
            return { banks: [defaultBank] };

        const response = await getBankList({ country: 'nigeria' });
        return { banks: response.data || [defaultBank] };
    } catch (error) {
        console.error("Failed to fetch banks", error);
        return { banks: [defaultBank] };
    }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
    const { validateSession } = useSession();
    let credentials = await parseForm(request);

    try {
        const response = await formRequest(credentials, 'organiser-profile/setup-payout', 'POST');

        if (!response?.success) {
            toast.error("Failed to setup payout", {
                description: response?.data?.message || "Unable to setup payout"
            });
            throw new Error(response?.data?.message || "Unable to setup payout");
        }

        toast.success("Payout setup completed", {
            description: response?.message || response?.data?.message || "Your payout account is ready."
        });

        await validateSession();
        return null;

    } catch (error: any) {
        console.error("Error creating payout:", error);
        toast.error("Failed to setup payout", {
            description:
                error?.response?.data?.message ||
                error?.message ||
                "Please verify your bank details and try again."
        });
        return null;
    }
}

export default function Payouts({ loaderData }: Route.ComponentProps) {
    const { banks } = loaderData;

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    // 4. Verification loading state using React 19 transition
    const [isVerifying, startTransition] = useTransition();

    // The only state we still need is for user input/interactions
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [verifiedAccount, setVerifiedAccount] = useState<VerifiedAccount | undefined>();

    const user: User = useOutletContext();

    useEffect(() => {
        if (accountNumber.length === 10 && selectedBank) {
            startTransition(async () => {
                try {
                    const data = await verifyAccount({
                        accountNumber,
                        bankCode: selectedBank.code
                    });
                    setVerifiedAccount(data.data);
                } catch (error: any) {
                    toast.error("Account verification failed", {
                        description: error?.response?.data?.message || error?.message || "Something went wrong."
                    });
                    console.error("Verification failed", error);
                    setVerifiedAccount(undefined);
                }
            });
        } else {
            setVerifiedAccount(undefined);
        }
    }, [accountNumber, selectedBank]);

    return (
        <>
            {user.organiserProfile?.paystackSubaccountCode ? (
                <div>
                    <div className='mb-4'>
                        <h2 className='font-bold tracking-tighter text-sm'>
                            Your Payout Account
                        </h2>
                        <p className='text-xs'>
                            Reach out to <span className='text-blue-500'>hello@ariapass.africa</span> to change this account
                        </p>
                    </div>

                    <div className='bg-slate-50 mt-6 px-4 py-6 rounded-lg border flex flex-col md:flex-row md:items-start gap-6'>
                        <div className='flex flex-col gap-1'>
                            <Label className='text-sm font-semibold'>Bank Name</Label>
                            <p className='text-sm'>
                                {user.organiserProfile?.bankName || "N/A"}
                            </p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label className='text-sm font-semibold'>Account Number</Label>
                            <p className='text-sm'>
                                {user.organiserProfile?.accountNumber || "N/A"}
                            </p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label className='text-sm font-semibold'>Account Name</Label>
                            <p className='text-sm'>
                                {user.organiserProfile?.accountName || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className='mt-4 text-xs tracking-tighter text-gray-600'>
                        You pay <span className='font-bold tracking-tight'>{user.organiserProfile.commissionRate}%</span> from your earnings
                    </div>
                </div>
            ) : (
                <Form method="post">
                    <div className="bg-slate-0 rounded-lg gap-3 p-3 flex items-start">
                        <Info size={18} className='mt-1' />
                        <div className='text-primary'>
                            <h2 className='font-bold tracking-tighter text-sm'>
                                Add Account
                            </h2>
                            <p className='text-xs'>
                                Add a Nigerian bank account to receive payouts.
                            </p>
                        </div>
                    </div>

                    <div className='bg-slate-50 mt-6 px-4 py-6 rounded-lg border flex flex-col md:flex-row md:items-start gap-6'>
                        <div className='flex flex-col gap-1'>
                            <Label className='text-sm font-medium'>Select Bank</Label>
                            <Combobox
                                items={banks}
                                onValueChange={(value: Bank | null) => {
                                    setSelectedBank(value);
                                }}
                            >
                                <ComboboxTrigger
                                    render={
                                        <Button variant="outline" className="w-full md:w-74 rounded-lg py-5 justify-between font-normal">
                                            {selectedBank ? selectedBank.name : "Select a bank..."}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    }
                                />

                                <ComboboxContent>
                                    <ComboboxInput showTrigger={false} placeholder="Search" />
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem
                                                key={item.id}
                                                value={item}
                                            >
                                                {item.name}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>

                            {/* Hidden inputs for form submission */}
                            <input type="hidden" name="settlement_bank" value={selectedBank?.code || ""} />
                            <input type="hidden" name="business_name" value={user?.organiserProfile?.organiserName || ""} />
                            <input type="hidden" name="percentage_charge" value={0} />
                            <input type="hidden" name="bank_name" value={selectedBank?.name || ""} />
                            <input type="hidden" name="account_name" value={verifiedAccount?.account_name || ""} />
                        </div>

                        {/* Account Number */}
                        <div className='flex flex-col gap-1'>
                            <Label className='text-sm font-medium'>Account Number</Label>
                            <Input
                                name='account_number'
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="Account Number"
                                maxLength={10}
                                minLength={10}
                                className='py-5 rounded-md w-full md:w-74 bg-white text-sm'
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    const remaining = 10 - input.value.length;
                                    const counter = document.getElementById("account-number-counter");
                                    if (counter) counter.textContent = `${remaining} characters left`;
                                }}
                            />
                            <div id="account-number-counter" className="ms-2 text-sm text-gray-500 mt-1">
                                10 characters left
                            </div>
                        </div>

                        {/* Verification Loading State Area */}
                        <div className='md:self-center'>
                            {isVerifying && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <p className="text-sm font-medium">Verifying...</p>
                                </div>
                            )}

                            {!isVerifying && verifiedAccount && (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm tracking-tight font-medium">
                                        {verifiedAccount.account_name}
                                    </p>
                                    <Check className='text-green-500' strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button Loading State */}
                    <div className='max-w-md mt-8 mx-auto'>
                        {(isVerifying || verifiedAccount) && (
                            <DefaultButton
                                text={isSubmitting ? 'Submitting...' : 'Submit account'}
                                allowed={!!accountNumber && !!selectedBank && !isSubmitting && !!verifiedAccount}
                            />
                        )}
                    </div>
                </Form>
            )}
        </>
    )
}