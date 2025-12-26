export default function FormatPrice({ price, withSymbol = true }: { price: any, withSymbol?: boolean }) {
    return (
        <>
            {withSymbol && '₦'}{parseInt(price).toLocaleString()}
        </>
    )
}
