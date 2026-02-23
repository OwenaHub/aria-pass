export default function SplashScreen() {
    return (
        <div className="p-5 h-screen w-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 bg-linear-to-tr from-indigo-100 to-pink-100 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="relative z-10 flex flex-col gap-10 items-center">
                <div className="relative ms-2 animate-[bounce_3s_ease-in-out_infinite]">
                    <img
                        src="/images/logos/app_logo.png"
                        alt="AriaPass"
                        className="h-auto w-24 object-contain drop-shadow-md"
                    />
                </div>

                <div className="flex flex-col items-center gap-5">
                    <div className="flex items-center gap-1 h-5">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-gray-900 rounded-full animate-pulse"
                                style={{
                                    // Alternates heights for a "soundwave" look
                                    height: i % 2 === 0 ? '100%' : '60%',
                                    animationDuration: '0.8s',
                                    // Staggers the animation so they don't pulse all at once
                                    animationDelay: `${i * 0.15}s`
                                }}
                            />
                        ))}
                    </div>

                    <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase animate-pulse">
                        Loading App
                    </p>
                </div>
            </div>
        </div>
    );
}