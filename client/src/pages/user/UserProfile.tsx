import { useContext, useState } from 'react';
import { UserLayout } from '../../components/user/UserLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { Save, User as UserIcon } from 'lucide-react';
import axios from 'axios';

export const UserProfile = () => {
    const { user, updateUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        email: user?.email || '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                'http://localhost:3000/api/user/profile',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateUser(response.data);
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-700">
                    <UserIcon size={24} className="text-gold" />
                    <h2 className="text-2xl font-serif text-white">Informations Personnelles</h2>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg ${
                        message.type === 'success'
                            ? 'bg-green-900/20 border border-green-500 text-green-300'
                            : 'bg-red-900/20 border border-red-500 text-red-300'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                placeholder="Votre prénom"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                placeholder="Votre nom"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                            placeholder="06 12 34 56 78"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-6 py-3 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        <span>{isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                    </button>
                </form>
            </div>
        </UserLayout>
    );
};