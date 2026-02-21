import { QrCode } from "lucide-react"
import QRCode from "react-qr-code"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"

export function DynamicQR({ qrValue }: { qrValue: string }) {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white/50 border-0 backdrop-blur-lg px-2 flex items-center gap-2">
                        <QrCode />
                        <span className='tracking-tighter font-bold text-xs'>Tap to view QR</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader className='pb-7'>
                        <DialogTitle className='tracking-tighter'>Scan QR</DialogTitle>
                        <DialogDescription className='tracking-tighter'>
                            Scan with your camera to access the event.
                        </DialogDescription>
                    </DialogHeader>

                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 250, width: "100%" }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={qrValue}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </DialogContent>
            </form>
        </Dialog >
    )
}
