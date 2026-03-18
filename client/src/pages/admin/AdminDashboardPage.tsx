import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Package, ShoppingCart, DollarSign, Users, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config/api';


interface RecentOrder {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    user: {
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
}

interface DashboardStats {
    totalProducts: number;
    pendingOrders: number;
    monthlySales: number;
    newUsersThisMonth: number;
    lowStockProducts: number;
    recentOrders: RecentOrder[];
}

const STATUS_LABELS: Record<string, string> = {
    en_attente: 'En Attente',
    en_preparation: 'En Préparation',
    pret_pour_livraison: 'Prêt pour Livraison',
    livre: 'Livré',
    annule: 'Annulé',
};

const STATUS_COLORS: Record<string, string> = {
    en_attente: 'bg-yellow-100 text-yellow-800',
    en_preparation: 'bg-blue-100 text-blue-800',
    pret_pour_livraison: 'bg-purple-100 text-purple-800',
    livre: 'bg-green-100 text-green-800',
    annule: 'bg-red-100 text-red-800',
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
}

export const AdminDashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${API_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(response.data);
            } catch {
                setError('Impossible de charger les statistiques.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800" />
                </div>
            </AdminLayout>
        );
    }

    if (error || !stats) {
        return (
            <AdminLayout>
                <div className="text-center py-16 text-red-600">{error}</div>
            </AdminLayout>
        );
    }

    const statCards = [
        {
            label: 'Produits Totaux',
            value: stats.totalProducts,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Commandes en Attente',
            value: stats.pendingOrders,
            icon: ShoppingCart,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
        },
        {
            label: 'Ventes du Mois',
            value: `€ ${stats.monthlySales.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Nouveaux Clients',
            value: stats.newUsersThisMonth,
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <h2 className="text-3xl font-serif text-gray-800">Dashboard</h2>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="p-6 rounded-lg shadow-lg bg-white border border-gray-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bg}`}>
                                        <Icon size={24} className={stat.color} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Low stock alert */}
                {stats.lowStockProducts > 0 && (
                    <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-5 py-4">
                        <AlertTriangle size={20} className="text-orange-500 shrink-0" />
                        <p className="text-sm text-orange-800">
                            <span className="font-semibold">{stats.lowStockProducts} produit{stats.lowStockProducts > 1 ? 's' : ''}</span> en stock faible (≤ 5 unités).
                        </p>
                    </div>
                )}

                {/* Recent orders */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Commandes Récentes
                    </h3>
                    {stats.recentOrders.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Aucune commande pour le moment.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {stats.recentOrders.map((order) => {
                                const name = order.user.firstName
                                    ? `${order.user.firstName} ${order.user.lastName ?? ''}`.trim()
                                    : order.user.email;
                                return (
                                    <li key={order.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-sm font-medium text-gray-700 shrink-0">
                                                #{order.id}
                                            </span>
                                            <span className="text-sm text-gray-500 truncate">{name}</span>
                                            <span className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {STATUS_LABELS[order.status] ?? order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="text-sm font-semibold text-gray-800">
                                                € {order.total.toFixed(2)}
                                            </span>
                                            <span className="text-xs text-gray-400">{timeAgo(order.createdAt)}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};
