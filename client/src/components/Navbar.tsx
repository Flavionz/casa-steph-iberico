import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-dark/95 backdrop-blur-sm py-3 shadow-md' : 'bg-transparent py-5'
      }`}>
        <div className="container-custom flex items-center justify-between">
          {/* Logo + Brand Name */}
          <Link to="/" className="flex items-center space-x-3">
            <img
                src="/logo.png"
                alt="L'Auberge Espagnole Logo"
                className="h-10 w-auto"
            />
            <span className="font-serif text-xl md:text-2xl text-white">
            L'Auberge Espagnole
          </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActive('/') ? 'border-b border-gold pb-1' : ''}`}>
              Accueil
            </Link>
            <Link to="/boutique" className={`nav-link ${isActive('/boutique') ? 'border-b border-gold pb-1' : ''}`}>
              Boutique
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'border-b border-gold pb-1' : ''}`}>
              Notre Histoire
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-300 hover:text-gold transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
              )}
            </Link>
            <Link
                to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/account') : '/login'}
                className="flex items-center space-x-2 text-gray-300 hover:text-gold transition-colors"
            >
              <User size={20} />
              <span className="text-sm tracking-wider">
              {user ? "Mon Compte" : "Compte"}
            </span>
            </Link>
          </div>

          <button className="md:hidden text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
            <div className="md:hidden bg-darkAccent absolute top-full left-0 right-0 py-4 px-4 shadow-lg">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="nav-link py-2 border-b border-gray-700" onClick={() => setMobileMenuOpen(false)}>
                  Accueil
                </Link>
                <Link to="/boutique" className="nav-link py-2 border-b border-gray-700" onClick={() => setMobileMenuOpen(false)}>
                  Boutique
                </Link>
                <Link to="/about" className="nav-link py-2 border-b border-gray-700" onClick={() => setMobileMenuOpen(false)}>
                  Notre Histoire
                </Link>
                <div className="flex items-center justify-between pt-2">
                  <Link to="/cart" className="flex items-center space-x-2 text-gray-300 relative" onClick={() => setMobileMenuOpen(false)}>
                    <ShoppingCart size={20} />
                    <span className="text-sm">Panier</span>
                    {cartCount > 0 && (
                        <span className="bg-gold text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                    )}
                  </Link>
                  <Link
                      to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/account') : '/login'}
                      className="flex items-center space-x-2 text-gray-300"
                      onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    <span className="text-sm">
                  {user ? "Mon Compte" : "Compte"}
                </span>
                  </Link>
                </div>
              </div>
            </div>
        )}
      </nav>
  );
};