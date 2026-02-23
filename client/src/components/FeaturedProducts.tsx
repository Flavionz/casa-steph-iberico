import { Link } from 'react-router-dom';

const featuredItems = [
    {
        id: 1,
        image: '/featured/charcuterie-platter.jpg',
        title: 'Charcuterie Artisanale',
        category: 'Charcuterie'
    },
    {
        id: 2,
        image: '/featured/fromage-selection.jpg',
        title: 'Sélection de Fromages',
        category: 'Fromages'
    },
    {
        id: 3,
        image: '/featured/fromage-artisanal.jpg',
        title: 'Fromages Affinés',
        category: 'Fromages'
    },
    {
        id: 4,
        image: '/featured/vins-selection.jpg',
        title: 'Vins d\'Exception',
        category: 'Vins'
    },
    {
        id: 5,
        image: '/featured/epicerie-fine.jpg',
        title: 'Épicerie Fine',
        category: 'Épicerie'
    },
    {
        id: 6,
        image: '/featured/sangria-lolailo.jpg',
        title: 'Sangria Authentique',
        category: 'Boissons'
    }
];

export const FeaturedProducts = () => {
    return (
        <section className="bg-[#1E1B18] py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                        Nos Incontournables
                    </h2>
                    <div className="w-20 h-0.5 bg-gold mx-auto mb-4"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Découvrez une sélection de nos produits phares, choisis avec passion pour leur qualité exceptionnelle
                    </p>
                </div>

                {/* Products Grid - 2 rows x 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {featuredItems.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
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

                            {/* Border on hover */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold transition-colors duration-300 rounded-lg pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
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