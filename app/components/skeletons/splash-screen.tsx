import { LoaderCircle } from 'lucide-react';

export default function SplashScreen() {
    return (
        <div className='p-5 h-screen mx-auto flex flex-col items-center justify-center bg-white animated fadeIn relative'>
            <div className="flex flex-col gap-3 mb-7 items-center">
                <div className="text-center leading-3 flex flex-col gap-8 items-center">
                    <img src="/images/logos/app_logo.png" alt="AriaPass" className="h-12 w-12 object-contain" />

                    <LoaderCircle strokeWidth={1} className='animate-spin h-8 w-8 text-primary' />
                </div>
            </div>
        </div>
    );
}
