import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { SplitText, Rotating3DCard, DecorativeOrb, GlassMorphCard, BlurText } from '../components/ui/ReactBits';
import { Award, Leaf, Gem, Heart, RotateCw } from 'lucide-react';

import { useLocalization } from '../context/LocalizationContext';

// Lazy load 3D components to avoid blocking initial render
const Interactive3DFurniture = React.lazy(() => import('../components/Interactive3DFurniture'));
const ThreeJSFurniture = React.lazy(() => import('../components/ThreeJSFurniture'));

export default function About() {
  const { t } = useLocalization();

  const stats = [
    { number: '1987', label: t('about.stats.founded') },
    { number: '200+', label: t('about.stats.artisans') },
    { number: '50+', label: t('about.stats.countries') },
    { number: '12K', label: t('about.stats.crafted') },
  ];
  
  const values = [
    { icon: Award, title: t('about.pillars.craft.title'), desc: t('about.pillars.craft.desc') },
    { icon: Leaf, title: t('about.pillars.sustainable.title'), desc: t('about.pillars.sustainable.desc') },
    { icon: Gem, title: t('about.pillars.timeless.title'), desc: t('about.pillars.timeless.desc') },
    { icon: Heart, title: t('about.pillars.passion.title'), desc: t('about.pillars.passion.desc') },
  ];
  return (
    <div className="min-h-screen bg-[#fff8f3] text-[#221a0c] font-sans overflow-hidden">
      
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-40 pb-32 px-6 md:px-12 max-w-[1440px] mx-auto">
        {/* Floating 3D Orbs */}
        <DecorativeOrb size={400} color1="#703225" color2="#c8a35a" top="-100px" right="-100px" />
        <DecorativeOrb size={250} color1="#59614d" color2="#dde6cc" top="200px" left="-50px" delay={3} />
        <DecorativeOrb size={180} color1="#37455e" color2="#703225" bottom="50px" right="20%" delay={6} />

        <div className="relative z-10 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#703225] block mb-6"
          >
            <span className="inline-block w-4 h-4 rounded-sm bg-[#703225] mr-3 align-middle"></span>
            {t('about.story_badge')}
          </motion.span>
          
          <SplitText 
            text={t('about.title')} 
            className="font-serif text-5xl md:text-7xl lg:text-[90px] tracking-[-0.03em] leading-[1.05] mb-8 text-[#221a0c] inline-block" 
          />
          
          <BlurText 
            text={t('about.desc_hero')} 
            className="text-lg md:text-xl text-[#53433f] max-w-2xl leading-relaxed" 
            delay={0.5}
          />
        </div>
      </section>

      {/* ═══ STATS SECTION WITH 3D CARDS ═══ */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Rotating3DCard key={i} className="cursor-default" intensity={12}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-[#fff2e0] p-8 md:p-10 rounded-sm text-center h-full"
              >
                <span className="font-serif text-5xl md:text-6xl text-[#703225] block mb-3">{stat.number}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#86736f]">{stat.label}</span>
              </motion.div>
            </Rotating3DCard>
          ))}
        </div>
      </section>

      {/* ═══ INTERACTIVE 3D FURNITURE SHOWCASE ═══ */}
      <section className="relative px-6 md:px-12 max-w-[1440px] mx-auto pb-32">
        <DecorativeOrb size={350} color1="#c8a35a" color2="#703225" top="-80px" right="10%" delay={2} />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#703225] block mb-4">
              <span className="inline-block w-4 h-4 rounded-sm bg-[#703225] mr-3 align-middle"></span>
              {t('about.interactive.badge')}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-[-0.02em] text-[#221a0c] mb-4">{t('about.interactive.title')}</h2>
            <p className="text-sm text-[#86736f] flex items-center justify-center gap-2">
              <RotateCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
              {t('about.interactive.controls')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-b from-[#fff2e0] to-[#fcecd5] rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(112,50,37,0.08)]"
          >
            <Suspense fallback={
              <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
                <div className="w-16 h-16 border-t-2 border-[#703225] rounded-full animate-spin"></div>
              </div>
            }>
              <Interactive3DFurniture />
            </Suspense>
          </motion.div>

          {/* Feature tags */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[t('about.features.leather'), t('about.features.tufted'), t('about.features.hardwood'), t('about.features.artisan')].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#703225] bg-[#fff2e0] px-5 py-2 rounded-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3D FURNITURE SCENE (React Three Fiber) ═══ */}
      <section className="relative bg-[#221a0c] overflow-hidden">
        <DecorativeOrb size={300} color1="#c8a35a" color2="#703225" top="-60px" left="-50px" delay={1} />
        <DecorativeOrb size={200} color1="#59614d" color2="#fcecd5" bottom="-40px" right="-30px" delay={4} />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-2/5 text-[#fff8f3]"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a35a] block mb-4">
                <span className="inline-block w-4 h-4 rounded-sm bg-[#c8a35a] mr-3 align-middle"></span>
                {t('about.signature.badge')}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl tracking-[-0.02em] mb-6">{t('about.signature.title')}</h2>
              <p className="text-[#b8a99a] leading-relaxed mb-8">
                {t('about.signature.desc')}
              </p>
              
              <div className="space-y-4">
                {[
                  { label: t('product.specs.materials'), value: 'Aged Italian walnut' },
                  { label: 'Finish', value: '24K gold-plated accents' },
                  { label: 'Height', value: '62 cm' },
                  { label: t('product.specs.provenance'), value: 'Florence, Italy' },
                ].map((spec) => (
                  <div key={spec.label} className="flex justify-between border-b border-[#3d3022] pb-3">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#86736f] font-bold">{spec.label}</span>
                    <span className="text-sm text-[#fff8f3]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 3D Scene side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-3/5 rounded-sm overflow-hidden bg-gradient-to-b from-[#2a1f14] to-[#1a1208] shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              <Suspense fallback={
                <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-t-2 border-[#c8a35a] rounded-full animate-spin mx-auto mb-4"></div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#86736f]">{t('about.signature.loading')}</span>
                  </div>
                </div>
              }>
                <ThreeJSFurniture />
              </Suspense>
              <div className="px-6 pb-4 text-center">
                <span className="text-[10px] text-[#86736f] tracking-wider uppercase">🖱 Drag to rotate • Scroll to zoom</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ HERITAGE IMAGE + TEXT ═══ */}
      <section className="relative">
        <div className="absolute inset-0 bg-[#fcecd5]"></div>
        <DecorativeOrb size={350} color1="#703225" color2="#59614d" top="50px" right="-80px" delay={2} />
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32 flex flex-col lg:flex-row gap-16 items-center">
          {/* 3D Interactive Image */}
          <Rotating3DCard className="w-full lg:w-1/2" intensity={8}>
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-[0_30px_60px_rgba(112,50,37,0.12)]">
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" 
                alt="Italian workshop" 
                className="w-full h-full object-cover"
              />
            </div>
          </Rotating3DCard>

          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#703225] block">
              <span className="inline-block w-4 h-4 rounded-sm bg-[#703225] mr-3 align-middle"></span>
              {t('about.heritage.badge')}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-[-0.02em] leading-tight text-[#221a0c]">
              {t('about.heritage.title')}
            </h2>
            <p className="text-[#53433f] leading-relaxed text-base">
              {t('about.heritage.desc1')}
            </p>
            <p className="text-[#53433f] leading-relaxed text-base">
              {t('about.heritage.desc2')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ VALUES SECTION WITH GLASSMORPHISM ═══ */}
      <section className="relative px-6 md:px-12 max-w-[1440px] mx-auto py-32">
        <DecorativeOrb size={300} color1="#c8a35a" color2="#703225" top="0" left="30%" delay={4} />

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#703225] block mb-4">
              <span className="inline-block w-4 h-4 rounded-sm bg-[#703225] mr-3 align-middle"></span>
              {t('about.pillars.badge')}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-[-0.02em] text-[#221a0c]">{t('about.pillars.title')}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <Rotating3DCard key={i} intensity={8}>
                <GlassMorphCard className="p-10 md:p-12 rounded-sm h-full bg-[#fff2e0]/60">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-sm bg-[#703225] flex items-center justify-center shrink-0 shadow-lg">
                      <value.icon size={24} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl mb-3 text-[#221a0c]">{value.title}</h3>
                      <p className="text-sm text-[#53433f] leading-relaxed">{value.desc}</p>
                    </div>
                  </div>
                </GlassMorphCard>
              </Rotating3DCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative bg-[#221a0c] text-[#fff8f3] overflow-hidden">
        <DecorativeOrb size={400} color1="#703225" color2="#c8a35a" top="-50px" left="-100px" delay={1} />
        <DecorativeOrb size={250} color1="#59614d" color2="#fcecd5" bottom="-50px" right="-50px" delay={5} />
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl tracking-[-0.02em] mb-6"
          >
            {t('about.cta.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#b8a99a] text-lg mb-10 max-w-lg mx-auto"
          >
            {t('about.cta.desc')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/shop" className="bg-[#703225] hover:bg-[#8d493a] text-white rounded-sm h-14 px-10 uppercase tracking-[0.1em] text-[11px] font-bold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1">
              {t('about.cta.explore')}
            </a>
            <a href="/contact" className="border border-[#53433f] hover:border-[#fff8f3] text-[#fff8f3] rounded-sm h-14 px-10 uppercase tracking-[0.1em] text-[11px] font-bold transition-all flex items-center justify-center gap-3 hover:-translate-y-1">
              {t('about.cta.contact')}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
