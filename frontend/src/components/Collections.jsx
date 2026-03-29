import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useLocalization } from '../context/LocalizationContext';

const Collections = () => {
    const { t } = useLocalization();
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        axios.get('/api/collections')
            .then(res => setCollections(res.data))
            .catch(err => console.error(err));
    }, []);

    // Placeholder data if backend fails or is empty for dev visual
    const displayCollections = collections.length > 0 ? collections : [
        { id: 1, name: "Living Room", type: "LIVING_ROOM", imageUrl: "https://images.unsplash.com/photo-1540573133985-cd9118355ae0?auto=format&fit=crop&q=80&w=800" },
        { id: 2, name: "Dining", type: "DINING", imageUrl: "https://images.unsplash.com/photo-1579725942955-4d8377f8c66a?auto=format&fit=crop&q=80&w=800" },
        { id: 3, name: "Bedroom", type: "BEDROOM", imageUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800" },
    ];

    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <h3 className="text-sm font-bold tracking-widest uppercase mb-12 text-center md:text-left">{t('home.curated_title')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                {/* Large Item: Living Room */}
                <div className="md:col-span-2 row-span-2 relative group overflow-hidden rounded-sm cursor-pointer">
                    <img
                        src={displayCollections.find(c => c.type === 'LIVING_ROOM')?.imageUrl}
                        alt="Living Room"
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <h4 className="text-2xl font-medium tracking-wide mb-4">{t('home.curated.living_room')}</h4>
                        <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition">
                            {t('home.curated.explore')} {t('home.curated.living_room')}
                        </button>
                    </div>
                </div>

                {/* Vertical Stack: Dining & Bedroom */}
                <div className="flex flex-col gap-6 h-full">
                    <div className="relative group overflow-hidden rounded-sm flex-1 cursor-pointer">
                        <img
                            src={displayCollections.find(c => c.type === 'DINING')?.imageUrl}
                            alt="Dining"
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h4 className="text-xl font-medium tracking-wide">{t('home.curated.dining')}</h4>
                        </div>
                    </div>
                    <div className="relative group overflow-hidden rounded-sm flex-1 cursor-pointer">
                        <img
                            src={displayCollections.find(c => c.type === 'BEDROOM')?.imageUrl}
                            alt="Bedroom"
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h4 className="text-xl font-medium tracking-wide">{t('home.curated.bedroom')}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Collections;
