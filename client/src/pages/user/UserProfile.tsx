import { useContext, useState, useEffect } from 'react';
import { UserLayout } from '../../components/user/UserLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { Save, User as UserIcon, PenLine, Phone } from 'lucide-react';
import axios from 'axios';

export const UserProfile = () => {
    const { user, updateUser } = useContext(AuthContext);

    const hasProfile = !!(user?.firstName && user?.lastName);

    const [isEditing, setIsEditing] = useState(!hasProfile);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
        });
    }, [user]);

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
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
        } catch {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
        });
        setMessage(null);
        setIsEditing(false);
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

                {/* Email — toujours visible, non modifiable */}
                <div className="bg-gray-800/30 border border-gray-700 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-gray-300 text-sm">{user?.email}</p>
                </div>

                {/* ── VIEW MODE ── */}
                {!isEditing && hasProfile && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Prénom</p>
                                <p className="text-white font-medium">{user?.firstName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Nom</p>
                                <p className="text-white font-medium">{user?.lastName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Téléphone</p>
                                <p className="text-white font-medium flex items-center gap-1.5">
                                    {user?.phone
                                        ? <><Phone size={13} className="text-gray-400" />{user.phone}</>
                                        : <span className="text-gray-500 italic text-sm">Non renseigné</span>
                                    }
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => { setMessage(null); setIsEditing(true); }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold text-gold text-sm rounded-lg hover:bg-gold/10 transition-colors"
                        >
                            <PenLine size={16} />
                            Modifier mes informations
                        </button>
                    </div>
                )}

                {/* ── EDIT MODE ── */}
                {isEditing && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                    placeholder="Marie"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                    placeholder="Dupont"
                                />
                            </div>
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

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>

                            {hasProfile && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 border border-gray-600 text-gray-300 text-sm rounded hover:bg-gray-800 transition-colors"
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </UserLayout>
    );
};
