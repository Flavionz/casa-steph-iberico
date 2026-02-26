import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface FeaturedItem {
    id: number;
    title: string;
    category: string;
    image: string;
    position: number;
}

export const FeaturedProducts = () => {
    const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = 'http://localhost:3000/api';

    useEffect(() => {
        fetchFeatured();
    }, []);

    const fetchFeatured = async () => {
        try {
            const response = await axios.get(`${API_URL}/featured`);
            setFeaturedItems(response.data);
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <section className="bg-[#1E1B18] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gold">Chargement des produits...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#1E1B18] py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                        Nos Incontournables
                    </h2>
                    <div className="w-20 h-0.5 bg-gold mx-auto mb-4"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Découvrez une sélection de nos produits phares, choisis avec passion pour leur qualité exceptionnelle
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {featuredItems.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-gold text-dark text-xs font-bold uppercase tracking-wider rounded mb-2">
                    {item.category}
                  </span>
                                    <h3 className="font-serif text-2xl text-white">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold transition-colors duration-300 rounded-lg pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/boutique"
                        className="inline-block px-12 py-4 bg-gold text-dark font-bold uppercase tracking-wider rounded-sm shadow-lg hover:bg-gold/90 transition-all duration-300 hover:scale-105"
                    >
                        Découvrez Notre Boutique
                    </Link>
                </div>
            </div>
        </section>
    );
};