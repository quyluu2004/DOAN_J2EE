import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interactive 3D Furniture Showcase
 * 
 * A premium 3D product viewer with mouse-tracking perspective tilt,
 * multiple product angles, and elegant floating UI elements.
 * Uses CSS 3D transforms for a polished, glitch-free experience.
 */

const FURNITURE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    label: 'Front View',
  },
  {
    url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=800',
    label: 'Lifestyle',
  },
  {
    url: 'https://images.unsplash.com/photo-1567016432779-094069811ea2?auto=format&fit=crop&q=80&w=800',
    label: 'Detail',
  },
];

export default function Interactive3DFurniture({ className = "" }) {
  const containerRef = useRef(null);
  const [activeImage, setActiveImage] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Auto-cycle images
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveImage(prev => (prev + 1) % FURNITURE_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Tilt: max ±15 degrees
    setTilt({
      x: (y - 0.5) * -20,
      y: (x - 0.5) * 20,
    });

    // Glare position
    setGlarePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-sm overflow-hidden flex items-center justify-center"
        style={{ perspective: 1200 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff2e0] via-[#fcecd5] to-[#fff8f3]" />

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #703225 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, #703225 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute w-20 h-20 rounded-full border border-[#c8a35a]/20"
          animate={{ y: [0, -15, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ top: '10%', left: '8%' }}
        />
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-[#c8a35a]/30"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '20%', right: '12%' }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-[#703225]/25"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ bottom: '25%', left: '15%' }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-[#703225]/10"
          animate={{ y: [0, 10, 0], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: '5%', right: '5%' }}
        />

        {/* 3D Product Card */}
        <motion.div
          className="relative z-10 w-[320px] h-[400px] md:w-[400px] md:h-[500px] cursor-pointer"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Card shadow (3D depth) */}
          <div 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(112,50,37,0.2) 0%, transparent 70%)',
              filter: 'blur(10px)',
              transform: `translateZ(-30px) scale(${isHovering ? 1.1 : 1})`,
              transition: 'transform 0.3s ease',
            }}
          />

          {/* Main card body */}
          <div 
            className="absolute inset-0 rounded-lg overflow-hidden bg-white"
            style={{
              transform: 'translateZ(0px)',
              boxShadow: isHovering 
                ? '0 30px 60px rgba(112,50,37,0.15), 0 10px 20px rgba(0,0,0,0.05)' 
                : '0 15px 35px rgba(112,50,37,0.1), 0 5px 15px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {/* Image area */}
            <div className="relative w-full h-[75%] bg-[#fcecd5] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={FURNITURE_IMAGES[activeImage].url}
                  alt="ÉLITAN Furniture"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>

              {/* Glare effect */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
                style={{
                  opacity: isHovering ? 0.15 : 0,
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, white 0%, transparent 60%)`,
                }}
              />

              {/* Image label */}
              <div className="absolute top-4 left-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white bg-[#703225]/80 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  {FURNITURE_IMAGES[activeImage].label}
                </span>
              </div>

              {/* Image dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {FURNITURE_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeImage 
                        ? 'bg-white w-6 shadow-md' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Info area */}
            <div className="p-5 h-[25%] flex flex-col justify-center">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-lg text-[#221a0c] mb-1">Toscana Armchair</h3>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#86736f] font-medium">Artisan Collection</p>
                </div>
                <span className="font-serif text-xl text-[#703225] italic">$2,450</span>
              </div>

              {/* Material dots */}
              <div className="flex gap-2 mt-3">
                {[
                  { color: '#703225', name: 'Terracotta' },
                  { color: '#59614d', name: 'Olive' },
                  { color: '#37455e', name: 'Navy' },
                  { color: '#c8a35a', name: 'Gold' },
                ].map((m, i) => (
                  <div 
                    key={i}
                    className="w-4 h-4 rounded-full shadow-sm border border-black/5 hover:scale-125 transition-transform cursor-pointer"
                    style={{ background: m.color }}
                    title={m.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating 3D elements — positioned in front of the card */}
          <motion.div
            className="absolute -right-8 top-1/4 bg-[#703225] text-white px-4 py-2 rounded-sm shadow-lg"
            style={{ transform: 'translateZ(40px)' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest">Premium</span>
          </motion.div>

          <motion.div
            className="absolute -left-6 bottom-1/3 bg-[#c8a35a] text-white px-3 py-1.5 rounded-sm shadow-lg"
            style={{ transform: 'translateZ(30px)' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest">Handmade</span>
          </motion.div>

          <motion.div
            className="absolute right-4 -bottom-4 bg-white/90 backdrop-blur-sm text-[#221a0c] px-3 py-1.5 rounded-sm shadow-md border border-[#fcecd5]"
            style={{ transform: 'translateZ(50px)' }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#703225]">★ 4.9</span>
          </motion.div>
        </motion.div>

        {/* Instruction text */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#86736f] tracking-wider uppercase font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 0 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          Hover to interact
        </motion.div>
      </div>
    </div>
  );
}
