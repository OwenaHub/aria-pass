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
 * Helper function to securely round to exact Kobo (2 decimal places)
 * This prevents floating-point bugs (e.g., 15.0000000001)
 */
function roundToTwoDecimals(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates the exact Paystack fee based on the FINAL amount
 * Paystack strictly takes 1.5% + ₦100 (if final amount >= 2500)
 * Capped at ₦2000
 */
function calculatePaystackFee(amount: number): number {
    const percentageFee = amount * 0.015; // Paystack's 1.5%
    const flatFee = amount >= 2500 ? 100 : 0;
    const fee = percentageFee + flatFee;

    return Math.min(roundToTwoDecimals(fee), 2000);
}

/**
 * Grosses up the target subtotal using purely Paystack's 1.5% rate.
 * Ensures the final amount leaves exactly the target subtotal after Paystack's cut.
 */
function calculateGrossAmount(targetSubtotal: number): number {
    const platformPercentage = 0.015;

    // First pass: what the total would be without the flat fee
    let total = targetSubtotal / (1 - platformPercentage);

    // Apply the ₦100 flat fee if the FINAL transaction amount is >= 2500
    if (total >= 2500) {
        total = (targetSubtotal + 100) / (1 - platformPercentage);
    }

    // CAP RESTORED: Stop charging the buyer extra if the fee exceeds ₦2000.
    if (total - targetSubtotal > 2000) {
        return targetSubtotal + 2000;
    }

    return roundToTwoDecimals(total);
}

function calculateCommission(
    subtotal: number,
    commissionRate: number
): number {
    return roundToTwoDecimals((subtotal * commissionRate) / 100);
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

    switch (processingFeeStrategy) {
        case "buyer_pays":
            totalAmount = calculateGrossAmount(subtotal);
            processingFeeChargedToBuyer = roundToTwoDecimals(totalAmount - subtotal);
            break;

        case "split_fee":
            // Calculate the exact Paystack fee, then charge the buyer exactly half
            const estimatedGross = calculateGrossAmount(subtotal);
            const estimatedFee = estimatedGross - subtotal;
            processingFeeChargedToBuyer = roundToTwoDecimals(estimatedFee / 2);
            totalAmount = roundToTwoDecimals(subtotal + processingFeeChargedToBuyer);
            break;

        case "organiser_pays":
        default:
            totalAmount = subtotal;
            processingFeeChargedToBuyer = 0;
            break;
    }

    // 2. Calculate the ACTUAL Paystack fee based on the final total Amount
    const paystackFee = calculatePaystackFee(totalAmount);

    // 3. Calculate your standard platform commission based on the subtotal
    let commissionCharge = calculateCommission(
        subtotal,
        commissionRate
    );

    // 4. Sweeper Logic: Guard against fractions of a Kobo mismatch
    // Since we perfectly match Paystack now, this 'leftover' will almost always be 0.
    const leftover = roundToTwoDecimals(processingFeeChargedToBuyer - paystackFee);
    if (leftover > 0) {
        commissionCharge = roundToTwoDecimals(commissionCharge + leftover);
    }

    return {
        subtotal,
        paystackFee,
        processingFeeChargedToBuyer,
        commissionCharge,
        totalAmount,
    };
}