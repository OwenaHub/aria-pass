import { X } from 'lucide-react'
import { useState } from 'react'

export default function AnnouncementBanner() {
    const [open, setOpen] = useState(true);

    if (!open) return null;

    return (
        <>
            <section className="bg-gray-100 py-1 relative overflow-hidden border-b border-gray-200">
                <div className="flex whitespace-nowrap animate-marquee">
                    {/* First Set */}
                    <div className="flex gap-4 items-center px-2">
                        <div className="flex gap-2 items-center text-xs text-primary font-medium">
                            <span>🎉</span>
                            <span>Create digital programs</span>
                        </div>
                        <div className="flex gap-2 items-center text-xs text-primary font-medium">
                            <span>🤑</span>
                            <span>Sell with 0% commission by becoming a partner</span>
                        </div>
                        <div className="flex gap-2 items-center text-xs text-primary font-medium">
                            <span>👀</span>
                            <span>As your fans to add anonymous reviews to your event</span>
                        </div>
                        <div className="flex gap-2 items-center text-xs text-primary font-medium">
                            <span>🤑</span>
                            <span>Sell with 0% commission by becoming a partner</span>
                        </div>
                    </div>

                    {/* Second Set */}
                    <div className="flex gap-4 items-center px-2">
                        <div className="flex gap-2 items-center text-xs text-primary font-medium">
                            <span>🎉</span>
                            <span>Create digital programs</span>
                        </div>
                        <div className="flex gap-2 items-center text-xs text-primary font-medium">
                            <span>🤑</span>
                            <span>Sell with 0% commission by becoming a partner</span>
                        </div>
                        <div className="flex gap-2 items-center text-xs text-primary font-medium">
                            <span>👀</span>
                            <span>As your fans to add anonymous reviews to your event</span>
                        </div>
                        <div className="flex gap-2 items-center text-xs text-primary font-medium">
                            <span>🤑</span>
                            <span>Sell with 0% commission by becoming a partner</span>
                        </div>
                    </div>
                </div>

                {/* Close Button - Placed on a solid background to remain visible */}
                <div className="absolute right-0 top-0 h-full flex items-center bg-gray-100 px-3 shadow-[-10px_0_15px_rgba(224,231,255,0.8)]">
                    <X
                        size={14}
                        className="cursor-pointer hover:text-gray-600 transition-colors"
                        onClick={() => setOpen(false)}
                    />
                </div>
            </section>
        </>
    )
}