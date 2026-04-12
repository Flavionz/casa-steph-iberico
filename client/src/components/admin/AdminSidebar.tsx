import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Package, Users, ShoppingBag, Image, LogOut, X, Home } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const navItems = [
        { path: '/admin/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
        { path: '/admin/add-product', label: 'Ajouter un Produit', icon: PlusCircle },
        { path: '/admin/products', label: 'Gérer les Produits', icon: Package },
        { path: '/admin/featured', label: 'Gestion Vitrine', icon: Image },
        { path: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
        { path: '/admin/users', label: 'Utilisateurs', icon: Users },
    ];

    const handleLogout = () => {
        if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-dark border-r border-gray-800 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:z-auto
            `}
        >
            {/* Header sidebar */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <Link to="/" className="block group" onClick={onClose}>
                    <h2 className="font-serif text-xl text-white group-hover:text-gold transition-colors">
                        Casa Steph Iberico
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                        Administration
                    </p>
                </Link>
                {/* Close button — mobile only */}
                <button
                    onClick={onClose}
                    className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
                    aria-label="Fermer le menu"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={onClose}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-gold/10 text-gold border-l-4 border-gold'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border-l-4 border-transparent'
                                    }`}
                                >
                                    <Icon
                                        size={20}
                                        className={isActive ? 'text-gold' : 'text-gray-500 group-hover:text-white'}
                                    />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Retour accueil + Logout */}
            <div className="p-4 border-t border-gray-800">
                <Link
                    to="/"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-gold hover:bg-gold/10 rounded-md transition-all duration-200 group mb-1"
                >
                    <Home size={20} className="text-gray-500 group-hover:text-gold" />
                    <span className="text-sm font-medium">Retour à l'accueil</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-all duration-200 group border-t border-gray-800 pt-3 mt-1"
                >
                    <LogOut size={20} className="text-gray-500 group-hover:text-red-400" />
                    <span className="text-sm font-medium">Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};
