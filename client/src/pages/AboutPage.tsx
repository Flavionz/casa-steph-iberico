import { Heart, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#1E1B18] text-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(/hero-charcuterie.jpg)',
                        filter: 'brightness(0.4)'
                    }}
                />
                <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="font-serif text-5xl md:text-7xl text-white mb-4">
                            Notre Histoire
                        </h1>
                        <div className="w-32 h-0.5 bg-gold mx-auto"></div>
                        <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
                            Une passion pour l'excellence gastronomique ibérique
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                {/* Section 1 - Image Left, Text Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
                    <div className="order-2 lg:order-1">
                        <img
                            src="/about-jambon.jpg"
                            alt="Jambon artisanal"
                            className="rounded-lg shadow-2xl w-full h-[500px] object-contain bg-[#2C2C2C]"
                        />
                    </div>
                    <div className="order-1 lg:order-2 space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Heart size={32} className="text-gold" />
                            <h2 className="font-serif text-4xl text-white">La Passion du Goût</h2>
                        </div>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Tout a commencé par une passion profonde pour les produits de qualité et une véritable
                            fascination pour la gastronomie espagnole. Après des années passées à découvrir les
                            trésors culinaires de l'Espagne, j'ai décidé de partager cette passion avec la région
                            de Metz.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Casa Steph Iberico n'est pas simplement un commerce, c'est l'aboutissement d'un rêve :
                            rendre accessible à tous les amateurs de gastronomie les véritables saveurs de l'Espagne,
                            ces produits d'exception que l'on ne trouve nulle part ailleurs dans la région.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Chaque produit est sélectionné avec soin, chaque jambon est affiné selon les traditions
                            ancestrales, chaque fromage raconte une histoire. C'est cette authenticité que je
                            souhaite partager avec vous.
                        </p>
                    </div>
                </div>

                {/* Section 2 - Text Left, Image Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Award size={32} className="text-gold" />
                            <h2 className="font-serif text-4xl text-white">L'Art de la Charcuterie</h2>
                        </div>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            La charcuterie espagnole est un art qui demande patience, savoir-faire et respect des
                            traditions. Chaque jambon ibérique, chaque chorizo, chaque saucisson est le fruit d'un
                            travail minutieux transmis de génération en génération.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            En reprenant cette activité, je me suis engagé à préserver ces techniques ancestrales
                            tout en les adaptant aux exigences modernes de qualité et de traçabilité. Chaque produit
                            que vous trouvez dans ma boutique provient de producteurs espagnols que j'ai
                            personnellement rencontrés et avec qui j'ai établi une relation de confiance.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Mon atelier de découpe artisanale me permet de vous proposer des portions parfaites,
                            découpées à la demande selon vos besoins, garantissant fraîcheur et qualité optimales
                            pour chaque commande.
                        </p>
                    </div>
                    <div>
                        <img
                            src="/about-charcuterie.jpg"
                            alt="Découpe artisanale"
                            className="rounded-lg shadow-2xl w-full h-[500px] object-cover"
                        />
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-[#2C2C2C] rounded-lg p-12 border border-gray-700">
                    <h2 className="font-serif text-4xl text-white text-center mb-12">
                        Nos Valeurs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
                                <Award size={32} className="text-gold" />
                            </div>
                            <h3 className="font-serif text-2xl text-white">Qualité</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Sélection rigoureuse des meilleurs produits espagnols, sans compromis sur
                                l'excellence et l'authenticité.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
                                <Heart size={32} className="text-gold" />
                            </div>
                            <h3 className="font-serif text-2xl text-white">Passion</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Un amour profond pour la gastronomie qui se reflète dans chaque produit et
                                chaque conseil personnalisé.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
                                <MapPin size={32} className="text-gold" />
                            </div>
                            <h3 className="font-serif text-2xl text-white">Proximité</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Livraison personnelle dans un rayon de 15km autour de Metz pour garantir
                                fraîcheur et service irréprochable.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-20">
                    <h2 className="font-serif text-3xl text-white mb-6">
                        Découvrez nos produits d'exception
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Laissez-vous tenter par notre sélection de charcuterie, fromages et spécialités
                        espagnoles. Chaque produit raconte une histoire, chaque bouchée est un voyage.
                    </p>
                    <Link
                        to="/boutique"
                        className="inline-block px-8 py-4 bg-gold text-dark font-bold uppercase tracking-wider rounded-sm hover:bg-gold/90 transition-colors"
                    >
                        Voir la Boutique
                    </Link>
                </div>
            </div>
        </div>
    );
};