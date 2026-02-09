import { Link } from 'react-router'
import { Button } from '../ui/button'
import { QrCode } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import QRCode from 'react-qr-code'

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

                        <div className='flex gap-3 items-center'>
                            <QRCodeModal event={event} />
                            <div>
                                <Link to={`/events/${event.slug}/program`}>
                                    <Button className="w-full md:w-max rounded-full py-5 flex items-center gap-1 bg-white/20 cursor-pointer">
                                        <span className='tracking-tighter text-sm'>View Program</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function QRCodeModal({ event }: { event: OrganiserEvent }) {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button size={'icon'} className=" rounded-full p-5 flex items-center gap-1 bg-white/20 cursor-pointer">
                        <QrCode className='size-5' />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm pb-20 rounded-3xl">
                    <DialogHeader className='pb-7'>
                        <DialogTitle className='tracking-tighter'>Scan QR</DialogTitle>
                        <DialogDescription className='tracking-tighter'>
                            Scan with your camera to access the event program.
                        </DialogDescription>
                    </DialogHeader>

                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 250, width: "100%" }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={`https://ariapass.africa/events/${event.slug}/program`}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}
