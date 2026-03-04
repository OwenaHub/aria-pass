import { useState, useEffect } from "react";

export default function SplashScreen() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                // Jump forward by a random amount between 5 and 20
                const jump = Math.floor(Math.random() * 15) + 5;
                return Math.min(oldProgress + jump, 100);
            });
        }, 400);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-[98dvh] w-full flex flex-col items-center justify-between bg-white p-10 animate-in fade-in duration-700">
            <div className="block" />

            {/* Central Brand Identity */}
            <div className="flex flex-col items-center gap-8">
                <div className="relative">
                    <img
                        src="/images/logos/app_logo.png"
                        alt="AriaPass"
                        className="h-auto w-18 md:w-24 object-contain opacity-90 animate-pulse duration-3000"
                    />
                </div>

                {/* React-Driven Progress Indicator */}
                <div className="w-40 h-1 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                        className="absolute left-0 top-0 h-full bg-primary-theme rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Footer Attribution */}
            <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    From
                </p>
                <h2 className="text-sm text-slate-900 tracking-tighter">
                    <span className='text-[#F6A700] font-extrabold'>OwenaHub</span>{" "}
                    <span className='font-normal'>Collective</span>
                </h2>
            </div>
        </div>
    );
}