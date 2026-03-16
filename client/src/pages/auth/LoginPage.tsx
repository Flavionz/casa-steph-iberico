import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { user, isAdmin, login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from || '/boutique';

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, isAdmin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas.");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          setIsLoading(false);
          return;
        }

        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Link to="/" className="block text-center mb-8">
            <h1 className="font-serif text-3xl text-white mb-2">
              L'Auberge Espagnole
            </h1>
            <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          </Link>

          <div className="bg-darkAccent border border-gold/30 rounded-sm p-8 shadow-2xl">
            <h2 className="font-serif text-2xl text-white mb-2 text-center">
              {isRegistering ? 'Créer un compte' : 'Connexion'}
            </h2>
            <p className="text-gray-400 text-sm text-center mb-8">
              {isRegistering
                  ? 'Rejoignez notre communauté de gourmets'
                  : 'Accédez à votre espace personnel'}
            </p>

            {error && (
                <div className="text-sm p-3 mb-4 rounded bg-red-800/20 border border-red-500 text-red-300 text-center">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-300 mb-2 tracking-wide">
                  Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-600 text-white py-2 px-1 focus:outline-none focus:border-gold transition-colors duration-300"
                    placeholder="votre@email.com"
                    required
                    disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-300 mb-2 tracking-wide">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-600 text-white py-2 px-1 pr-8 focus:outline-none focus:border-gold transition-colors duration-300"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                  >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isRegistering && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-2 tracking-wide">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="w-full bg-transparent border-b border-gray-600 text-white py-2 px-1 pr-8 focus:outline-none focus:border-gold transition-colors duration-300"
                          placeholder="••••••••"
                          required
                          disabled={isLoading}
                      />
                      <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                          tabIndex={-1}
                      >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
              )}

              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gold hover:bg-gold/90 text-dark font-medium py-3 rounded-sm transition-colors duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                    ? (isRegistering ? 'Création...' : 'Connexion...')
                    : (isRegistering ? 'Créer mon compte' : 'Se connecter')}
              </button>
            </form>

            {!isRegistering && (
                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gold transition-colors">
                        Mot de passe oublié ?
                    </Link>
                </div>
            )}

            <div className="mt-6 text-center">
              <button
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                  className="text-sm text-gray-400 hover:text-gold transition-colors duration-300"
                  disabled={isLoading}
              >
                {isRegistering
                    ? 'Déjà un compte ? Se connecter'
                    : 'Pas encore de compte ? Créer un compte'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};