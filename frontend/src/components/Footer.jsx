import React from 'react';
import { Facebook, Twitter, Instagram, Globe } from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';

import { Link } from 'react-router-dom';

const Footer = () => {
    const { t } = useLocalization();
    return (
        <footer className="bg-[#1a1a1a] text-white py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Newsletter */}
                <div className="md:col-span-1">
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">{t('footer.newsletter')}</h4>
                    <p className="text-gray-400 text-xs mb-4">{t('footer.newsletter_desc')}</p>
                    <div className="flex bg-white rounded-full overflow-hidden p-1">
                        <input
                            type="email"
                            placeholder={t('footer.placeholder')}
                            className="flex-1 px-4 py-2 text-black text-sm outline-none border-none"
                        />
                        <button className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition">
                            {t('footer.signup')}
                        </button>
                    </div>
                </div>

                {/* Shop Links */}
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">{t('footer.shop')}</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/" className="hover:text-white transition">{t('nav.home')}</Link></li>
                        <li><Link to="/shop" className="hover:text-white transition">{t('footer.links.furnitures')}</Link></li>
                        <li><a href="#" className="hover:text-white transition">{t('footer.links.pricing')}</a></li>
                        <li><Link to="/contact" className="hover:text-white transition">{t('nav.contact')}</Link></li>
                    </ul>
                </div>

                {/* About Links */}
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">{t('footer.about')}</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/about" className="hover:text-white transition">{t('nav.about')}</Link></li>
                        <li><a href="#" className="hover:text-white transition">{t('footer.about')}</a></li>
                        <li><a href="#" className="hover:text-white transition">{t('footer.links.notifications')}</a></li>
                        <li><a href="#" className="hover:text-white transition">{t('footer.links.blog')}</a></li>
                    </ul>
                </div>

                {/* Help / Social */}
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">{t('footer.help')}</h4>
                    <div className="flex space-x-4 mb-8">
                        <Facebook size={20} className="hover:text-gray-300 cursor-pointer" />
                        <Twitter size={20} className="hover:text-gray-300 cursor-pointer" />
                        <Instagram size={20} className="hover:text-gray-300 cursor-pointer" />
                        <Globe size={20} className="hover:text-gray-300 cursor-pointer" />
                    </div>
                    <div className="text-4xl font-serif">ÉLITAN</div>
                    <p className="text-gray-500 text-xs mt-2">© 2026 ÉLITAN. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
