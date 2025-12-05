import React, { useEffect, useRef, useState } from 'react';
import useScrollReveal from '../Hooks/useScrollReveal';
import { Camera } from 'lucide-react';

const Gallery = () => {
    const sectionRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Parallax Logic
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const { top, height } = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate progress: 0 when top enters view, 1 when bottom leaves view
            // We want a value that represents how far we are through the section
            const start = top - windowHeight;
            const end = top + height;
            const progress = (window.scrollY - (sectionRef.current.offsetTop - windowHeight)) / (sectionRef.current.offsetHeight + windowHeight);

            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Init
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Columns with different speeds
    // We'll use transform translateY based on scrollProgress
    const getParallaxStyle = (speed) => ({
        transform: `translateY(${scrollProgress * speed * 100}px)`,
        transition: 'transform 0.1s linear' // Smooth out slightly
    });

    const images = [
        // Column 1
        [
            "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=600&q=80", // Travel / Adventure
            "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=600&q=80", // Hiking
            "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80", // Coffee / Chill
        ],
        // Column 2 (Center - moves faster or reverse)
        [
            "https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=600&q=80", // Ocean / Diving
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80", // Roadtrip
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80", // Nature
        ],
        // Column 3
        [
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80", // Cinque Terre
            "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&q=80", // Venice
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80", // Travel
        ]
    ];

    return (
        <section id="gallery" ref={sectionRef} className="relative py-40 overflow-hidden bg-black">

            {/* Background Noise/Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-24 text-center">
                    <h2 className="text-xs font-cyber tracking-[0.3em] uppercase text-green-500 mb-4 flex items-center justify-center gap-2">
                        <Camera size={14} />
                        Visual Archives
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                        Life Beyond Code
                    </h3>
                    <p className="mt-6 text-zinc-500 max-w-xl mx-auto font-mono text-sm">
            // CAPTURING MOMENTS_
                        <br />
                        Exploring the world, one frame at a time.
                    </p>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[1200px] md:h-[800px] overflow-hidden">

                    {/* Column 1 - Slow */}
                    <div className="flex flex-col gap-8" style={getParallaxStyle(-50)}>
                        {images[0].map((src, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
                                <img src={src} alt="Gallery 1" className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-colors duration-500"></div>
                            </div>
                        ))}
                    </div>

                    {/* Column 2 - Fast (Reverse direction or faster) */}
                    <div className="flex flex-col gap-8 pt-20" style={getParallaxStyle(-150)}>
                        {images[1].map((src, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
                                <img src={src} alt="Gallery 2" className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>

                    {/* Column 3 - Medium */}
                    <div className="flex flex-col gap-8 pt-10" style={getParallaxStyle(-80)}>
                        {images[2].map((src, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
                                <img src={src} alt="Gallery 3" className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Gallery;
