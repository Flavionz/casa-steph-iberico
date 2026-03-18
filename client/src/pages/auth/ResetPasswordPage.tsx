import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';

export const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <p className="text-red-400">Lien invalide ou expiré.</p>
                    <Link to="/forgot-password" className="text-gold hover:underline text-sm">
                        Demander un nouveau lien
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Lien invalide ou expiré.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <Link to="/" className="block text-center mb-8">
                    <h1 className="font-serif text-3xl text-white mb-2">L'Auberge Espagnole</h1>
                    <div className="w-16 h-0.5 bg-gold mx-auto" />
                </Link>

                <div className="bg-darkAccent border border-gold/30 rounded-sm p-8 shadow-2xl">
                    <h2 className="font-serif text-2xl text-white mb-2 text-center">Nouveau mot de passe</h2>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        Choisissez un nouveau mot de passe sécurisé
                    </p>

                    {success ? (
                        <div className="text-center space-y-3">
                            <div className="w-14 h-14 bg-green-900/30 border border-green-500 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-green-400 text-2xl">✓</span>
                            </div>
                            <p className="text-green-300 text-sm">Mot de passe modifié avec succès !</p>
                            <p className="text-gray-500 text-xs">Redirection vers la connexion...</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="text-sm p-3 mb-4 rounded bg-red-800/20 border border-red-500 text-red-300 text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm text-gray-300 mb-2 tracking-wide">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full bg-transparent border-b border-gray-600 text-white py-2 px-1 focus:outline-none focus:border-gold transition-colors duration-300"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-2 tracking-wide">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full bg-transparent border-b border-gray-600 text-white py-2 px-1 focus:outline-none focus:border-gold transition-colors duration-300"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gold hover:bg-gold/90 text-dark font-medium py-3 rounded-sm transition-colors duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-gray-400 hover:text-gold transition-colors">
                            ← Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
