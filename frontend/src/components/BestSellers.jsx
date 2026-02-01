import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';

const BestSellers = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/products/bestsellers')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    // Placeholder data
    const displayProducts = products.length > 0 ? products : [
        { id: 1, name: "Luna Lounge Chair", price: 1299, imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400" },
        { id: 2, name: "Luna Lounge Chair", price: 1299, imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=400" },
        { id: 3, name: "Grey Fabric", price: 1299, imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400" },
        { id: 4, name: "Grey Fabric", price: 1299, imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <section className="py-20 px-6 md:px-12 bg-[#f9f9f9]">
            <div className="flex justify-between items-center mb-12">
                <h3 className="text-sm font-bold tracking-widest uppercase">Best Sellers</h3>
                <div className="flex space-x-2">
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition">&lt;</button>
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition">&gt;</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayProducts.map((product) => (
                    <div key={product.id} className="group">
                        <div className="bg-[#f0f0f0] rounded-xl overflow-hidden mb-4 relative h-64 flex items-center justify-center">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition duration-500"
                            />
                            <button className="absolute bottom-4 right-4 bg-black text-white p-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
                                <ShoppingCart size={16} />
                            </button>
                        </div>
                        <h4 className="font-bold text-lg mb-1">{product.name}</h4>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">${product.price.toLocaleString()}</span>
                            <button className="text-xs font-bold uppercase border-b border-gray-300 hover:border-black transition pb-0.5">Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BestSellers;
