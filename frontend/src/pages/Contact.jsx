import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SplitText, Rotating3DCard, DecorativeOrb, GlassMorphCard } from '../components/ui/ReactBits';
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { useLocalization } from '../context/LocalizationContext';

export default function Contact() {
  const { t } = useLocalization();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const contactInfo = [
    { icon: MapPin, label: t('contact.label_showroom'), value: 'Via della Spiga 26, 20121 Milano, Italy' },
    { icon: Phone, label: t('contact.label_phone'), value: '+39 02 7600 1234' },
    { icon: Mail, label: t('contact.label_email'), value: 'atelier@elitan.it' },
    { icon: Clock, label: t('contact.label_hours'), value: 'Mon–Sat: 10:00 – 19:00' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t('contact.error_fill'));
      return;
    }
    toast.success(t('contact.success'), {
      style: { background: '#703225', color: '#ffffff', border: 'none', borderRadius: '4px' }
    });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#fff8f3] text-[#221a0c] font-sans overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto">
        <DecorativeOrb size={350} color1="#703225" color2="#c8a35a" top="-80px" right="-60px" />
        <DecorativeOrb size={200} color1="#59614d" color2="#dde6cc" top="180px" left="-30px" delay={4} />

        <div className="relative z-10 max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#703225] block mb-6"
          >
            <span className="inline-block w-4 h-4 rounded-sm bg-[#703225] mr-3 align-middle"></span>
            {t('contact.hero_badge')}
          </motion.span>
          <SplitText 
            text={t('contact.hero_title')} 
            className="font-serif text-5xl md:text-7xl lg:text-[80px] tracking-[-0.03em] leading-[1.05] mb-6 text-[#221a0c] inline-block" 
          />
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-lg text-[#53433f] max-w-xl leading-relaxed"
          >
            {t('contact.hero_desc')}
          </motion.p>
        </div>
      </section>

      {/* ═══ CONTACT INFO CARDS ═══ */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, i) => (
            <Rotating3DCard key={i} intensity={10}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-[#fff2e0] p-8 rounded-sm text-center h-full flex flex-col items-center justify-center gap-4"
              >
                <div className="w-12 h-12 rounded-sm bg-[#703225] flex items-center justify-center shadow-md">
                  <item.icon size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#86736f]">{item.label}</span>
                <span className="text-sm font-medium text-[#221a0c]">{item.value}</span>
              </motion.div>
            </Rotating3DCard>
          ))}
        </div>
      </section>

      {/* ═══ FORM + MAP ═══ */}
      <section className="relative bg-[#fcecd5]">
        <DecorativeOrb size={300} color1="#703225" color2="#59614d" bottom="-100px" left="-50px" delay={2} />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32 flex flex-col lg:flex-row gap-16">
          
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#703225] block mb-4">
              <span className="inline-block w-4 h-4 rounded-sm bg-[#703225] mr-3 align-middle"></span>
              {t('contact.form_badge')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl mb-10 text-[#221a0c]">{t('contact.form_title')}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#53433f] block mb-2">{t('contact.field_name')} *</label>
                  <input 
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#fff8f3] text-[#221a0c] p-4 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#703225] placeholder:text-[#b8a99a]"
                    placeholder={t('contact.placeholder_name')}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#53433f] block mb-2">{t('contact.field_email')} *</label>
                  <input 
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-[#fff8f3] text-[#221a0c] p-4 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#703225] placeholder:text-[#b8a99a]"
                    placeholder={t('contact.placeholder_email')}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#53433f] block mb-2">{t('contact.field_subject')}</label>
                <input 
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full bg-[#fff8f3] text-[#221a0c] p-4 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#703225] placeholder:text-[#b8a99a]"
                  placeholder={t('contact.placeholder_subject')}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#53433f] block mb-2">{t('contact.field_message')} *</label>
                <textarea 
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-[#fff8f3] text-[#221a0c] p-4 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#703225] resize-none placeholder:text-[#b8a99a]"
                  placeholder={t('contact.placeholder_message')}
                />
              </div>
              <button 
                type="submit" 
                className="bg-[#703225] hover:bg-[#8d493a] text-white rounded-sm h-14 px-10 uppercase tracking-[0.1em] text-[11px] font-bold transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Send size={14} strokeWidth={2} />
                {t('contact.send_btn')}
              </button>
            </form>
          </motion.div>

          {/* Map / Showroom Image */}
          <Rotating3DCard className="w-full lg:w-1/2" intensity={6}>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full min-h-[500px] rounded-sm overflow-hidden shadow-[0_30px_60px_rgba(112,50,37,0.1)] relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800" 
                alt="Élitan Milan Showroom" 
                className="w-full h-full object-cover"
              />
              {/* Overlay with address */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#221a0c]/80 to-transparent p-8">
                <GlassMorphCard className="rounded-sm p-6 bg-white/10">
                  <div className="flex items-center gap-4">
                    <MapPin size={20} className="text-[#c8a35a]" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#c8a35a] block">Milan Showroom</span>
                      <span className="text-sm text-white">Via della Spiga 26, 20121 Milano</span>
                    </div>
                  </div>
                </GlassMorphCard>
              </div>
            </motion.div>
          </Rotating3DCard>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="bg-[#221a0c] text-[#fff8f3] relative overflow-hidden">
        <DecorativeOrb size={300} color1="#703225" color2="#c8a35a" top="-50px" right="10%" delay={1} />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-3xl md:text-4xl mb-2">{t('contact.banner_title')}</h3>
            <p className="text-[#b8a99a] text-sm">{t('contact.banner_desc')}</p>
          </div>
          <a 
            href="/shop" 
            className="bg-[#703225] hover:bg-[#8d493a] text-white rounded-sm h-14 px-10 uppercase tracking-[0.1em] text-[11px] font-bold transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 shrink-0"
          >
            {t('contact.banner_cta')} <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </div>
  );
}
