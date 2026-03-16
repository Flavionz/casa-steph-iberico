import { Instagram, Facebook, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
      <footer className="bg-dark py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              {/* Logo + Brand */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                    src="/logo.png"
                    alt="L'Auberge Espagnole Logo"
                    className="h-12 w-auto"
                />
                <h3 className="font-serif text-xl text-gold">
                  L'Auberge Espagnole
                </h3>
              </div>
              <p className="text-gray-400 text-sm">
                L'excellence des produits espagnols, livrés chez vous.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                lauberge.espagnole.metz@gmail.com
              </p>
            </div>

            <div>
              <h4 className="text-white text-sm uppercase tracking-wider mb-4">
                Informations
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/mentions" className="text-gray-400 text-sm hover:text-gold transition-colors">
                    Mentions Légales
                  </Link>
                </li>
                <li>
                  <Link to="/cgv" className="text-gray-400 text-sm hover:text-gold transition-colors">
                    Conditions Générales de Vente
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 text-sm hover:text-gold transition-colors">
                    Politique de Confidentialité
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm uppercase tracking-wider mb-4">
                Suivez-nous
              </h4>
              <div className="flex space-x-4 mb-6">
                <a href="https://www.facebook.com/Epicerielaubergeespagnole" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-gold transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com/placeholder" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-gold transition-colors">
                  <Instagram size={20} />
                </a>
              </div>

              <h4 className="text-white text-sm uppercase tracking-wider mb-4">
                Contactez-nous
              </h4>
              <a href="https://wa.me/33XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-gray-400 hover:text-gold transition-colors group">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <Phone size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} L'Auberge Espagnole made by Flavio Terenzi. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
  );
};