import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Package, Users, ShoppingBag, Image, LogOut } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Tableau de Bord',
      icon: LayoutDashboard
    },
    {
      path: '/admin/add-product',
      label: 'Ajouter un Produit',
      icon: PlusCircle
    },
    {
      path: '/admin/products',
      label: 'Gérer les Produits',
      icon: Package
    },
    {
      path: '/admin/featured',
      label: 'Gestion Vitrine',
      icon: Image
    },
    {
      path: '/admin/orders',
      label: 'Commandes',
      icon: ShoppingBag
    },
    {
      path: '/admin/users',
      label: 'Utilisateurs',
      icon: Users
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };

  return (
      <aside className="w-64 bg-dark border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="block group">
            <h2 className="font-serif text-xl text-white group-hover:text-gold transition-colors">
              L'Auberge Espagnole
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
              Administration
            </p>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                  <li key={item.path}>
                    <Link
                        to={item.path}
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

        <div className="p-4 border-t border-gray-800">
          <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-all duration-200 group"
          >
            <LogOut size={20} className="text-gray-500 group-hover:text-red-400" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>
  );
};