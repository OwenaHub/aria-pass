import { LoaderCircle } from 'lucide-react';

export default function SplashScreen() {
    return (
        <div className='p-5 h-screen mx-auto flex flex-col items-center justify-center bg-white animated fadeIn relative'>
            <div className="flex flex-col gap-3 mb-7 items-center">
                <div className="text-center leading-3 flex flex-col gap-8 items-center">
                    <img src="/images/logos/app_logo.png" alt="AriaPass" className="h-auto w-20 object-contain" />

                    <LoaderCircle strokeWidth={3} className='animate-spin h-5 w-5 text-primary' />
                </div>
            </div>
        </div>
    );
}
