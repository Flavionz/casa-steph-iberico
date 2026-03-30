import { useEffect, useState } from 'react';
import { UserLayout } from '../../components/user/UserLayout';
import { Package, Clock, CheckCircle, XCircle, ShoppingBag, Truck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';

interface Order {
    id: number;
    status: string;
    total: number;
    invoiceNumber: string | null;
    paymentStatus: string | null;
    createdAt: string;
}

export const UserOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${API_URL}/user/orders`, {
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
                return { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-300', label: 'En attente', icon: Clock };
            case 'en_preparation':
                return { bg: 'bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-300', label: 'En préparation', icon: Package };
            case 'pret_pour_livraison':
                return { bg: 'bg-green-900/20', border: 'border-green-500', text: 'text-green-300', label: 'Prêt pour livraison', icon: Truck };
            case 'livre':
                return { bg: 'bg-gray-900/20', border: 'border-gray-500', text: 'text-gray-300', label: 'Livré', icon: CheckCircle };
            case 'annule':
                return { bg: 'bg-red-900/20', border: 'border-red-500', text: 'text-red-300', label: 'Annulé', icon: XCircle };
            default:
                return { bg: 'bg-gray-900/20', border: 'border-gray-500', text: 'text-gray-300', label: status, icon: Package };
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

                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Référence</div>
                    <div className="col-span-3">Date</div>
                    <div className="col-span-2 text-right">Montant</div>
                    <div className="col-span-3">Statut</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Rows */}
                <div className="space-y-2">
                    {orders.map((order) => {
                        const statusBadge = getStatusBadge(order.status);
                        const StatusIcon = statusBadge.icon;

                        return (
                            <Link
                                key={order.id}
                                to={`/account/orders/${order.id}`}
                                className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center px-4 py-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gold/40 hover:bg-gray-800 transition-all group"
                            >
                                {/* REF */}
                                <div className="col-span-1 md:col-span-3">
                                    <p className="text-xs text-gray-500 md:hidden">Référence</p>
                                    <p className="text-white font-mono text-sm font-medium">
                                        #{String(order.id).padStart(4, '0')}
                                    </p>
                                    {order.invoiceNumber && (
                                        <p className="text-xs text-gray-500">{order.invoiceNumber}</p>
                                    )}
                                </div>

                                {/* Date */}
                                <div className="col-span-1 md:col-span-3">
                                    <p className="text-xs text-gray-500 md:hidden">Date</p>
                                    <p className="text-gray-300 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {/* Montant */}
                                <div className="col-span-1 md:col-span-2 md:text-right">
                                    <p className="text-xs text-gray-500 md:hidden">Montant</p>
                                    <p className="text-gold font-bold">{order.total.toFixed(2)} €</p>
                                </div>

                                {/* Statut */}
                                <div className="col-span-1 md:col-span-3">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}>
                                        <StatusIcon size={12} />
                                        {statusBadge.label}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="hidden md:flex col-span-1 justify-end">
                                    <ChevronRight size={18} className="text-gray-600 group-hover:text-gold transition-colors" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </UserLayout>
    );
};
