import { useContext, useState, useEffect } from 'react';
import { UserLayout } from '../../components/user/UserLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { MapPin, Save, AlertCircle, PenLine, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ELIGIBLE_POSTCODES = ['57000', '57050', '57140', '57070', '57150', '57160', '57170'];

export const UserAddress = () => {
    const { user, updateUser } = useContext(AuthContext);

    const hasAddress = !!user?.address && !!user?.postalCode;

    const [isEditing, setIsEditing] = useState(!hasAddress);
    const [formData, setFormData] = useState({
        address: user?.address || '',
        city: user?.city || '',
        postalCode: user?.postalCode || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isEligible, setIsEligible] = useState<boolean | null>(null);

    // Sync form if user data changes (ex: after save from another page)
    useEffect(() => {
        setFormData({
            address: user?.address || '',
            city: user?.city || '',
            postalCode: user?.postalCode || '',
        });
    }, [user]);

    useEffect(() => {
        if (formData.postalCode) {
            setIsEligible(ELIGIBLE_POSTCODES.includes(formData.postalCode));
        } else {
            setIsEligible(null);
        }
    }, [formData.postalCode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        if (!ELIGIBLE_POSTCODES.includes(formData.postalCode)) {
            setMessage({
                type: 'error',
                text: 'Ce code postal n\'est pas éligible à la livraison. Zones couvertes: 57000, 57050, 57070, 57140, 57150, 57160, 57170'
            });
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                'http://localhost:3000/api/user/profile',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateUser(response.data);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Adresse enregistrée avec succès' });
        } catch {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour de l\'adresse' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setMessage(null);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            address: user?.address || '',
            city: user?.city || '',
            postalCode: user?.postalCode || '',
        });
        setMessage(null);
        setIsEditing(false);
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-700">
                    <MapPin size={24} className="text-gold" />
                    <h2 className="text-2xl font-serif text-white">Adresse de Livraison</h2>
                </div>

                {/* Zone info — shown only when editing */}
                {isEditing && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-300">
                                <p className="font-semibold mb-1">Zone de livraison</p>
                                <p className="text-xs">
                                    Nous livrons uniquement dans un rayon de 15 km autour de Metz.
                                    Codes postaux éligibles: 57000, 57050, 57070, 57140, 57150, 57160, 57170
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {message && (
                    <div className={`p-4 rounded-lg ${
                        message.type === 'success'
                            ? 'bg-green-900/20 border border-green-500 text-green-300'
                            : 'bg-red-900/20 border border-red-500 text-red-300'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* ── VIEW MODE ── */}
                {!isEditing && hasAddress && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-white font-medium">{user.address}</p>
                                <p className="text-gray-300">{user.postalCode} {user.city}</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-900/20 border border-green-500/30 px-2 py-1 rounded-full">
                                <CheckCircle size={12} />
                                Zone éligible
                            </span>
                        </div>

                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold text-gold text-sm rounded-lg hover:bg-gold/10 transition-colors"
                        >
                            <PenLine size={16} />
                            Modifier l'adresse
                        </button>
                    </div>
                )}

                {/* ── EDIT MODE ── */}
                {isEditing && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                                Adresse complète *
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                placeholder="12 rue de la Gare"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                                    Ville *
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#1E1B18] border border-gray-600 rounded text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                    placeholder="Metz"
                                />
                            </div>

                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">
                                    Code Postal *
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                    maxLength={5}
                                    className={`w-full px-4 py-3 bg-[#1E1B18] border rounded text-white placeholder-gray-500 focus:outline-none ${
                                        isEligible === true
                                            ? 'border-green-500 focus:border-green-400'
                                            : isEligible === false
                                                ? 'border-red-500 focus:border-red-400'
                                                : 'border-gray-600 focus:border-gold'
                                    }`}
                                    placeholder="57000"
                                />
                                {isEligible === true && (
                                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                        <CheckCircle size={12} />
                                        Zone éligible à la livraison
                                    </p>
                                )}
                                {isEligible === false && (
                                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Zone non couverte par nos livraisons
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={isLoading || isEligible === false}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                {isLoading ? 'Enregistrement...' : 'Enregistrer l\'adresse'}
                            </button>

                            {/* Cancel only shown when editing existing address */}
                            {hasAddress && (
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
