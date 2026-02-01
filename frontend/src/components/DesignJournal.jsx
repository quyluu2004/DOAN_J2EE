import React from 'react';

const DesignJournal = () => {
    const articles = [
        {
            id: 1,
            title: "How to Create Your Fitnic Design Home",
            excerpt: "Thrown serves adindodical design and tomet a klow osemross and...",
            imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            title: "Create Your Unique Design Journals",
            excerpt: "Design ipsum dolor sit amet, moulisne site weasting website lof...",
            imageUrl: "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 3,
            title: "How to Controlling Your Bedroom",
            excerpt: "Fin a pointe aavetted abostitmest, recova nature triscettles, gwoon...",
            imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400"
        }
    ];

    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="flex justify-between items-center mb-12">
                <h3 className="text-sm font-bold tracking-widest uppercase">Design Journal</h3>
                <div className="flex space-x-2">
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition">&lt;</button>
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition">&gt;</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <div key={article.id} className="group cursor-pointer">
                        <div className="bg-gray-100 rounded-lg overflow-hidden mb-6 h-64">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                            />
                        </div>
                        <h4 className="font-bold text-lg mb-2 group-hover:text-gray-600 transition">{article.title}</h4>
                        <p className="text-gray-500 text-sm mb-4">{article.excerpt}</p>
                        <span className="text-xs font-bold uppercase border-b border-black pb-0.5 group-hover:border-gray-600 transition">Read More</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DesignJournal;
