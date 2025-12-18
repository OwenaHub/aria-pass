export default function HrWithText({ text = "Or" }: { text?: string }) {
    return (
        <div className="flex items-center py-5 mt-3">
            <div className="flex-1 border-t border-gray-300" />
            <div className="text-gray-700 text-sm tracking-tighter font-medium mx-4">{text}</div>
            <div className="flex-1 border-t border-gray-300" />
        </div>
    )
}
