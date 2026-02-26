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
};

/**
 * Calculates the exact Paystack fee based on the FINAL amount passed to them
 * 1.5% + ₦100 (if final amount >= 2500)
 * Capped at ₦2000
 */
function calculatePaystackFee(amount: number): number {
    const percentageFee = amount * 0.015; // 1.5% of the amount
    const flatFee = amount >= 2500 ? 100 : 0;
    const fee = percentageFee + flatFee;

    return Math.min(Math.ceil(fee), 2000);
}

/**
 * Grosses up the target subtotal so that after Paystack takes its fee,
 * the exact target subtotal remains.
 */
function calculateGrossAmount(targetSubtotal: number): number {
    const percentage = 0.015;
    
    // First pass: what the total would be without the flat fee
    let total = targetSubtotal / (1 - percentage);
    
    // Paystack applies the ₦100 flat fee if the FINAL transaction amount is >= 2500
    if (total >= 2500) {
        total = (targetSubtotal + 100) / (1 - percentage);
    }
    
    // Paystack fee is capped at ₦2000
    if (total - targetSubtotal > 2000) {
        return targetSubtotal + 2000;
    }
    
    return Math.ceil(total);
}

/**
 * Calculates commission amount from subtotal
 */
function calculateCommission(
    subtotal: number,
    commissionRate: number
): number {
    return Math.floor((subtotal * commissionRate) / 100);
}

/**
 * Main calculator
 */
export function calculatePaymentBreakdown(input: PaymentInput): PaymentBreakdown {
    const {
        unitPrice,
        quantity,
        commissionRate,
        processingFeeStrategy = "buyer_pays", // Fallback if undefined
    } = input;

    const subtotal = unitPrice * quantity;

    let totalAmount = subtotal;
    let processingFeeChargedToBuyer = 0;

    // 1. Determine Total Amount based on the strategy FIRST
    switch (processingFeeStrategy) {
        case "buyer_pays":
            totalAmount = calculateGrossAmount(subtotal);
            processingFeeChargedToBuyer = totalAmount - subtotal;
            break;

        case "split_fee":
            // Buyer pays half of what the fee WOULD be on just the subtotal
            const estimatedFee = calculatePaystackFee(subtotal);
            processingFeeChargedToBuyer = Math.ceil(estimatedFee / 2);
            totalAmount = subtotal + processingFeeChargedToBuyer;
            break;

        case "organiser_pays":
        default:
            totalAmount = subtotal;
            processingFeeChargedToBuyer = 0;
            break;
    }

    // 2. Calculate the ACTUAL Paystack fee based on the final total Amount
    const paystackFee = calculatePaystackFee(totalAmount);

    // 3. Calculate your platform commission based on the subtotal
    let commissionCharge = calculateCommission(
        subtotal,
        commissionRate
    );

    // 4. Add any overcharge (safety guard)
    const leftover = processingFeeChargedToBuyer - paystackFee;
    if (leftover > 0) {
        commissionCharge += leftover;
    }

    return {
        subtotal,
        paystackFee,
        processingFeeChargedToBuyer,
        commissionCharge,
        totalAmount,
    };
}