import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { CartContext } from '../../contexts/CartContext';
import { CartConfirmationModal } from '../../components/CartConfirmationModal';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    category: {
        name: string;
    };
}

const API_URL = 'http://localhost:3000/api';

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_URL}/products/${id}`);
                setProduct(response.data);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setNotFound(true);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product || product.stock === 0) return;
        addToCart(product);
        setShowCartModal(true);
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return (
                <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded">
                    Rupture de stock
                </span>
            );
        }
        if (stock <= 3) {
            return (
                <span className="px-3 py-1.5 bg-orange-500 text-white text-sm font-bold rounded">
                    Plus que {stock} disponible{stock > 1 ? 's' : ''}
                </span>
            );
        }
        return (
            <span className="px-3 py-1.5 bg-green-600 text-white text-sm font-bold rounded">
                {stock} en stock
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1E1B18] text-white">
                <Navbar />
                <div className="pt-24 flex justify-center items-center h-64">
                    <p className="text-[#Cca43b] text-xl animate-pulse">Chargement...</p>
                </div>
            </div>
        );
    }

    if (notFound || !product) {
        return (
            <div className="min-h-screen bg-[#1E1B18] text-white">
                <Navbar />
                <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                    <p className="text-gray-400 text-xl mb-6">Produit introuvable.</p>
                    <button
                        onClick={() => navigate('/boutique')}
                        className="border border-[#Cca43b] text-[#Cca43b] hover:bg-[#Cca43b] hover:text-black px-6 py-2 rounded transition-colors uppercase text-sm tracking-wider font-bold"
                    >
                        Retour à la boutique
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1E1B18] text-white">
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb / Back */}
                    <button
                        onClick={() => navigate('/boutique')}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#Cca43b] transition-colors mb-8 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm uppercase tracking-wider">Retour à la boutique</span>
                    </button>

                    {/* Product layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Image */}
                        <div className="rounded-lg overflow-hidden bg-[#2C2C2C] aspect-square">
                            <img
                                src={product.image || 'https://placehold.co/600x600/1E1B18/Cca43b?text=Image+Manquante'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = 'https://placehold.co/600x600/1E1B18/Cca43b?text=Image+Manquante';
                                }}
                            />
                        </div>

                        {/* Détails */}
                        <div className="flex flex-col">

                            {/* Catégorie */}
                            <span className="inline-block self-start text-xs uppercase tracking-wider bg-[#Cca43b]/90 text-[#1E1B18] px-3 py-1 rounded-full font-bold mb-4">
                                {product.category?.name}
                            </span>

                            {/* Nom */}
                            <h1 className="font-serif text-3xl md:text-4xl text-white mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Prix */}
                            <p className="text-3xl font-serif text-[#Cca43b] font-bold mb-5">
                                {product.price.toFixed(2)} €
                            </p>

                            {/* Stock */}
                            <div className="mb-6">
                                {getStockBadge(product.stock)}
                            </div>

                            {/* Séparateur + Description */}
                            <div className="border-t border-gray-700 pt-6 mb-8">
                                <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                                    Description
                                </h2>
                                <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                                    {product.description || 'Aucune description disponible.'}
                                </p>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex items-center justify-center gap-3 w-full py-4 rounded border transition-all duration-300 uppercase text-sm tracking-wider font-bold ${
                                    product.stock === 0
                                        ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                                        : 'border-[#Cca43b] text-[#Cca43b] hover:bg-[#Cca43b] hover:text-black'
                                }`}
                            >
                                <ShoppingCart size={18} />
                                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <CartConfirmationModal
                isOpen={showCartModal}
                onClose={() => setShowCartModal(false)}
                product={product}
            />
        </div>
    );
};
