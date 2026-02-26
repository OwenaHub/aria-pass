type ProcessingFeeStrategy =
    | "buyer_pays"
    | "split_fee"
    | "organiser_pays";

interface PaymentInput {
    unitPrice: number;
    quantity: number;
    commissionRate: number; // percent e.g 10
    processingFeeStrategy?: ProcessingFeeStrategy;
}

interface PaymentBreakdown {
    subtotal: number;
    paystackFee: number;
    processingFeeChargedToBuyer: number;
    commissionCharge: number;
    totalAmount: number;
}

/**
 * Calculates Paystack fee based on Nigerian pricing
 * 1.5% + ₦100 (if >= 2500)
 * Capped at ₦2000
 */
function calculatePaystackFee(amount: number): number {
    const percentageFee = amount * 0.015; // 1.5% of the amount
    const flatFee = amount >= 2500 ? 100 : 0;
    const fee = percentageFee + flatFee;

    return Math.min(Math.ceil(fee), 2000);
};

/**
 * Calculates commission amount from subtotal
 */
function calculateCommission(
    subtotal: number,
    commissionRate: number
): number {
    let commission = Math.floor((subtotal * commissionRate) / 100);
    return commission;
}

/**
 * Main calculator
 */
export function calculatePaymentBreakdown(input: PaymentInput): PaymentBreakdown {
    const {
        unitPrice,
        quantity,
        commissionRate,
        processingFeeStrategy,
    } = input;

    const subtotal = unitPrice * quantity;

    const paystackFee = calculatePaystackFee(subtotal);

    let processingFeeChargedToBuyer = 0;

    switch (processingFeeStrategy) {
        case "buyer_pays":
            processingFeeChargedToBuyer = paystackFee;
            break;

        case "split_fee":
            processingFeeChargedToBuyer = Math.ceil(paystackFee / 2);
            break;

        default:
            processingFeeChargedToBuyer = 0;
    }

    let commissionCharge = calculateCommission(
        subtotal,
        commissionRate
    );

    // Add any overcharge (safety guard)
    const leftover = processingFeeChargedToBuyer - paystackFee;
    if (leftover > 0) {
        commissionCharge += leftover;
    }

    const totalAmount = subtotal + processingFeeChargedToBuyer;

    return {
        subtotal,
        paystackFee,
        processingFeeChargedToBuyer,
        commissionCharge,
        totalAmount,
    };
}