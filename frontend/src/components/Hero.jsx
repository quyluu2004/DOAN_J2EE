import React, { useState } from 'react';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.png';
import heroChair from '../assets/chair-hero-bg.png';
import Stack from './Stack';
import Lanyard from './Lanyard';

import { Link } from 'react-router-dom';
import { useLocalization } from '../context/LocalizationContext';

const Hero = ({ featuredProducts = [] }) => {
    const { t } = useLocalization();
    // State to coordinate gestures between Stack (swipe) and Lanyard (drag)
    const [isLanyardMode, setIsLanyardMode] = useState(false);

    // Dynamic colors for the cards
    const cardColors = ["#f5f5f5", "#e3d1c2", "#f0f0f0"];

    // Map featured products to stack cards data - limit to 3 as requested
    const stackCardsData = featuredProducts.length > 0
        ? featuredProducts.slice(0, 3).map((p, i) => ({
            id: p.id,
            productId: p.id,
            title: p.name,
            subtitle: p.category,
            label: i === 0 ? t('home.new_arrival') : t('home.featured'),
            bgColor: cardColors[i % cardColors.length],
            img: p.imageUrl,
            imgStyle: "",
        }))
        : [
            {
                id: 1,
                title: "Grey Fabric",
                subtitle: "Armchair",
                label: t('nav.home'),
                bgColor: "#f5f5f5",
                img: heroChair,
                imgStyle: "",
            },
            {
                id: 2,
                title: "Brown Fabric",
                subtitle: "Armchair",
                label: t('home.new_arrival'),
                bgColor: "#e3d1c2",
                img: heroChair,
                imgStyle: "brightness-[0.7] sepia-[0.6] hue-rotate-[-15deg] saturate-[0.8]",
            },
        ];

    // Custom card renderer - EXACT original card design from Hero
    const renderProductCard = (card, index) => (
        <div className="w-full h-full bg-white p-5 rounded-[2rem] flex flex-col">
            {/* Header with label and dot - exact original */}
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-sm font-bold text-gray-900 tracking-wide">{card.label}</h3>
                <span className="w-2 h-2 rounded-full bg-black"></span>
            </div>

            {/* Image container - exact original styling */}
            <div
                className="rounded-[1.5rem] h-44 mb-4 overflow-hidden relative flex items-center justify-center"
                style={{ backgroundColor: card.bgColor }}
            >
                <img
                    src={card.img}
                    alt={card.title}
                    className={`w-[80%] h-[80%] object-contain mix-blend-multiply opacity-90 ${card.imgStyle}`}
                    draggable={false}
                />
            </div>

            {/* Text content - exact original */}
            <div className="px-2">
                <p className="font-bold text-gray-900 text-lg leading-tight">{card.title}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{card.subtitle}</p>
            </div>
        </div>
    );

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
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#703225] mb-6 animate-pulse">
                        {t('home.hero_sub')}
                    </h2>
                    <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-serif leading-[0.85] tracking-[-0.04em] text-[#221a0c] mb-12 uppercase text-center max-w-4xl">
                        {t('home.hero_title')}
                    </h1>
                    <p className="text-[#86736f] text-sm md:text-base max-w-lg mb-12 font-medium leading-relaxed uppercase tracking-widest">
                        {t('home.hero_desc')}
                    </p>
                    <Link to="/shop" className="bg-[#221a0c] hover:bg-[#703225] text-white px-12 py-5 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 shadow-2xl hover:scale-105 inline-block">
                        {t('home.hero_cta')}
                    </Link>
                </div>

                {/* Lanyard + Stack Cards - Left Side */}
                <div className="absolute left-[5%] top-[8%] hidden xl:block z-30">
                    <Lanyard
                        ropeColor="#1a1a1a"
                        ropeWidth={3}
                        onModeChange={setIsLanyardMode} // Sync Lanyard mode state
                    >
                        <div className="-rotate-6">
                            <Stack
                                randomRotation={false}
                                sensitivity={150}
                                cardDimensions={{ width: 260, height: 340 }}
                                cardsData={stackCardsData}
                                animationConfig={{ stiffness: 260, damping: 20 }}
                                renderCard={renderProductCard}
                                dragEnabled={!isLanyardMode} // Disable Stack swipe when Lanyard is dragging
                            />
                        </div>
                    </Lanyard>
                </div>

                {/* Main Chair Image - Right Side */}
                <motion.div
                    className="absolute right-[-5%] bottom-[-4%] h-[85vh] z-40 hidden md:flex flex-col items-center justify-end pointer-events-none"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <img
                        src={heroChair}
                        alt="Luxury Armchair"
                        className="h-full w-auto object-contain relative z-20"
                    />

                    <div
                        className="absolute left-[70%] -translate-x-1/2 z-10 blur-xl"
                        style={{
                            bottom: '8%',
                            width: '80%',
                            height: '10%',
                            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%)',
                        }}
                    ></div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
