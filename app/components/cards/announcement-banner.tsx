import { Megaphone, X } from 'lucide-react'
import { useState } from 'react'

export default function AnnouncementBanner() {
    const [open, setOpen] = useState(true);

    return (
        <>
            {open && (
                <section className="bg-[#F1F2F9] py-2 relative">
                    <div className="container mx-auto font-normal md:w-max text-xs flex gap-2 items-center">
                        <Megaphone size={18} className='fill-pink-300' strokeWidth={0}/>
                        <span>Over 1.2 million ticket sales processed 🎉</span>
                    </div>

                    <X size={14} className="absolute top-2 md:right-18 right-2" onClick={() => setOpen(false)} />
                </section>
            )}
        </>
    )
}
