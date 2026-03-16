import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, Home, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

interface UserLayoutProps {
    children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/account', label: 'Mon Compte', icon: LayoutDashboard },
        { path: '/account/profile', label: 'Mes Informations', icon: User },
        { path: '/account/orders', label: 'Mes Commandes', icon: Package },
        { path: '/account/address', label: 'Mon Adresse', icon: MapPin },
        { path: '/account/settings', label: 'Paramètres', icon: Settings },
    ];

    const handleLogout = () => {
        if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
            logout();
            navigate('/');
        }
    };

    const displayName = user?.firstName && user?.lastName
        ? `${user.civility ? user.civility + ' ' : ''}${user.firstName} ${user.lastName}`
        : user?.email;

    const avatarLetter = (user?.firstName || user?.email || '?').charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-[#1E1B18] pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors mb-4"
                    >
                        <Home size={18} />
                        Retour à l'accueil
                    </Link>
                    <h1 className="font-serif text-4xl text-white mb-2">Mon Espace</h1>
                    <div className="w-20 h-0.5 bg-gold"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1">
                        <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                            {/* Avatar */}
                            <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-700">
                                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                                    <span className="text-gold font-bold text-lg">{avatarLetter}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                                    {user?.firstName && (
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    )}
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all ${
                                                isActive
                                                    ? 'bg-gold/10 text-gold border-l-4 border-gold'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border-l-4 border-transparent'
                                            }`}
                                        >
                                            <Icon size={18} />
                                            <span className="text-sm">{item.label}</span>
                                        </Link>
                                    );
                                })}

                                <div className="pt-4 mt-4 border-t border-gray-700 space-y-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-all"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-sm">Déconnexion</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    <main className="md:col-span-3">
                        <div className="bg-[#2C2C2C] rounded-lg p-6 border border-gray-700">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
