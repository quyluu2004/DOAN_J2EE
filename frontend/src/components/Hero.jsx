import React from 'react';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.png';
import heroChair from '../assets/chair-hero-bg.png';

const Hero = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden font-sans bg-[#e5e5e5]">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <img
                    src={heroBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-white/20"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-center">

                {/* Main Text Content - Centered */}
                <div className="flex flex-col items-center text-center mt-[-50px] relative z-20">
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tight text-black mb-2 leading-none font-serif">
                        ÉLITAN.
                    </h1>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium text-black mb-6 tracking-wide">
                        Experience Luxury...
                    </h2>
                    <p className="text-gray-700 text-lg md:text-xl max-w-xl mb-10 font-normal leading-relaxed">
                        Experience luxury: interiors more loving headings and feunting cons.

                    </p>
                    <button className="bg-black text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer">
                        Shop now
                    </button>
                </div>

                {/* Floating Card 1 - Left Top (Collections) */}
                <div className="absolute left-[2%] top-[20%] lg:left-[5%] lg:top-[22%] hidden xl:block animate-fade-in z-30">
                    <div className="bg-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-[260px] transform -rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer group">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h3 className="text-sm font-bold text-gray-900 tracking-wide">Collections</h3>
                            <span className="w-2 h-2 rounded-full bg-black"></span>
                        </div>
                        <div className="bg-[#f5f5f5] rounded-[1.5rem] h-44 mb-4 overflow-hidden relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            {/* Placeholder visual using the same chair but small */}
                            <img src={heroChair} alt="Grey Fabric" className="w-[80%] h-[80%] object-contain mix-blend-multiply opacity-90" />
                        </div>
                        <div className="px-2">
                            <p className="font-bold text-gray-900 text-lg leading-tight">Grey Fabric</p>
                            <p className="text-xs text-gray-400 font-medium mt-1">Armchair</p>
                        </div>
                    </div>
                </div>

                {/* Floating Card 2 - Left Bottom (Brown Variant) */}
                <div className="absolute left-[15%] bottom-[10%] lg:left-[15%] lg:bottom-[8%] hidden xl:block animate-fade-in delay-100 z-30">
                    <div className="bg-white p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-[220px] transform rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer group">
                        <div className="bg-[#e3d1c2] rounded-[1.5rem] h-36 mb-4 overflow-hidden flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                            <img
                                src={heroChair}
                                alt="Brown Fabric"
                                className="w-[85%] h-[85%] object-contain mix-blend-multiply brightness-[0.7] sepia-[0.6] hue-rotate-[-15deg] saturate-[0.8]"
                            />
                        </div>
                        <div className="px-2">
                            <p className="font-bold text-gray-900 text-base leading-tight">Brown Fabric</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-1">Armchair</p>
                        </div>
                    </div>
                </div>

                {/* Main Chair Image - Right Side */}
                {/* --- LỚP 4: HERO CHAIR & GRADIENT SHADOW (Đã Fix lỗi bay) --- */}
                <motion.div
                    className="absolute right-[-5%] bottom-[-4%] h-[85vh] z-40 hidden md:flex flex-col items-center justify-end pointer-events-none"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* 1. ẢNH CÁI GHẾ (Nằm đè lên trên - Z cao) */}
                    <img
                        src={heroChair}
                        alt="Luxury Armchair"
                        className="h-full w-auto object-contain relative z-20"
                    />

                    {/* 2. CÁI BÓNG (Đã sửa dùng Gradient & Đẩy lên cao) */}
                    <div
                        className="absolute left-[70%] -translate-x-1/2 z-10 blur-xl"
                        style={{
                            // Đẩy bóng lên 8% để chạm vào chân ghế
                            bottom: '8%',
                            // Chiều rộng bóng bằng 80% chiều rộng khung chứa (to hơn chút do bóng tản ra)
                            width: '80%',
                            // Chiều cao bóng dẹt (10%)
                            height: '10%',
                            // Hiệu ứng loang từ tâm: Đen nhạt hơn (0.35) -> Trong suốt
                            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%)',
                        }}
                    ></div>

                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
