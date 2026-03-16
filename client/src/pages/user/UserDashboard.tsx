import { useContext, useEffect, useState } from 'react';
import { UserLayout } from '../../components/user/UserLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { Package, MapPin, ShoppingBag, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [orderCount, setOrderCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3000/api/user/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrderCount(response.data.length);
            } catch {
                setOrderCount(0);
            }
        };
        fetchOrderCount();
    }, []);

    const hasAddress = !!user?.address && !!user?.postalCode;

    return (
        <UserLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-serif text-white mb-2">
                        Bienvenue, {user?.firstName || user?.email?.split('@')[0]} !
                    </h2>
                    <p className="text-gray-400">Gérez votre compte et vos commandes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Commandes */}
                    <Link
                        to="/account/orders"
                        className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gold/30 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Commandes</p>
                                <p className="text-3xl font-bold mt-1 text-blue-400">
                                    {orderCount === null ? (
                                        <span className="inline-block h-7 w-6 bg-gray-700 rounded animate-pulse" />
                                    ) : orderCount}
                                </p>
                            </div>
                            <Package size={32} className="text-blue-400" />
                        </div>
                    </Link>

                    {/* Adresse */}
                    <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-400 mb-1">Adresse de livraison</p>
                                {hasAddress ? (
                                    <div className="mt-1 space-y-0.5">
                                        <p className="text-white font-medium truncate">{user.address}</p>
                                        <p className="text-gray-300 text-sm">
                                            {user.postalCode} {user.city}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-yellow-400 text-sm mt-1">Non configurée</p>
                                )}
                            </div>
                            <MapPin size={28} className={hasAddress ? 'text-green-400 shrink-0' : 'text-yellow-400 shrink-0'} />
                        </div>
                        <Link
                            to="/account/address"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
                        >
                            <PenLine size={12} />
                            {hasAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
                        </Link>
                    </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <ShoppingBag size={24} className="text-blue-400 flex-shrink-0" />
                        <div>
                            <h3 className="font-serif text-lg text-white mb-2">Commencer vos achats</h3>
                            <p className="text-sm text-gray-300 mb-4">
                                Découvrez notre sélection de produits espagnols artisanaux
                            </p>
                            <Link
                                to="/boutique"
                                className="inline-block px-6 py-2 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors"
                            >
                                Voir la boutique
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};
