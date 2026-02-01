import React from 'react';
import { Armchair, Hammer, Truck } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen bg-[#f8f9fa] flex flex-col overflow-hidden pt-20"> {/* Added pt-20 to account for fixed navbar if needed, or just visual spacing */}

            <div className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Column: Text Content */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
                    <span className="inline-block bg-white border border-gray-200 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                        New Collection
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-4 text-gray-900 leading-[0.9]">
                        ÉLITAN.
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-gray-800">
                        Experience Luxury...
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-md text-lg font-light leading-relaxed">
                        Experience luxury: interiors more loving headings and feunting cons.
                        Designed for the modern connoisseur.
                    </p>
                    <button className="bg-black text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        Shop now
                    </button>

                    {/* Floating Collection Card (Visual - Desktop only for specific position) */}
                    <div className="hidden lg:block absolute left-0 bottom-32 -translate-x-4 animate-fade-in-up">
                        <div className="glass-panel p-4 rounded-2xl shadow-xl w-64 transform -rotate-2 hover:rotate-0 transition duration-500">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-semibold">Collections</h3>
                            </div>
                            <div className="bg-gray-100 rounded-xl h-40 mb-3 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400" alt="Grey Fabric Armchair" className="object-cover h-full w-full group-hover:scale-105 transition duration-500" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">Gray Fabric</p>
                                <p className="text-xs text-gray-500">Armchair</p>
                            </div>
                        </div>
                    </div>
                    {/* Second Floating Card */}
                    <div className="hidden lg:block absolute left-[18rem] bottom-48 z-0 animate-fade-in-up delay-100">
                        <div className="glass-panel p-3 rounded-2xl shadow-lg w-48 transform rotate-3 hover:rotate-0 transition duration-500">
                            <div className="bg-[#e2dac6] rounded-xl h-28 mb-2 overflow-hidden flex items-center justify-center">
                                <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=400" alt="Beige Chair" className="object-cover h-full w-full opacity-90 mix-blend-multiply" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-xs">Gray Salicic</p>
                                <p className="text-[10px] text-gray-500">Armchair</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Hero Image */}
                <div className="relative h-full flex items-center justify-center lg:justify-end">
                    <div className="relative w-full max-w-2xl lg:max-w-none h-[500px] lg:h-[800px]">
                        {/* Circle Background */}
                        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gray-200 rounded-full blur-3xl opacity-50 z-0"></div> */}
                        <img
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"
                            alt="Luxury Grey Lounge Chair"
                            className="object-contain w-full h-full transform lg:scale-125 z-10 relative drop-shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Feature Strip */}
            <div className="w-full bg-[#f8f9fa] border-t border-gray-200 py-12 relative z-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <Armchair className="w-8 h-8 mb-4 text-gray-800" strokeWidth={1.5} />
                        <h3 className="font-serif font-bold text-sm tracking-wider uppercase mb-2">Premium Materials</h3>
                        <p className="text-xs text-gray-500 max-w-xs">Sourced from finest sustainable forests and unique materials.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Hammer className="w-8 h-8 mb-4 text-gray-800" strokeWidth={1.5} />
                        <h3 className="font-serif font-bold text-sm tracking-wider uppercase mb-2">Artisan Craftsmanship</h3>
                        <p className="text-xs text-gray-500 max-w-xs">Hand-finished by skilled artisans to hand-finished projects.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Truck className="w-8 h-8 mb-4 text-gray-800" strokeWidth={1.5} />
                        <h3 className="font-serif font-bold text-sm tracking-wider uppercase mb-2">White-glove Delivery</h3>
                        <p className="text-xs text-gray-500 max-w-xs">Delivered and assembled in your room and few every room.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
