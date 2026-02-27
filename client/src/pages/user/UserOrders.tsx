import { useEffect, useState } from 'react';
import { UserLayout } from '../../components/user/UserLayout';
import { Package, Clock, CheckCircle, XCircle, ShoppingBag, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Order {
    id: number;
    status: string;
    total: number;
    items: string;
    deliveryAddress: string;
    postalCode: string;
    deliveryTimeSlot: string | null;
    deliveryDate: string | null;
    createdAt: string;
}

export const UserOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3000/api/user/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to load orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'en_attente':
                return {
                    bg: 'bg-yellow-900/20',
                    border: 'border-yellow-500',
                    text: 'text-yellow-300',
                    label: 'En attente',
                    icon: Clock
                };
            case 'en_preparation':
                return {
                    bg: 'bg-blue-900/20',
                    border: 'border-blue-500',
                    text: 'text-blue-300',
                    label: 'En préparation',
                    icon: Package
                };
            case 'pret_pour_livraison':
                return {
                    bg: 'bg-green-900/20',
                    border: 'border-green-500',
                    text: 'text-green-300',
                    label: 'Prêt pour livraison',
                    icon: Truck
                };
            case 'livre':
                return {
                    bg: 'bg-gray-900/20',
                    border: 'border-gray-500',
                    text: 'text-gray-300',
                    label: 'Livré',
                    icon: CheckCircle
                };
            case 'annule':
                return {
                    bg: 'bg-red-900/20',
                    border: 'border-red-500',
                    text: 'text-red-300',
                    label: 'Annulé',
                    icon: XCircle
                };
            default:
                return {
                    bg: 'bg-gray-900/20',
                    border: 'border-gray-500',
                    text: 'text-gray-300',
                    label: status,
                    icon: Package
                };
        }
    };

    if (isLoading) {
        return (
            <UserLayout>
                <div className="text-center py-12">
                    <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement de vos commandes...</p>
                </div>
            </UserLayout>
        );
    }

    if (orders.length === 0) {
        return (
            <UserLayout>
                <div className="text-center py-12">
                    <ShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
                    <h2 className="text-2xl font-serif text-white mb-2">Aucune commande</h2>
                    <p className="text-gray-400 mb-6">Vous n'avez pas encore passé de commande</p>
                    <Link
                        to="/boutique"
                        className="inline-block px-6 py-3 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors"
                    >
                        Découvrir nos produits
                    </Link>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-700">
                    <Package size={24} className="text-gold" />
                    <h2 className="text-2xl font-serif text-white">Mes Commandes</h2>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => {
                        const statusBadge = getStatusBadge(order.status);
                        const StatusIcon = statusBadge.icon;
                        const items = JSON.parse(order.items);

                        return (
                            <div
                                key={order.id}
                                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-gold/30 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Commande #{order.id}</p>
                                        <p className="text-white font-semibold">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className={`mt-2 md:mt-0 inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.border}`}>
                                        <StatusIcon size={16} className={statusBadge.text} />
                                        <span className={`text-sm font-medium ${statusBadge.text}`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Info Livraison (se disponibile) */}
                                {order.deliveryDate && order.deliveryTimeSlot && (
                                    <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Truck size={18} className="text-green-400" />
                                            <p className="text-green-300 font-semibold text-sm">
                                                Livraison programmée
                                            </p>
                                        </div>
                                        <p className="text-green-200 text-sm">
                                            📅 {new Date(order.deliveryDate).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                        </p>
                                        <p className="text-green-200 text-sm">
                                            🕐 {order.deliveryTimeSlot}
                                        </p>
                                    </div>
                                )}

                                <div className="border-t border-gray-700 pt-4 mt-4">
                                    <p className="text-sm text-gray-400 mb-2">Articles ({items.length})</p>
                                    <div className="space-y-2">
                                        {items.map((item: any, index: number) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-300">{item.quantity}x {item.name}</span>
                                                <span className="text-gold">{(item.price * item.quantity).toFixed(2)} €</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between items-center">
                                    <div className="text-sm text-gray-400">
                                        <p>Livraison: {order.deliveryAddress}</p>
                                        <p>Code postal: {order.postalCode}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Total</p>
                                        <p className="text-2xl font-bold text-gold">{order.total.toFixed(2)} €</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </UserLayout>
    );
};