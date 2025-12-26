export default function EventCardSkeleton({ listSize = 8 }: { listSize?: number }) {
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-5 sm:grid-cols-3 xl:gap-x-6 mb-5 animated fadeIn">
            {Array.from({ length: listSize }).map((_, index) => (
                <div key={index} className="h-[18rem] md:h-[20rem] bg-gray-100 animate-pulse rounded-lg" />
            ))}
        </div>
    )
}