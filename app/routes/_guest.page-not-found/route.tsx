import { ChevronRight, Ticket } from "lucide-react";
import type { MetaFunction } from "react-router";
import { defaultMeta } from "~/lib/meta";

export const meta: MetaFunction = (args) => {
    return [
        ...defaultMeta(args) || [],
        { title: "Page Not Found | AriaPass" },
    ];
}


export default function PageNotFound() {
    return (
        <div className='container'>
            <div className="flex items-center gap-18 max-w-3xl mx-auto my-20">
                <div className="hidden md:block text-primary-bg">
                    <Ticket strokeWidth={0.5} className="size-80 -rotate-[45deg]" />
                </div>
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl text-primary-theme font-bold tracking-tighter">
                        404.
                    </h1>
                    <p className="text-sm text-gray-600 font-light">
                        We couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="mt-6 text-right">
                        <a href="/" className="inline-flex items-center text-sm tracking-tighter text-primary-theme hover:underline font-medium">
                            All Events
                            <ChevronRight className="size-4 ml-1" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
