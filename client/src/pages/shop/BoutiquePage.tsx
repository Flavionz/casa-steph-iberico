import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Navbar } from '../../components/Navbar';
import { CartContext } from '../../contexts/CartContext';
import { CartConfirmationModal } from '../../components/CartConfirmationModal';
import { Info, Package, Truck, ShoppingBag } from 'lucide-react';
import { MIN_CART_AMOUNT, ZONE_2_DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../../constants/delivery';

interface Category {
  id: number;
  name: string;
}

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

export const BoutiquePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
  const [showCartModal, setShowCartModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);

  const { addToCart } = useContext(CartContext);

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(`${API_URL}/products`);
        setProducts(productsResponse.data);

        const categoriesResponse = await axios.get(`${API_URL}/categories`);
        setCategories(categoriesResponse.data);

      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') {
      return true;
    }

    const selectedCategoryObject = categories.find(c => c.id === selectedCategory);

    if (selectedCategoryObject) {
      return product.category.name === selectedCategoryObject.name;
    }

    return false;
  });

  const handleCategorySelect = (categoryId: string | number) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      alert('Désolé, ce produit est en rupture de stock');
      return;
    }
    addToCart(product);
    setAddedProduct(product);
    setShowCartModal(true);
  };

  const getCategoryClass = (categoryId: string | number) => {
    const isActive = selectedCategory === categoryId;
    return `block w-full text-left py-2 px-3 rounded-sm transition-all duration-300 font-sans ${
        isActive
            ? 'bg-[#Cca43b]/20 text-[#Cca43b] border-l-2 border-[#Cca43b]'
            : 'text-gray-400 hover:text-white hover:bg-[#1E1B18]'
    }`;
  };

  const sidebarCategories = [
    { id: 'all', name: 'Tous', label: 'Tous' },
    ...categories.map(c => ({ id: c.id, name: c.name, label: c.name }))
  ];

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
          Rupture de stock
        </span>
      );
    } else if (stock <= 3) {
      return (
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
          Plus que {stock} disponible{stock > 1 ? 's' : ''}
        </span>
      );
    } else {
      return (
          <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
          {stock} en stock
        </span>
      );
    }
  };

  return (
      <div className="min-h-screen bg-[#1E1B18] text-white">
        <Navbar />

        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
                Notre Boutique
              </h1>
              <div className="w-20 h-0.5 bg-[#Cca43b] mx-auto mb-4"></div>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Découvrez notre sélection de produits espagnols d'exception
              </p>
            </div>

            {/* Info Banner — mobile: compact strip, desktop: full cards */}

            {/* Mobile summary strip */}
            <div className="md:hidden mb-6 bg-[#2C2C2C] border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3 text-xs text-gray-300">
              <Truck className="text-[#Cca43b] shrink-0" size={16} />
              <span>
                Livraison à Metz et ses environs · gratuite <strong className="text-white">sous 7 km</strong> · {ZONE_2_DELIVERY_FEE} € jusqu'à 15 km (offerte dès {FREE_DELIVERY_THRESHOLD} €) · Panier min. <strong className="text-white">{MIN_CART_AMOUNT} €</strong>
              </span>
            </div>

            {/* Desktop: context block + full cards */}
            <div className="hidden md:block">
              <div className="mb-6 bg-[#2C2C2C] border border-gray-700 rounded-lg p-5 flex items-start gap-4">
                <Truck className="text-[#Cca43b] shrink-0 mt-0.5" size={22} />
                <p className="text-sm text-gray-300 leading-relaxed">
                  <span className="font-semibold text-white">Livraison assurée personnellement par notre équipe.</span>{' '}
                  Petite structure locale basée à Metz, nous livrons nous-mêmes vos commandes à domicile, sans intermédiaire,
                  avec le soin que méritent nos produits. La livraison est limitée à un rayon de <strong className="text-white">15 km autour de Metz</strong>.
                </p>
              </div>

              <div className="mb-8 grid grid-cols-3 gap-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-5 flex items-start gap-3">
                  <Truck className="text-blue-400 shrink-0 mt-0.5" size={22} />
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold text-white mb-1">Livraison gratuite</p>
                    <p>Dans un rayon de <strong>7 km</strong> autour de Metz</p>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-5 flex items-start gap-3">
                  <Package className="text-blue-400 shrink-0 mt-0.5" size={22} />
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold text-white mb-1">{ZONE_2_DELIVERY_FEE} € entre 7 et 15 km autour de Metz</p>
                    <p>Offerte dès <strong>{FREE_DELIVERY_THRESHOLD} €</strong> d'achat dans cette zone</p>
                  </div>
                </div>
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-5 flex items-start gap-3">
                  <ShoppingBag className="text-amber-400 shrink-0 mt-0.5" size={22} />
                  <div className="text-sm text-amber-200">
                    <p className="font-semibold text-white mb-1">Panier minimum</p>
                    <p><strong>{MIN_CART_AMOUNT} €</strong> pour passer commande</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Info */}
            <div className="mb-8 bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Info className="text-amber-400" size={20} />
                <p className="text-sm text-amber-200">
                  <strong>Stock limité :</strong> Nos produits sont préparés artisanalement. Les quantités disponibles sont mises à jour en temps réel.
                </p>
              </div>
            </div>

            {isLoading ? (
                <div className="text-center text-xl animate-pulse text-[#Cca43b] h-64">
                  Chargement des délices...
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                  <aside className="lg:w-64 flex-shrink-0">
                    <div className="bg-[#2C2C2C] p-6 rounded-sm sticky top-24">
                      <h3 className="font-serif text-xl text-white mb-6">
                        Catégories
                      </h3>

                      <nav className="space-y-3">
                        {sidebarCategories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategorySelect(category.id)}
                                className={getCategoryClass(category.id)}
                            >
                              {category.label}
                            </button>
                        ))}
                      </nav>

                      <div className="mt-8 pt-6 border-t border-gray-700">
                        <p className="text-sm text-gray-500">
                          {filteredProducts.length} produit
                          {filteredProducts.length !== 1 ? 's' : ''}
                          {' '}affiché(s)
                        </p>
                      </div>
                    </div>
                  </aside>

                  <main className="flex-1">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                          <p className="text-gray-500 text-lg">
                            Aucun produit dans cette catégorie
                          </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredProducts.map((product) => (
                              <div
                                  key={product.id}
                                  className={`bg-[#2C2C2C] rounded-lg overflow-hidden shadow-lg border transition-all duration-300 ${
                                      product.stock === 0
                                          ? 'border-red-500/50 opacity-75'
                                          : 'border-transparent hover:border-[#Cca43b]'
                                  }`}
                              >
                                <div className="h-48 overflow-hidden relative">
                                  <div className="absolute top-2 left-2 bg-[#Cca43b] text-[#1E1B18] text-xs font-bold px-2 py-0.5 rounded z-10 uppercase">
                                    {product.category?.name || 'Gourmet'}
                                  </div>

                                  {/* Stock Badge */}
                                  <div className="absolute top-2 right-2 z-10">
                                    {getStockBadge(product.stock)}
                                  </div>

                                  <img
                                      src={product.image || "https://placehold.co/400x300/1E1B18/Cca43b?text=Image+Manquante"}
                                      alt={product.name}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  />
                                </div>

                                <div className="p-4">
                                  <h3 className="text-lg font-bold mb-1 font-serif text-white">
                                    {product.name}
                                  </h3>

                                  <div className="mb-4">
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-2" title={product.description}>
                                      {product.description.length > 50
                                          ? product.description.substring(0, 50) + '...'
                                          : product.description}
                                    </p>
                                    <span className="text-xl font-serif text-[#Cca43b] font-bold">
                              {product.price.toFixed(2)} €
                            </span>
                                  </div>

                                  <button
                                      onClick={() => handleAddToCart(product)}
                                      disabled={product.stock === 0}
                                      className={`w-full py-2 border transition-colors rounded uppercase text-xs tracking-wider font-bold ${
                                          product.stock === 0
                                              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                                              : 'border-[#Cca43b] text-[#Cca43b] hover:bg-[#Cca43b] hover:text-black'
                                      }`}
                                  >
                                    {product.stock === 0 ? 'Rupture de Stock' : 'Ajouter au Panier'}
                                  </button>
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                  </main>
                </div>
            )}
          </div>
        </div>

        <CartConfirmationModal
            isOpen={showCartModal}
            onClose={() => setShowCartModal(false)}
            product={addedProduct}
        />
      </div>
  );
};