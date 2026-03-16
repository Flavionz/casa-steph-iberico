import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { StripePaymentForm } from '../../components/checkout/StripePaymentForm';
import { MapPin, CreditCard, Package, AlertCircle, CheckCircle, ChevronLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

const ELIGIBLE_POSTCODES = ['57000', '57050', '57070', '57140', '57150', '57160', '57170'];

export const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart, cartCount } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [deliveryData, setDeliveryData] = useState({
        address: user?.address || '',
        city: user?.city || '',
        postalCode: user?.postalCode || '',
        phone: user?.phone || '',
        notes: '',
        paymentMethod: 'cash',
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/boutique');
        }

        if (!user) {
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [cartItems, user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDeliveryData({ ...deliveryData, [e.target.name]: e.target.value });
        setError(null);
    };

    // Fetch Stripe clientSecret quando si raggiunge lo step 3 con pagamento carta
    useEffect(() => {
        if (currentStep === 3 && deliveryData.paymentMethod === 'card' && !clientSecret) {
            const fetchClientSecret = async () => {
                setIsLoadingPayment(true);
                setError(null);
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.post(
                        'http://localhost:3000/api/payments/create-intent',
                        { amount: cartTotal },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setClientSecret(response.data.clientSecret);
                } catch {
                    setError('Impossible de charger le formulaire de paiement. Vérifiez votre connexion.');
                } finally {
                    setIsLoadingPayment(false);
                }
            };
            fetchClientSecret();
        }
    }, [currentStep, deliveryData.paymentMethod, clientSecret, cartTotal]);

    // Chiamato da StripePaymentForm dopo pagamento confermato
    const handleStripeSuccess = async (paymentIntentId: string) => {
        setIsProcessing(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const orderData = {
                items: JSON.stringify(cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                }))),
                total: cartTotal,
                deliveryAddress: `${deliveryData.address}, ${deliveryData.city}`,
                postalCode: deliveryData.postalCode,
                phone: deliveryData.phone,
                notes: deliveryData.notes,
                paymentMethod: 'card',
                paymentIntentId,
            };

            const response = await axios.post(
                'http://localhost:3000/api/orders/create',
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            clearCart();
            navigate('/order-confirmation', {
                state: {
                    orderData: {
                        orderId: response.data.order?.id ?? response.data.id,
                        total: cartTotal,
                        items: cartItems.map(item => ({
                            id: item.id,
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                        deliveryAddress: `${deliveryData.address}, ${deliveryData.city}`,
                        postalCode: deliveryData.postalCode,
                        phone: deliveryData.phone,
                        paymentMethod: 'card',
                    },
                },
            });
        } catch {
            setError('Paiement réussi mais erreur lors de la création de la commande. Contactez le support.');
        } finally {
            setIsProcessing(false);
        }
    };

    const isEligible = ELIGIBLE_POSTCODES.includes(deliveryData.postalCode);
    const canProceedToStep2 = deliveryData.address && deliveryData.city && deliveryData.postalCode && isEligible && deliveryData.phone;

    const handleNextStep = () => {
        if (currentStep === 2 && !canProceedToStep2) {
            setError('Veuillez remplir tous les champs obligatoires avec un code postal valide');
            return;
        }
        setCurrentStep(currentStep + 1);
        setError(null);
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        setError(null);

        // Il pagamento carta viene gestito da StripePaymentForm — questo handler è solo per cash
        if (deliveryData.paymentMethod === 'card') {
            setIsProcessing(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const orderData = {
                items: JSON.stringify(cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))),
                total: cartTotal,
                deliveryAddress: `${deliveryData.address}, ${deliveryData.city}`,
                postalCode: deliveryData.postalCode,
                phone: deliveryData.phone,
                notes: deliveryData.notes,
                paymentMethod: deliveryData.paymentMethod,
            };

            const response = await axios.post(
                'http://localhost:3000/api/orders/create',
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate('/order-confirmation', {
                state: {
                    orderData: {
                        orderId: response.data.id,
                        total: cartTotal,
                        items: cartItems.map(item => ({
                            id: item.id,
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price
                        })),
                        deliveryAddress: `${deliveryData.address}, ${deliveryData.city}`,
                        postalCode: deliveryData.postalCode,
                        phone: deliveryData.phone,
                        paymentMethod: deliveryData.paymentMethod
                    }
                }
            });

            // Clear cart after successful order
            clearCart();

        } catch (error: any) {
            console.error('Order creation failed:', error);
            setError(error.response?.data?.error || 'Erreur lors de la création de la commande');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!user || cartItems.length === 0) {
        return null;
    }

    const steps = [
        { number: 1, title: 'Panier', icon: Package },
        { number: 2, title: 'Livraison', icon: MapPin },
        { number: 3, title: 'Confirmation', icon: CheckCircle },
    ];

    return (
        <div className="min-h-screen bg-[#1E1B18] text-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/cart"
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-sm">Retour au panier</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-700"></div>
                        <h1 className="font-serif text-4xl text-white">Finaliser la Commande</h1>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <div key={step.number} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                            isCompleted
                                                ? 'bg-green-500 border-green-500'
                                                : isActive
                                                    ? 'bg-gold border-gold'
                                                    : 'bg-gray-800 border-gray-600'
                                        }`}>
                                            <Icon size={20} className={isCompleted || isActive ? 'text-dark' : 'text-gray-500'} />
                                        </div>
                                        <span className={`text-xs mt-2 font-medium ${
                                            isActive ? 'text-gold' : isCompleted ? 'text-green-400' : 'text-gray-500'
                                        }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-24 h-0.5 mx-4 ${
                                            isCompleted ? 'bg-green-500' : 'bg-gray-700'
                                        }`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Step 1: Cart Review */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-700">
                                        <Package size={24} className="text-gold" />
                                        <h2 className="text-2xl font-serif text-white">Votre Panier ({cartCount} articles)</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                                                <img
                                                    src={item.image || 'https://placehold.co/80x80/1E1B18/Cca43b?text=Image'}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-white font-medium">{item.name}</h3>
                                                    <p className="text-sm text-gray-400">{item.category}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Quantité: {item.quantity}</p>
                                                </div>
                                                <p className="text-gold font-bold text-lg">
                                                    {(item.price * item.quantity).toFixed(2)} €
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle size={24} className="text-blue-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-serif text-lg text-white mb-2">Livraison Locale</h3>
                                            <p className="text-sm text-blue-300 leading-relaxed">
                                                Vos produits seront livrés personnellement dans un rayon de 15 km autour de Metz.
                                                Codes postaux éligibles: {ELIGIBLE_POSTCODES.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Delivery & Payment */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-700">
                                        <MapPin size={24} className="text-gold" />
                                        <h2 className="text-2xl font-serif text-white">Informations de Livraison</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                                                Adresse complète *
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={deliveryData.address}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                                placeholder="12 rue de la Gare"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                                                    Ville *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={deliveryData.city}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                                    placeholder="Metz"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">
                                                    Code Postal *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    name="postalCode"
                                                    value={deliveryData.postalCode}
                                                    onChange={handleChange}
                                                    required
                                                    maxLength={5}
                                                    className={`w-full px-4 py-3 bg-[#1E1B18] border rounded text-white placeholder-gray-500 focus:outline-none ${
                                                        isEligible
                                                            ? 'border-green-500 focus:border-green-400'
                                                            : deliveryData.postalCode.length === 5
                                                                ? 'border-red-500 focus:border-red-400'
                                                                : 'border-gray-600 focus:border-gold'
                                                    }`}
                                                    placeholder="57000"
                                                />
                                                {isEligible && (
                                                    <p className="text-xs text-green-400 mt-1 flex items-center space-x-1">
                                                        <CheckCircle size={12} />
                                                        <span>Zone éligible à la livraison</span>
                                                    </p>
                                                )}
                                                {!isEligible && deliveryData.postalCode.length === 5 && (
                                                    <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                                                        <AlertCircle size={12} />
                                                        <span>Zone non couverte. CP éligibles: {ELIGIBLE_POSTCODES.join(', ')}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                                Téléphone *
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={deliveryData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                                placeholder="06 12 34 56 78"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                                                Instructions de livraison (optionnel)
                                            </label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                value={deliveryData.notes}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                                placeholder="Code d'accès, étage, etc."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-700">
                                        <CreditCard size={24} className="text-gold" />
                                        <h2 className="text-2xl font-serif text-white">Mode de Paiement</h2>
                                    </div>

                                    <div className="space-y-3">
                                        <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            deliveryData.paymentMethod === 'cash'
                                                ? 'border-gold bg-gold/10'
                                                : 'border-gray-600 hover:border-gray-500'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cash"
                                                checked={deliveryData.paymentMethod === 'cash'}
                                                onChange={handleChange}
                                                className="mt-1 text-gold focus:ring-gold"
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-2xl">💶</span>
                                                    <span className="text-white font-semibold">Paiement à la livraison</span>
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    Espèces ou carte bancaire lors de la livraison
                                                </p>
                                            </div>
                                        </label>

                                        <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            deliveryData.paymentMethod === 'card'
                                                ? 'border-gold bg-gold/10'
                                                : 'border-gray-600 hover:border-gray-500'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={deliveryData.paymentMethod === 'card'}
                                                onChange={handleChange}
                                                className="mt-1 text-gold focus:ring-gold"
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-2xl">💳</span>
                                                    <span className="text-white font-semibold">Paiement en ligne par carte</span>
                                                    <span className="px-2 py-0.5 bg-green-500/20 border border-green-500 text-green-300 text-xs rounded-full">
                                                        Disponible
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    Visa, Mastercard, American Express
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-700">
                                        <CheckCircle size={24} className="text-gold" />
                                        <h2 className="text-2xl font-serif text-white">Récapitulatif</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Livraison</h3>
                                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                                <p className="text-white font-medium">{deliveryData.address}</p>
                                                <p className="text-gray-400 text-sm">{deliveryData.postalCode} {deliveryData.city}</p>
                                                <p className="text-gray-400 text-sm mt-2">📞 {deliveryData.phone}</p>
                                                {deliveryData.notes && (
                                                    <p className="text-gray-500 text-xs mt-2 italic">Note: {deliveryData.notes}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Articles ({cartCount})</h3>
                                            <div className="space-y-2">
                                                {cartItems.map((item) => (
                                                    <div key={item.id} className="flex justify-between text-sm bg-gray-800/50 p-3 rounded">
                                                        <span className="text-gray-300">{item.quantity}x {item.name}</span>
                                                        <span className="text-gold font-bold">{(item.price * item.quantity).toFixed(2)} €</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-gray-700">
                                        <CreditCard size={24} className="text-gold" />
                                        <h2 className="text-2xl font-serif text-white">Mode de Paiement</h2>
                                    </div>

                                    {/* Paiement à la livraison */}
                                    {deliveryData.paymentMethod === 'cash' && (
                                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-2xl">💶</span>
                                                <p className="text-green-300 text-sm font-semibold">
                                                    Paiement à la livraison
                                                </p>
                                            </div>
                                            <p className="text-xs text-green-400">
                                                Vous pourrez régler en espèces ou par carte bancaire lors de la livraison.
                                            </p>
                                        </div>
                                    )}

                                    {/* Paiement par carte — Stripe */}
                                    {deliveryData.paymentMethod === 'card' && (
                                        <div>
                                            {isLoadingPayment && (
                                                <div className="flex items-center gap-3 py-6 text-gray-400">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold" />
                                                    <span className="text-sm">Chargement du formulaire de paiement…</span>
                                                </div>
                                            )}
                                            {!isLoadingPayment && clientSecret && (
                                                <Elements
                                                    stripe={stripePromise}
                                                    options={{ clientSecret, appearance: { theme: 'night' } }}
                                                >
                                                    <StripePaymentForm
                                                        clientSecret={clientSecret}
                                                        total={cartTotal}
                                                        onSuccess={handleStripeSuccess}
                                                        onError={(msg) => setError(msg)}
                                                    />
                                                </Elements>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700 sticky top-24">
                            <h3 className="font-serif text-xl text-white mb-4 pb-4 border-b border-gray-700">
                                Récapitulatif
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Sous-total ({cartCount} articles)</span>
                                    <span>{cartTotal.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Livraison</span>
                                    <span className="text-green-400 font-medium">Gratuite</span>
                                </div>
                                <div className="border-t border-gray-700 pt-3 mt-3"></div>
                                <div className="flex justify-between text-white font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-gold">{cartTotal.toFixed(2)} €</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {currentStep < 3 && (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={currentStep === 2 && !canProceedToStep2}
                                        className="w-full py-4 bg-gold text-dark font-bold uppercase tracking-wider rounded hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <span>{currentStep === 1 ? 'Continuer' : 'Étape suivante'}</span>
                                        <ArrowRight size={18} />
                                    </button>
                                )}

                                {currentStep === 3 && deliveryData.paymentMethod === 'cash' && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isProcessing}
                                        className="w-full py-4 bg-gold text-dark font-bold uppercase tracking-wider rounded hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? 'Traitement en cours...' : 'Confirmer la Commande'}
                                    </button>
                                )}

                                {currentStep > 1 && (
                                    <button
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="w-full py-3 border-2 border-gray-600 text-gray-300 font-medium rounded hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <ChevronLeft size={18} />
                                        <span>Étape précédente</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};