export default function FormatPrice({ price, withSymbol = true }: { price: any, withSymbol?: boolean }) {
    return (
        <>
            {parseFloat(price) === 0
                ? (<span className='px-2 py-1 bg-gray-700 text-white font-bold font-mono uppercase text-xs rounded inline-block'>Free</span>)
                : (
                    <>
                        {withSymbol && '₦'}{parseInt(price).toLocaleString()}
                    </>
                )
            }
        </>
    )
}
