import { PackageOpen } from "lucide-react";

export default function EmptyState({ resource = "Content" }: { resource?: string }) {
    return (
        <div className="animated fadeIn col-span-5 flex flex-col gap-4 items-center justify-center text-center py-10 px-4">
            <div >
                <PackageOpen className="mb-4 h-30 w-30 text-gray-400" strokeWidth={0.5} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tighter">No {resource} available</h2>
            <p className="text-gray-500 mb-4 text-sm">
                It seems like there's nothing here yet.
            </p>
        </div>
    );
}