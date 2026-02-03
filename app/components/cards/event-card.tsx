import { Eye, Heart, MapPin } from 'lucide-react';
import dayjs from 'dayjs';
import { STORAGE_URL } from '~/config/defaults';
import { Link } from 'react-router';
import { isPastEventDate } from '~/lib/utils';


export default function EventCard({ event, index }: { event: OrganiserEvent, index?: number }) {
    const formattedDate = dayjs(event.date).format('MMM DD').toUpperCase();

    return (
        <div key={index} className="bg-white border-gray-100 flex flex-col gap-1 group">
            {/* event banner */}
            <div className="relative bg-gray-100 rounded-xl group-hover:opacity-85 overflow-hidden transition h-90">
                <Link to={`/events/${event.slug}`}>
                    <span aria-hidden="true" className="z-10 absolute inset-0" />
                </Link>

                {event.bannerUrl && (
                    <img
                        src={event.bannerUrl && `${STORAGE_URL}/${event.bannerUrl}`}
                        alt={event.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                )}

                {/* Overlay background */}
                <div className='absolute top-0 left-0 w-full min-h-full bg-linear-to-t from-black/60 to-black/20' />

                {/* Upperside of the card */}
                <div className="absolute flex items-start justify-between top-2 w-full left-0 right-0 py-0.5 px-2.5">
                    <div className='bg-white w-max py-0.5 px-2 rounded-md'>
                        <div className='flex flex-col justify-start items-center'>
                            <p className="text-xl md:text-2xl tracking-tighter font-extrabold">{formattedDate.split(' ')[1]}</p>
                            <p className="-mt-1.5 tracking-tighter text-sm md:text-base font-light uppercase">{formattedDate.split(' ')[0]}</p>
                        </div>
                    </div>
                    {/* <div className='z-10'>
                        <RedirectOrFetcher route={`/events/toggle-like/${event.slug}`}>
                            <button title="Add to favourites" className='bg-white/70 w-max py-4 px-2 rounded hover:scale-110  hover:bg-white transition'>
                                <Bookmark
                                    className={`${event.liked && 'text-destructive fill-current size-'}`}
                                    strokeWidth={1.5}
                                />
                            </button>
                        </RedirectOrFetcher>
                    </div> */}
                </div>

                {/* Added top-0 and left-0 to position the overlay */}
                <div className='absolute bottom-0 left-0 w-full text-white p-2'>
                    {event.status === 'completed' && (
                        <div className='bg-gray-800 font-bold text-white text-xs px-3 py-3 rounded-md w-max mb-1'>
                            {isPastEventDate(event.date, event.startTime) ? 'EVENT ENDED' : 'SOLD OUT'}
                        </div>
                    )}
                    <div className="flex items-center gap-1 mb-2">
                        <MapPin strokeWidth={3} size={14} />
                        <span className='text-xs md:text-sm capitalize'>
                            {event.city}, {event.country}
                        </span>
                    </div>

                    <div className="text-sm md:text-xl font-semibold leading-4 tracking-tighter mb-1 truncate max-w-full">
                        {event.title}
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-between px-1 py-1 w-full max-w-full overflow-hidden'>
                <div className="flex items-center text-xs min-w-0">
                    {/* <span className='font-medium text-xs tracking-tight text-nowrap truncate max-w-32'>
                        {event.organiser.organiserName}
                    </span> */}
                    {/* <span title='Verified Partner' className='ms-'>
                        <Verified className='text-white fill-amber-500 size-4' />
                    </span> */}
                    <span className='border-s border-b border-gray-400 md:inline-block font-bold tracking-tight bg-gray-200 text-gray-600 uppercase px-1.5 py-1 rounded text-[9px] mx-1'>
                        {event.eventType}
                    </span>
                </div>

                <div className='flex items-center gap-3 shrink-0'>
                    <div className="flex items-center gap-0.5 text-xs font-semibold">
                        <Heart className='size-5 fill-gray-400 text-gray-400' />
                        <span className='text-gray-700'>{event.likes}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs font-semibold">
                        <Eye className='size-5 text-gray-400' />
                        <span className='text-gray-700'>{event.views}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}