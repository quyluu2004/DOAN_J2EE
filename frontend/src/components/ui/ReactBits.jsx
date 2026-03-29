import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const SplitText = ({ text, className = "" }) => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className={`flex flex-wrap ${className}`}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const BlurText = ({ text, className = "", delay = 0 }) => {
  const words = text.split(" ");
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
            visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const SpotlightCard = ({ children, className = "", onClick }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-none border border-[#e2e2e2] bg-white transition-colors hover:border-[#1a1c1c] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(119, 90, 25, 0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-20 h-full flex flex-col">{children}</div>
    </div>
  );
};

export const TiltedCard = ({ children, className = "", onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative overflow-hidden bg-white border border-[#e2e2e2] transition-colors hover:border-[#1a1c1c] ${className}`}
    >
      <div className="relative z-20 h-full">{children}</div>
    </motion.div>
  );
};

// ═══════════ 3D COMPONENTS ═══════════

/**
 * Rotating3DCard: A card with full 3D perspective tilt effect that follows the mouse.
 * Creates a premium, interactive experience when hovering over cards.
 */
export const Rotating3DCard = ({ children, className = "", intensity = 15 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full"
      >
        <div style={{ transform: "translateZ(0px)" }} className="w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

/**
 * DecorativeOrb: A floating, animated glass orb with a gradient fill.
 * Used as decorative background elements for premium feel.
 */
export const DecorativeOrb = ({ 
  size = 300, 
  color1 = '#703225', 
  color2 = '#c8a35a', 
  top, left, right, bottom,
  delay = 0,
  className = ""
}) => {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ 
        width: size, 
        height: size, 
        top, left, right, bottom,
        background: `radial-gradient(circle at 30% 30%, ${color1}22, ${color2}11, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{ 
        y: [0, -20, 0, 15, 0], 
        x: [0, 10, 0, -10, 0],
        scale: [1, 1.05, 1, 0.95, 1]
      }}
      transition={{ 
        duration: 12, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut" 
      }}
    />
  );
};

/**
 * ParallaxText: Large text that moves with a subtle parallax effect on scroll.
 * Creates depth and dimensionality.
 */
export const ParallaxText = ({ text, className = "" }) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const distance = (rect.top + rect.height / 2 - center) / window.innerHeight;
      setOffset(distance * 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y: offset }}>
        {text}
      </motion.div>
    </div>
  );
};

/**
 * GlassMorphCard: A frosted glass card with 3D depth layering.
 */
export const GlassMorphCard = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative backdrop-blur-xl bg-white/30 border border-white/20 shadow-[0_8px_32px_rgba(112,50,37,0.08)] ${className}`}
    >
      {/* Inner glass highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[inherit] pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
/**
 * ElectricBorder: A premium animated border with a glowing, moving effect.
 * Perfect for highlighting hero products with a "luxury" feel.
 */
export const ElectricBorder = ({ 
  children, 
  className = "", 
  color = "#703225", 
  duration = 3,
  borderRadius = "0px"
}) => {
  return (
    <div className={`relative p-[2px] overflow-hidden ${className}`} style={{ borderRadius }}>
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${color} 25%, transparent 50%, ${color} 75%, transparent 100%)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
      <div 
        className="relative z-10 bg-white" 
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </div>
    </div>
  );
};
/**
 * ReflectiveCard: A luxury card with a moving metallic shimmer/reflection effect.
 * Ideal for high-end products and interior design portfolios.
 */
export const ReflectiveCard = ({ 
  children, 
  className = "", 
  shimmerColor = "rgba(255, 255, 255, 0.4)",
  borderRadius = "0px"
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${className} shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20`} 
      style={{ borderRadius }}
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-white z-0" />
      
      {/* Moving Reflection/Shimmer sweep */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 35%, ${shimmerColor} 50%, transparent 65%)`,
          width: "200%",
          left: "-50%",
        }}
        animate={{ x: ["-50%", "50%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glossy overlay layer */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/20" />

      {/* Content */}
      <div className="relative z-30 h-full w-full">
        {children}
      </div>
    </div>
  );
};
/**
 * ClassicPictureFrame: A thick, premium golden ornate frame.
 * Created for a substantial "masterpiece" feel without bulky matting.
 */
export const ClassicPictureFrame = ({ 
  children, 
  className = ""
}) => {
  return (
    <div className={`relative p-[28px] bg-[#d4af37] shadow-[0_40px_80px_rgba(0,0,0,0.3)] ${className}`}>
      {/* Metallic Gradient Layer with detailed luster */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: `linear-gradient(135deg, #8b6508 0%, #d4af37 20%, #f1d592 35%, #d4af37 50%, #f1d592 65%, #d4af37 80%, #8b6508 100%)`,
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4)'
      }} />
      
      {/* Inner Bevel Detail (More pronounced) */}
      <div className="absolute inset-[6px] z-10 border-2 border-black/10 pointer-events-none" />
      <div className="absolute inset-[10px] z-10 border border-white/20 pointer-events-none" />

      {/* Content Container (No more bulky matting) */}
      <div className="relative z-20 bg-white h-full w-full overflow-hidden shadow-[inset_0_2px_15px_rgba(0,0,0,0.3)]">
        {children}
      </div>
      
      {/* Ornate Corner Accents (Slightly larger) */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 z-30" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 z-30" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 z-30" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 z-30" />
    </div>
  );
};
