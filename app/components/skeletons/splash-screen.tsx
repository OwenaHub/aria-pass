export default function SplashScreen() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-between bg-white p-10 animate-in fade-in duration-700">
            {/* Top Spacer to help center the logo vertically */}
            <div className="hidden md:block" />

            {/* Central Brand Identity */}
            <div className="flex flex-col items-center gap-8">
                <div className="relative">
                    {/* Subtle "breathing" effect instead of a bounce */}
                    <img
                        src="/images/logos/app_logo.png"
                        alt="AriaPass"
                        className="h-auto w-18 md:w-24 object-contain opacity-90 animate-pulse duration-3000"
                    />
                </div>

                {/* Professional Progress Indicator */}
                <div className="w-40 h-0.5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                        className="absolute h-full bg-indigo-600 rounded-full animate-progress-loading"
                        style={{ width: '30%' }}
                    />
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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