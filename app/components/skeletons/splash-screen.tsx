import { LoaderCircle } from 'lucide-react';

export default function SplashScreen() {
    return (
        <div className='p-5 h-screen mx-auto flex flex-col items-center justify-center bg-white animated fadeIn relative'>
            <div className="flex flex-col gap-3 mb-7 items-center">
                <div className="text-center leading-3 flex flex-col gap-5 items-center">
                    <LoaderCircle size={28} strokeWidth={1} className='animate-spin h-5 w-5 text-primary' />

                    <p className='text-md font-semibold tracking-tighter animate-pulse'>
                        AriaPass
                    </p>
                </div>
            </div>
        </div>
    );
}
