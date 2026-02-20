import dayjs from 'dayjs';
import { Eye, Heart, MapPin } from 'lucide-react'
import Placeholder from '~/components/utility/placeholder'

export default function PreviewCard({ event, bannerImage }: { event?: any, bannerImage: any }) {
    const formattedDate = dayjs(event.date).format('MMM DD').toUpperCase();

    return (
        <div className="grid bo grid-cols-2 gap-3 md:gap-4 pb-5">
            <div className="bg-white border-gray-100 flex flex-col gap-1 group">
                <div className="relative bg-gray-100 rounded-lg w-full aspect-video h-70 overflow-hidden">
                    {bannerImage && (
                        <img
                            src={bannerImage}
                            alt={event.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    )}

                    {/* Overlay background */}
                    <div className='absolute top-0 left-0 w-full min-h-full bg-linear-to-t from-black/70 to-black/30' />

                    {/* Upperside of the card */}
                    <div className="absolute flex items-center justify-between top-2 w-[97%] left-2 py-0.5 px-1">
                        <div className='bg-white top-2 left-2 w-max py-0.5 px-2 rounded-md'>
                            <div className='flex flex-col justify-start items-center '>
                                <p className="text-xl font-bold">{formattedDate.split(' ')[1]}</p>
                                <p className="-mt-1.5 tracking-tighter text-xs font-light uppercase">{formattedDate.split(' ')[0]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Added top-0 and left-0 to position the overlay */}
                    <div className='absolute bottom-0 left-0 w-full text-white p-2'>
                        <div className="flex items-center gap-1">
                            <MapPin strokeWidth={1.5} size={14} />
                            <span className='font-light text-xs capitalize'>
                                {event.city || <Placeholder text='City' />}, {" "}
                                {event.country || <Placeholder text='Country' />}
                            </span>
                        </div>

                        <div className="text-base font-bold tracking-tighter mb-1">{event.title || <Placeholder text='Event title' />}</div>
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <div className="flex items-center text-xs">
                        <span className='border-s border-b border-gray-400 md:inline-block font-bold tracking-tight bg-gray-200 text-gray-600 uppercase px-1.5 py-1 rounded text-[9px] mx-1'>                            {event.event_type || <Placeholder text='event type' />}
                        </span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <div className="flex items-center gap-1 text-xs">
                            <Heart className='size-4 fill-gray-400 text-gray-400' />
                            <span className='text-gray-700'>{0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <Eye className='size-4 text-gray-400' />
                            <span className='text-gray-700'>{0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SOME OTHER EVENT */}

            <div className="bg-white border-gray-100 flex flex-col gap-1 group">
                <div className="relative bg-gray-100 rounded-lg w-full aspect-video h-70 overflow-hidden">
                    <img
                        src={'/images/banners/app_banner.png'}
                        alt={'some other event'}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                    {/* Overlay background */}
                    <div className='absolute top-0 left-0 w-full min-h-full bg-gradient-to-t from-black/70 to-black/30' />

                    {/* Upperside of the card */}
                    <div className="absolute flex items-center justify-between top-2 w-[97%] left-2 py-0.5 px-1">
                        <div className='bg-white top-2 left-2 w-max py-0.5 px-2 rounded-md'>
                            <div className='flex flex-col justify-start items-center '>
                                <p className="text-xl font-bold">25</p>
                                <p className="-mt-1.5 tracking-tighter text-xs font-light uppercase">
                                   DEC
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Added top-0 and left-0 to position the overlay */}
                    <div className='absolute bottom-0 left-0 w-full text-white p-2'>
                        <div className="flex items-center gap-1">
                            <MapPin strokeWidth={1.5} size={14} />
                            <span className='font-light text-xs capitalize'>
                                <Placeholder text='City' />, {" "}
                                <Placeholder text='Country' />
                            </span>
                        </div>

                        <div className="text-base font-bold tracking-tighter mb-1">
                            <Placeholder text='Some other event' />
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-between px-1'>
                    <div className="flex items-center text-xs">
                        <span className='border-s border-b border-gray-400 md:inline-block font-bold tracking-tight bg-gray-200 text-gray-600 uppercase px-1.5 py-1 rounded text-[9px] mx-1'>
                            <Placeholder text='event type' />
                        </span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <div className="flex items-center gap-1 text-xs">
                            <Heart className='size-4 fill-gray-400 text-gray-400' />
                            <span className='text-gray-700'>{18}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <Eye className='size-4 text-gray-400' />
                            <span className='text-gray-700'>{34}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
