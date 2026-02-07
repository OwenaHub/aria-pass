import { Link } from 'react-router'
import { Button } from '../ui/button'

export default function ViewEventProgram({ event }: { event: OrganiserEvent }) {
    return (
        <div className="h-100">
            <div
                className="h-full w-full rounded-3xl py-6 px-4 flex flex-col justify-center"
                style={{
                    backgroundImage: `linear-gradient(360deg, #625DF5ee, #625DF5aa), url('/images/logos/alt_logo.png')`,
                    backgroundSize: 'cover, 190%',
                    backgroundPosition: 'center, 80% center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="h-full flex flex-col justify-between">
                    <div />
                    <div>
                        <div className='text-white'>
                            <small></small>
                            <h2 className="text-4xl font-extrabold tracking-tighter mb-4">
                                Event Program
                            </h2>
                            <p className="text-base tracking-tighter mb-10">
                                Free and sharable digital event program, see what is happening
                            </p>
                        </div>

                        <Link to={`/events/${event.slug}/program`}>
                            <Button className="w-full md:w-max rounded-full py-5 flex items-center gap-1 bg-white/20 cursor-pointer">
                                <span className='tracking-tighter text-sm'>View Program</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
