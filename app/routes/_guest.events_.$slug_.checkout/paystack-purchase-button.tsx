import { PaystackButton } from "react-paystack"
import { useState } from 'react'
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { PAYSTACK_PUBK } from "~/config/defaults";
import client from "~/http/client";
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { ButtonGroup } from "~/components/ui/button-group"

export default function PaystackPurchaseButton({ ticket, user, organiser }: {
    ticket: Ticket,
    user?: User | undefined,
    organiser: OrganiseProfile | undefined
}) {
    const publicKey = PAYSTACK_PUBK;

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        quantity: 1,
        tickets: [
            {
                id: ticket.id,
                quantity: 1
            },
        ]
    });

    const UNIT_PRICE = parseInt(ticket.price);
    const QTY = form.quantity;

    const SUBTOTAL = UNIT_PRICE * QTY;

    const PROCESSING_FEE = Math.ceil(SUBTOTAL * 0.03); // Paystack Fees
    const COMMISSION_PERCENT = parseInt(organiser?.commissionRate || "0");

    const COMMISSION_CHARGE = Math.floor(
        (SUBTOTAL * COMMISSION_PERCENT) / 100
    );

    const TOTAL_AMOUNT = (() => {
        switch (organiser?.processingFeeStrategy) {
            case "buyer_pays":
                return SUBTOTAL + PROCESSING_FEE;
            case "split_fee":
                return SUBTOTAL + (PROCESSING_FEE / 2);
            default:
                return SUBTOTAL;
        }
    })();

    const navigate = useNavigate();

    const componentProps = {
        email: form.email,
        amount: TOTAL_AMOUNT * 100,
        subaccount: organiser?.paystackSubaccountCode,
        transaction_charge: COMMISSION_CHARGE,
        metadata: {
            custom_fields: [
                {
                    display_name: "Name",
                    variable_name: "name",
                    value: form.name,
                },
                {
                    display_name: "Phone",
                    variable_name: "phone",
                    value: form.phone,
                },
                {
                    display_name: "Quantity",
                    variable_name: "quantity",
                    value: form.quantity,
                },
            ]
        },
        publicKey,
        text: "Buy Now",

        // *  Paystack response
        // {
        //     "reference": "T116036255015831",
        //     "trans": "5088330337",
        //     "status": "success",
        //     "message": "Approved",
        //     "transaction": "5088330337",
        //     "trxref": "T116036255015831",
        //     "redirecturl": "?trxref=T116036255015831&reference=T116036255015831"
        // }

        onSuccess: async (e: any) => {
            const promise = new Promise(async (resolve, reject) => {
                try {
                    if (e.status !== "success") {
                        toast.error("Payment failed", {
                            description: "Please try again later, contact support——support@ariapass.africa"
                        });
                        throw new Error("Payment failed");
                    }

                    await client.post(`/api/tickets/purchases/${ticket.id}`, {
                        reference: e.reference,
                        //! amount: TOTAL_AMOUNT / 100, Gotten and calculated on the backend for security
                        currency: "NGN",
                        payment_method: "paystack",
                        purchaser_name: form.name,
                        purchaser_email: form.email,
                        quantity: form.quantity,
                        tickets: form.tickets,
                    });

                    resolve('Congratulations! Ticket purchased');

                    if (user && Object.keys(user).length > 2 && user.email.length > 8) {
                        return navigate(`/purchases/?reference=${e.reference}&message=${e.message}`);
                    }

                    return navigate(`/login?redirect=/purchases`);
                } catch (error: any) {
                    toast.warning('Something went wrong', {
                        description: error.response?.data?.error || "Please try again later"
                    });
                    reject(error);
                }
            });

            toast.promise(promise, {
                loading: 'Processing purchase...',
                success: (message) => message as string,
                error: 'Error occured!, contact support——support@ariapass.africa',
            });

            return;
        },
        onClose: () => {
            toast.warning('Abandoning purchase, why?', {
                description: "Email ticketmaster@ariapass.africa"
            });
        },
    }

    return (
        <div className="animated fadeIn">
            <div className="mt-0">
                <form className="mb-5">
                    <div className="bg-white rounded-lg mb-6 flex items-stretch  shadow">
                        <div className="flex-1 p-3">
                            <div className="text-xs text-primary mb-3">
                                {ticket.name} ticket @ <span className="font-bold">₦{(UNIT_PRICE).toLocaleString()}</span>
                            </div>

                            <div className="">
                                <div className="flex flex-col items- gap-2 mb-5">
                                    {/* Ticket Qunatity */}
                                    <div className="flex-1 flex items-center text-xs justify-between bg-gray-50 text-primary p-2 rounded-md">
                                        <div>
                                            <div className="text-[8px] text-gray-500 uppercase">quantity</div>
                                            <div className="font-medium tracking-tighter">
                                                {/* Covers for Paystack's fees */}
                                                {form.quantity} ticket{form.quantity > 1 && 's'}
                                            </div>
                                        </div>
                                        <div>
                                            <ButtonGroup
                                                orientation="horizontal"
                                                aria-label="Media controls"
                                                className="h-fit"
                                            >
                                                <Button
                                                    disabled={form.quantity === 1}
                                                    className="px-2 py-5 bg-white text-xs"
                                                    onClick={() => {
                                                        if (form.quantity === 1) return;
                                                        setForm((i) => (
                                                            {
                                                                ...i,
                                                                quantity: i.quantity - 1,
                                                                tickets: i.tickets.map(t => ({ ...t, quantity: t.quantity - 1 }))
                                                            }
                                                        ))
                                                    }}
                                                    type='button'
                                                    variant="outline" size="icon"
                                                >
                                                    <MinusIcon />
                                                </Button>
                                                <Button
                                                    className="px-2 py-5 bg-white text-xs"
                                                    onClick={() => {
                                                        setForm((i) => (
                                                            {
                                                                ...i,
                                                                quantity: i.quantity + 1,
                                                                tickets: i.tickets.map(t => ({ ...t, quantity: t.quantity + 1 }))
                                                            }
                                                        ))
                                                    }}
                                                    type="button"
                                                    variant="outline" size="icon"
                                                >
                                                    <PlusIcon />
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    </div>

                                    {organiser?.processingFeeStrategy !== "organiser_pays" && (
                                        <div className="flex-1 text-xs items-center bg-gray-50 text-primary p-2 rounded-md">
                                            {/* Processing Fee */}
                                            <div className="text-[8px] text-gray-500 uppercase">processing fee</div>
                                            <div className="font-medium">
                                                {/* Covers for Paystack's fees */}
                                                ₦{PROCESSING_FEE.toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="leading-2">
                                        <div className="text-[10px] uppercase font-light">Total</div>
                                        <div className='text-lg font-bold tracking-tighter'>
                                            ₦{TOTAL_AMOUNT.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1">
                            <Label className="mb-1 text-xs" htmlFor="name">Name</Label>
                            <Input
                                className="py-5 rounded-xl text-sm bg-white"
                                type="text"
                                id="name"
                                placeholder="First Last"
                                value={form.name}
                                onChange={(e) => setForm((i) => (
                                    { ...i, name: e.target.value }
                                ))}
                                disabled={Boolean(user?.id)}
                            />
                        </div>
                        <div className="flex-1">
                            <Label className="mb-1 text-xs" htmlFor="email">Email</Label>
                            <Input
                                className="py-5 rounded-xl text-sm bg-white"
                                type="text"
                                id="email"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={(e) => setForm((i) => (
                                    { ...i, email: e.target.value }
                                ))}
                                disabled={Boolean(user?.id)}
                            />
                        </div>
                    </div>

                    <Label className="mb-1 text-xs">
                        Phone <small className="text-[10px] font-light">(11 digit phone)</small>
                    </Label>
                    <Input
                        className="py-5 border border-gray-400 rounded-xl bg-white"
                        type="text"
                        id="phone"
                        placeholder="0800 000 0000"
                        maxLength={11}
                        onChange={(e) => setForm((i) => (
                            { ...i, phone: e.target.value }
                        ))}
                    />
                </form>
                <hr className="my-7" />
                <PaystackButton
                    {...componentProps}
                    disabled={form.email.length < 5 || form.phone.length < 11}
                    className="w-full py-3 uppercase rounded-xl bg-primary font-semibold text-sm text-white cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-muted-foreground transition"
                />
            </div>
        </div>
    )
}