import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, ShoppingBag, Home } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

interface OrderData {
    orderId: number;
    total: number;
    items: Array<{
        id: number;
        name: string;
        quantity: number;
        price: number;
    }>;
    deliveryAddress: string;
    postalCode: string;
    phone: string;
    paymentMethod: string;
}

export const OrderConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState<OrderData | null>(null);

    useEffect(() => {
        if (location.state?.orderData) {
            setOrderData(location.state.orderData);
        } else {
            navigate('/');
        }
    }, [location, navigate]);

    if (!orderData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#1E1B18] flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
                            <CheckCircle size={48} className="text-white" />
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
                            Commande Confirmée !
                        </h1>
                        <p className="text-xl text-gray-300 mb-2">
                            Merci pour votre commande
                        </p>
                        <p className="text-gold font-semibold text-2xl">
                            N° {orderData.orderId}
                        </p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-8 mb-8">
                        <h2 className="font-serif text-2xl text-white mb-6 flex items-center space-x-2">
                            <Package className="text-gold" size={24} />
                            <span>Détails de votre commande</span>
                        </h2>

                        <div className="space-y-4 mb-6">
                            {orderData.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-4">
                                    <div>
                                        <p className="text-white font-medium">{item.name}</p>
                                        <p className="text-gray-400 text-sm">Quantité: {item.quantity}</p>
                                    </div>
                                    <p className="text-gold font-semibold">
                                        {(item.price * item.quantity).toFixed(2)} €
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                            <span className="text-white text-xl font-semibold">Total</span>
                            <span className="text-gold text-2xl font-bold">
                {orderData.total.toFixed(2)} €
              </span>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-8 mb-8">
                        <h2 className="font-serif text-2xl text-white mb-6 flex items-center space-x-2">
                            <Truck className="text-gold" size={24} />
                            <span>Informations de livraison</span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Adresse</p>
                                <p className="text-white">{orderData.deliveryAddress}</p>
                                <p className="text-white">{orderData.postalCode}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Téléphone</p>
                                <p className="text-white">{orderData.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Mode de paiement</p>
                                <p className="text-white">
                                    {orderData.paymentMethod === 'cash' ? 'Espèces à la livraison' : 'Lien de paiement (envoyé par Stéphane)'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-8 mb-8">
                        <h2 className="font-serif text-2xl text-white mb-6 flex items-center space-x-2">
                            <Clock className="text-blue-400" size={24} />
                            <span>Prochaines étapes</span>
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                                <div>
                                    <p className="text-white font-medium">Confirmation par email</p>
                                    <p className="text-gray-300 text-sm">Vous recevrez un récapitulatif de votre commande dans quelques minutes.</p>
                                </div>
                            </div>

                            {orderData.paymentMethod !== 'cash' && (
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                                    <div>
                                        <p className="text-white font-medium">Lien de paiement</p>
                                        <p className="text-gray-300 text-sm">Stéphane vous enverra un lien de paiement sécurisé dès que votre commande sera validée.</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {orderData.paymentMethod !== 'cash' ? '3' : '2'}
                                </div>
                                <div>
                                    <p className="text-white font-medium">Préparation de votre commande</p>
                                    <p className="text-gray-300 text-sm">Vos produits sont préparés avec soin après confirmation du paiement.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {orderData.paymentMethod !== 'cash' ? '4' : '3'}
                                </div>
                                <div>
                                    <p className="text-white font-medium">Créneau de livraison</p>
                                    <p className="text-gray-300 text-sm">Vous recevrez un email avec la date et le créneau horaire de livraison.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {orderData.paymentMethod !== 'cash' ? '5' : '4'}
                                </div>
                                <div>
                                    <p className="text-white font-medium">Livraison à domicile</p>
                                    <p className="text-gray-300 text-sm">Stéphane livre directement à votre adresse.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/account/orders"
                            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors"
                        >
                            <Package size={20} />
                            <span>Voir mes commandes</span>
                        </Link>

                        <Link
                            to="/boutique"
                            className="inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-gold text-gold font-bold rounded hover:bg-gold/10 transition-colors"
                        >
                            <ShoppingBag size={20} />
                            <span>Continuer mes achats</span>
                        </Link>

                        <Link
                            to="/"
                            className="inline-flex items-center justify-center space-x-2 px-8 py-4 border border-gray-600 text-gray-300 font-bold rounded hover:bg-gray-800 transition-colors"
                        >
                            <Home size={20} />
                            <span>Retour à l'accueil</span>
                        </Link>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-400 text-sm mb-2">
                            Une question sur votre commande ?
                        </p>
                        <p className="text-gold font-medium">
                            Contactez-nous : lauberge.espagnole.metz@gmail.com
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};