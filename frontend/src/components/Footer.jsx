import React from 'react';
import { Facebook, Twitter, Instagram, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1a1a1a] text-white py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Newsletter */}
                <div className="md:col-span-1">
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Newsletter</h4>
                    <p className="text-gray-400 text-xs mb-4">Sign up to more newsletter, advice and updates.</p>
                    <div className="flex bg-white rounded-full overflow-hidden p-1">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="flex-1 px-4 py-2 text-black text-sm outline-none border-none"
                        />
                        <button className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition">
                            Sign up
                        </button>
                    </div>
                </div>

                {/* Shop Links */}
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Shop</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition">Home</a></li>
                        <li><a href="#" className="hover:text-white transition">Furnitures</a></li>
                        <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                        <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                    </ul>
                </div>

                {/* About Links */}
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">About</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition">About</a></li>
                        <li><a href="#" className="hover:text-white transition">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition">Notifications</a></li>
                        <li><a href="#" className="hover:text-white transition">Blog</a></li>
                    </ul>
                </div>

                {/* Help / Social */}
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Help</h4>
                    <div className="flex space-x-4 mb-8">
                        <Facebook size={20} className="hover:text-gray-300 cursor-pointer" />
                        <Twitter size={20} className="hover:text-gray-300 cursor-pointer" />
                        <Instagram size={20} className="hover:text-gray-300 cursor-pointer" />
                        <Globe size={20} className="hover:text-gray-300 cursor-pointer" />
                    </div>
                    <div className="text-4xl font-serif">ÉLITAN</div>
                    <p className="text-gray-500 text-xs mt-2">© 2026 ÉLITAN. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
