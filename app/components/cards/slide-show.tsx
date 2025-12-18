import { useState } from 'react';

const SlideShow = () => {
    const slides = [
        {
            id: 1,
            image: "/images/banners/john-onaeko.jpg",
            text: "We promote live music concerts, events and festivals 🩷",
        },
        {
            id: 2,
            image: "/images/banners/martin-widenka.jpg",
            text: "Discover unique genres and talented artists in our community 💛",
        },
        {
            id: 3,
            image: "/images/banners/sam-moghadam.jpg",
            text: "Collaborate with your event staff and manage bookings seamlessly ❤️",
        },
    ];

    const DURATION = 5000;
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="basis-3/8 hidden md:block bg-gray-100 rounded-tr-4xl rounded-lg rounded-bl-4xl border relative overflow-hidden group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.text}
                        loading={index === 0 || index === currentIndex ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>
            ))}

            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                    >
                        <div
                            className="h-full bg-white shadow-sm origin-left"
                            style={{
                                width: index < currentIndex ? '100%' : '0%',
                                // Only animate the active slide
                                animation: index === currentIndex
                                    ? `progress ${DURATION}ms linear forwards`
                                    : 'none'
                            }}
                            // This replaces the setInterval! 
                            // When animation finishes, React moves to the next slide.
                            onAnimationEnd={() => {
                                if (index === currentIndex) {
                                    setCurrentIndex((prev) => (prev + 1) % slides.length);
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-10 left-8 right-8 z-20">
                <h2
                    // Added a key here to trigger a tiny fade-in effect on text change
                    key={currentIndex}
                    className="text-white font-serif text-3xl font-medium tracking-tight drop-shadow-lg animate-fade-in"
                >
                    {slides[currentIndex].text}
                </h2>
            </div>
        </div>
    );
};

export default SlideShow;