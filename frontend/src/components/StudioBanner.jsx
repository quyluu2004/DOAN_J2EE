import React from 'react';

const StudioBanner = () => {
    return (
        <section className="bg-[#1a1a1a] text-white py-20 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between overflow-hidden">
            {/* Text Content */}
            <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-12">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">The 3D Studio Experience</h4>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    VISUALIZE YOUR <br />
                    DREAM HOME. <br />
                    IN 3D.
                </h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    Experience luxury, interiors more loving heatlivers more nis loving headings and headings and feunting cons.
                </p>
                <button className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition">
                    Try 3D Studio Now
                </button>
            </div>

            {/* Visual - Isometric Room Illustration */}
            <div className="md:w-1/2 relative bg-[#2a2a2a] rounded-lg p-8 transform rotate-1 hover:rotate-0 transition duration-500">
                {/* Simplified SVG or Image representation of the 3D room from the design */}
                <div className="aspect-w-16 aspect-h-9 w-full bg-[#f0f0f0] rounded overflow-hidden flex items-center justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800"
                        alt="3D Room Visualization"
                        className="opacity-80 object-cover w-full h-full mix-blend-multiply"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-black font-bold text-xl uppercase tracking-widest bg-white/80 px-4 py-2 rounded backdrop-blur-sm">Interactive 3D Demo</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StudioBanner;
