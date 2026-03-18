import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout.tsx';
import { Shield, User, Mail, Calendar, Phone, MapPin, ShoppingBag, X, ChevronRight, Package } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config/api';

interface UserSummary {
    id: number;
    email: string;
    role: string;
    civility: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    createdAt: string;
    _count: { orders: number };
}

interface Order {
    id: number;
    status: string;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
}

interface UserDetail extends UserSummary {
    address: string | null;
    city: string | null;
    postalCode: string | null;
    orders: Order[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    en_attente:          { label: 'En attente',         color: 'bg-yellow-100 text-yellow-800' },
    en_preparation:      { label: 'En préparation',     color: 'bg-blue-100 text-blue-800' },
    pret_pour_livraison: { label: 'Prêt à livrer',      color: 'bg-purple-100 text-purple-800' },
    livre:               { label: 'Livré',               color: 'bg-green-100 text-green-800' },
    annule:              { label: 'Annulé',              color: 'bg-red-100 text-red-800' },
};

export const UsersPage = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
    const [isPanelLoading, setIsPanelLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openUserPanel = async (id: number) => {
        setIsPanelLoading(true);
        setSelectedUser(null);
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_URL}/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedUser(res.data);
        } catch (error) {
            console.error('Failed to fetch user detail:', error);
        } finally {
            setIsPanelLoading(false);
        }
    };

    const displayName = (u: UserSummary | UserDetail) => {
        if (u.firstName || u.lastName) {
            return `${u.civility ? u.civility + ' ' : ''}${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
        }
        return u.email;
    };

    const stats = [
        { label: 'Total utilisateurs', value: users.length, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Administrateurs', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Clients avec commandes', value: users.filter(u => u._count.orders > 0).length, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des utilisateurs...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-3xl font-serif text-gray-800">Gestion des Utilisateurs</h2>
                    <p className="text-sm text-gray-500 mt-1">{users.length} utilisateur(s) enregistré(s)</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="p-5 rounded-lg shadow-sm bg-white border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bg}`}>
                                        <Icon size={22} className={stat.color} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => openUserPanel(user.id)}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:border-gold hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                                    }`}>
                                        {user.role === 'admin'
                                            ? <Shield size={18} className="text-purple-600" />
                                            : <User size={18} className="text-blue-600" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm leading-tight">
                                            {displayName(user)}
                                        </p>
                                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                                            user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user.role === 'admin' ? 'Admin' : 'Client'}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-gold transition-colors mt-1 flex-shrink-0" />
                            </div>

                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-1.5">
                                <Mail size={12} className="flex-shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </p>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar size={11} />
                                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                                <span className={`text-xs font-semibold flex items-center gap-1 ${
                                    user._count.orders > 0 ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                    <Package size={11} />
                                    {user._count.orders} commande{user._count.orders !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Slide panel */}
            {(selectedUser || isPanelLoading) && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setSelectedUser(null)}
                    />

                    {/* Panel */}
                    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

                        {/* Panel header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                            <h3 className="font-serif text-lg text-gray-800">
                                {selectedUser ? displayName(selectedUser) : 'Chargement...'}
                            </h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {isPanelLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
                            </div>
                        ) : selectedUser && (
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                                {/* Profil */}
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                        Profil
                                    </h4>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                selectedUser.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                                            }`}>
                                                {selectedUser.role === 'admin'
                                                    ? <Shield size={16} className="text-purple-600" />
                                                    : <User size={16} className="text-blue-600" />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{displayName(selectedUser)}</p>
                                                <p className="text-xs text-gray-500">{selectedUser.role === 'admin' ? 'Administrateur' : 'Client'}</p>
                                            </div>
                                        </div>
                                        <InfoRow icon={<Mail size={14} />} value={selectedUser.email} />
                                        {selectedUser.phone && <InfoRow icon={<Phone size={14} />} value={selectedUser.phone} />}
                                        {(selectedUser.address || selectedUser.city) && (
                                            <InfoRow
                                                icon={<MapPin size={14} />}
                                                value={[selectedUser.address, selectedUser.postalCode, selectedUser.city].filter(Boolean).join(', ')}
                                            />
                                        )}
                                        <InfoRow
                                            icon={<Calendar size={14} />}
                                            value={`Inscrit le ${new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                                        />
                                    </div>
                                </section>

                                {/* Commandes */}
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                        Commandes ({selectedUser.orders.length})
                                    </h4>
                                    {selectedUser.orders.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">Aucune commande</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedUser.orders.map((order) => {
                                                const s = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' };
                                                return (
                                                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                                        <div>
                                                            <p className="font-medium text-gray-800">#{order.id}</p>
                                                            <p className="text-xs text-gray-400">
                                                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900">{order.total.toFixed(2)} €</p>
                                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>
                                                                {s.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

const InfoRow = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
    <div className="flex items-start gap-2.5 text-sm text-gray-600">
        <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
        <span>{value}</span>
    </div>
);
