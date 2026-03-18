import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setSubmitted(true);
        } catch {
            setError('Une erreur est survenue. Veuillez réessayer.');
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
                    <h2 className="font-serif text-2xl text-white mb-2 text-center">Mot de passe oublié</h2>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        Entrez votre email pour recevoir un lien de réinitialisation
                    </p>

                    {submitted ? (
                        <div className="text-center space-y-4">
                            <div className="w-14 h-14 bg-green-900/30 border border-green-500 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-green-400 text-2xl">✓</span>
                            </div>
                            <p className="text-green-300 text-sm">
                                Si un compte existe pour <strong>{email}</strong>, vous recevrez un email avec un lien valable 1 heure.
                            </p>
                            <p className="text-gray-500 text-xs">Vérifiez aussi vos spams.</p>
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
                                    <label htmlFor="email" className="block text-sm text-gray-300 mb-2 tracking-wide">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full bg-transparent border-b border-gray-600 text-white py-2 px-1 focus:outline-none focus:border-gold transition-colors duration-300"
                                        placeholder="votre@email.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gold hover:bg-gold/90 text-dark font-medium py-3 rounded-sm transition-colors duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Envoi...' : 'Envoyer le lien'}
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
