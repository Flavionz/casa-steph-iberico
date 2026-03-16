import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, MapPin, AlertCircle, Info } from 'lucide-react';
import {
    ALL_ELIGIBLE_POSTCODES,
    MIN_CART_AMOUNT,
    getDeliveryFee,
    getZoneLabel,
} from '../../constants/delivery';

export const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [postalCode, setPostalCode] = useState('');
    const [deliveryCheckResult, setDeliveryCheckResult] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [showCheckoutError, setShowCheckoutError] = useState(false);

    const isBelowMinimum = cartTotal < MIN_CART_AMOUNT;

    const checkDeliveryZone = () => {
        if (ALL_ELIGIBLE_POSTCODES.includes(postalCode.trim())) {
            setDeliveryCheckResult('valid');
            setShowCheckoutError(false);
        } else {
            setDeliveryCheckResult('invalid');
        }
    };

    const handleCheckout = () => {
        if (!user) {
            navigate('/login', { state: { from: '/cart' } });
            return;
        }
        if (isBelowMinimum) return;
        if (deliveryCheckResult !== 'valid') {
            setShowCheckoutError(true);
            return;
        }
        navigate('/checkout');
    };

    const deliveryFee = deliveryCheckResult === 'valid' ? getDeliveryFee(postalCode, cartTotal) : null;
    const zoneLabel   = deliveryCheckResult === 'valid' ? getZoneLabel(postalCode) : null;
    const orderTotal  = deliveryFee !== null ? cartTotal + deliveryFee : cartTotal;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#1E1B18] text-white pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <ShoppingBag size={80} className="mx-auto text-gray-600 mb-6" />
                    <h1 className="font-serif text-4xl text-white mb-4">Votre panier est vide</h1>
                    <p className="text-gray-400 mb-8">Découvrez notre sélection de produits espagnols d'exception</p>
                    <Link
                        to="/boutique"
                        className="inline-block px-8 py-3 bg-gold text-dark font-bold uppercase tracking-wider rounded-sm hover:bg-gold/90 transition-colors"
                    >
                        Voir la boutique
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1E1B18] text-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Mon Panier</h1>
                <div className="w-20 h-0.5 bg-gold mb-8"></div>

                {/* Panier minimum */}
                {isBelowMinimum && (
                    <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg flex items-start gap-3">
                        <AlertCircle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-yellow-300 font-semibold text-sm">Panier minimum non atteint</p>
                            <p className="text-yellow-400 text-xs mt-0.5">
                                Commande minimum de <strong>{MIN_CART_AMOUNT} €</strong>. Il vous manque{' '}
                                <strong>{(MIN_CART_AMOUNT - cartTotal).toFixed(2)} €</strong>.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Articles */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#2C2C2C] rounded-lg p-4 flex items-center space-x-4 border border-transparent hover:border-gold/30 transition-all"
                            >
                                <img
                                    src={item.image || 'https://placehold.co/100x100/1E1B18/Cca43b?text=Image'}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-serif text-lg text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-400">{item.category}</p>
                                    <p className="text-gold font-bold mt-1">{item.price.toFixed(2)} €</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors">
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Info livraison */}
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                            <div className="flex items-start space-x-3">
                                <Info size={24} className="text-blue-400 flex-shrink-0 mt-1" />
                                <div className="text-sm text-blue-300 space-y-1">
                                    <p className="font-semibold text-white">Livraison locale</p>
                                    <p>✅ Gratuite dans un rayon de <strong>7 km</strong> autour de Metz</p>
                                    <p>📦 <strong>5 €</strong> entre 7 et 15 km (offerte dès {100} €)</p>
                                    <p>🛒 Panier minimum : <strong>{MIN_CART_AMOUNT} €</strong></p>
                                </div>
                            </div>
                        </div>

                        {/* Vérification code postal */}
                        <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center space-x-2 mb-4">
                                <MapPin size={20} className="text-gold" />
                                <h3 className="font-serif text-lg text-white">Zone de Livraison</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">Vérifiez votre code postal</p>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Ex: 57000"
                                    value={postalCode}
                                    onChange={(e) => { setPostalCode(e.target.value); setDeliveryCheckResult('idle'); }}
                                    maxLength={5}
                                    className="flex-1 px-4 py-2 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                                <button onClick={checkDeliveryZone} className="px-6 py-2 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors">
                                    Vérifier
                                </button>
                            </div>

                            {deliveryCheckResult === 'valid' && (
                                <div className="mt-4 p-3 bg-green-900/20 border border-green-500 rounded text-green-300 text-sm">
                                    <p className="font-semibold">{zoneLabel}</p>
                                    {deliveryFee === 0 && <p className="text-xs mt-0.5">Livraison offerte !</p>}
                                    {deliveryFee! > 0 && <p className="text-xs mt-0.5">Frais de livraison : {deliveryFee} €</p>}
                                </div>
                            )}

                            {deliveryCheckResult === 'invalid' && (
                                <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
                                    <p className="font-semibold mb-1">Zone non couverte</p>
                                    <p className="text-xs">CP éligibles : {ALL_ELIGIBLE_POSTCODES.join(', ')}</p>
                                </div>
                            )}
                        </div>

                        {/* Récapitulatif */}
                        <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                            <h3 className="font-serif text-lg text-white mb-4">Récapitulatif</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Articles ({cartCount})</span>
                                    <span>{cartTotal.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Livraison</span>
                                    {deliveryFee === null && <span className="text-gray-500">—</span>}
                                    {deliveryFee === 0  && <span className="text-green-400">Gratuite</span>}
                                    {deliveryFee! > 0  && <span>{deliveryFee!.toFixed(2)} €</span>}
                                </div>
                                <div className="border-t border-gray-700 pt-2 mt-2"></div>
                                <div className="flex justify-between text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-gold">{orderTotal.toFixed(2)} €</span>
                                </div>
                            </div>

                            {!user ? (
                                <div className="mt-6 space-y-4">
                                    <div className="p-4 bg-gray-800/50 rounded border border-gray-600">
                                        <p className="text-sm text-gray-300 mb-3 font-semibold">Déjà client ?</p>
                                        <Link to="/login" state={{ from: '/cart' }} className="block w-full py-2.5 bg-gold text-dark text-center font-bold rounded hover:bg-gold/90 transition-colors">
                                            Se connecter
                                        </Link>
                                    </div>
                                    <div className="p-4 bg-blue-900/20 rounded border border-blue-500/30">
                                        <p className="text-sm text-blue-300 mb-3 font-semibold">Nouveau client ?</p>
                                        <Link to="/login" state={{ from: '/cart' }} className="block w-full py-2.5 bg-transparent border-2 border-blue-400 text-blue-300 text-center font-bold rounded hover:bg-blue-900/30 transition-colors">
                                            Créer un compte
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {showCheckoutError && deliveryCheckResult !== 'valid' && (
                                        <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
                                            Veuillez vérifier votre code postal avant de continuer.
                                        </div>
                                    )}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={deliveryCheckResult !== 'valid' || isBelowMinimum}
                                        className="w-full mt-6 py-3 bg-gold text-dark font-bold uppercase tracking-wider rounded hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Finaliser la Commande
                                    </button>
                                    {isBelowMinimum && (
                                        <p className="text-xs text-yellow-500 text-center mt-2">
                                            Minimum {MIN_CART_AMOUNT} € requis
                                        </p>
                                    )}
                                    {!isBelowMinimum && deliveryCheckResult !== 'valid' && (
                                        <p className="text-xs text-gray-500 text-center mt-2">
                                            Vérifiez votre code postal pour continuer
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
