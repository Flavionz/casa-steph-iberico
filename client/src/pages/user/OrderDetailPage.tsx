import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserLayout } from '../../components/user/UserLayout';
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft, Download, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config/api';

interface Order {
    id: number;
    status: string;
    total: number;
    items: string;
    deliveryAddress: string;
    postalCode: string;
    deliveryTimeSlot: string | null;
    deliveryDate: string | null;
    invoiceNumber: string | null;
    paymentStatus: string | null;
    paymentMethod: string | null;
    subtotal: number | null;
    taxAmount: number | null;
    taxRate: number | null;
    deliveryFee: number | null;
    createdAt: string;
}

const parseItems = (raw: string | null | undefined): { name: string; quantity: number; price: number }[] => {
    if (!raw) return [];
    try {
        let parsed = JSON.parse(raw);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'en_attente':
            return { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-300', label: 'En attente', icon: Clock };
        case 'lien_envoye':
            return { bg: 'bg-purple-900/20', border: 'border-purple-500', text: 'text-purple-300', label: 'Lien de paiement envoyé', icon: Package };
        case 'paye':
            return { bg: 'bg-emerald-900/20', border: 'border-emerald-500', text: 'text-emerald-300', label: 'Payé', icon: CheckCircle };
        case 'en_preparation':
            return { bg: 'bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-300', label: 'En préparation', icon: Package };
        case 'pret_pour_livraison':
            return { bg: 'bg-green-900/20', border: 'border-green-500', text: 'text-green-300', label: 'Prêt pour livraison', icon: Truck };
        case 'livre':
            return { bg: 'bg-gray-900/20', border: 'border-gray-500', text: 'text-gray-300', label: 'Livré', icon: CheckCircle };
        case 'annule':
            return { bg: 'bg-red-900/20', border: 'border-red-500', text: 'text-red-300', label: 'Annulé', icon: XCircle };
        default:
            return { bg: 'bg-gray-900/20', border: 'border-gray-500', text: 'text-gray-300', label: status, icon: Package };
    }
};

export const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${API_URL}/user/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(response.data);
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setNotFound(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    if (isLoading) {
        return (
            <UserLayout>
                <div className="text-center py-12">
                    <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement...</p>
                </div>
            </UserLayout>
        );
    }

    if (notFound || !order) {
        return (
            <UserLayout>
                <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Commande introuvable.</p>
                    <Link to="/account/orders" className="text-gold hover:underline">
                        Retour aux commandes
                    </Link>
                </div>
            </UserLayout>
        );
    }

    const statusBadge = getStatusBadge(order.status);
    const StatusIcon = statusBadge.icon;
    const items = parseItems(order.items);
    const canDownloadInvoice = order.invoiceNumber && (order.paymentStatus === 'paid' || order.status === 'delivered');

    const handleDownloadInvoice = () => {
        const token = localStorage.getItem('authToken');
        fetch(`${API_URL}/orders/${order.id}/invoice`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `facture-${order.invoiceNumber}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
            });
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/account/orders"
                            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            <ArrowLeft size={16} />
                            Mes commandes
                        </Link>
                        <span className="text-gray-600">/</span>
                        <h2 className="text-white font-serif text-xl">
                            Commande #{String(order.id).padStart(4, '0')}
                        </h2>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}>
                        <StatusIcon size={14} />
                        {statusBadge.label}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Date de commande</p>
                        <p className="text-white">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                    {order.invoiceNumber && (
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">N° Facture</p>
                            <p className="text-white font-mono">{order.invoiceNumber}</p>
                        </div>
                    )}
                    {order.paymentMethod && (
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Paiement</p>
                            <p className="text-white capitalize">{order.paymentMethod === 'cash' ? 'Espèces à la livraison' : 'Lien de paiement (envoyé par Stéphane)'}</p>
                        </div>
                    )}
                </div>

                {/* Livraison programmée */}
                {order.deliveryDate && order.deliveryTimeSlot && (
                    <div className="bg-green-900/20 border border-green-500/40 rounded-lg p-4 flex items-start gap-3">
                        <Calendar size={18} className="text-green-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-green-300 font-semibold text-sm mb-1">Livraison programmée</p>
                            <p className="text-green-200 text-sm">
                                {new Date(order.deliveryDate).toLocaleDateString('fr-FR', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })} — {order.deliveryTimeSlot}
                            </p>
                        </div>
                    </div>
                )}

                {/* Articles */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-gray-300">Articles ({items.length})</p>
                    </div>
                    <div className="divide-y divide-gray-700/50">
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center px-5 py-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 w-5 text-center">{item.quantity}×</span>
                                    <span className="text-gray-200">{item.name}</span>
                                </div>
                                <span className="text-gold font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                            </div>
                        ))}
                    </div>

                    {/* Totaux */}
                    <div className="border-t border-gray-700 px-5 py-4 space-y-2">
                        {order.subtotal != null && (
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Sous-total HT</span>
                                <span>{order.subtotal.toFixed(2)} €</span>
                            </div>
                        )}
                        {order.taxAmount != null && order.taxRate != null && (
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>TVA ({order.taxRate}%)</span>
                                <span>{order.taxAmount.toFixed(2)} €</span>
                            </div>
                        )}
                        {order.deliveryFee != null && (
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Frais de livraison</span>
                                <span>{order.deliveryFee === 0 ? 'Gratuit' : `${order.deliveryFee.toFixed(2)} €`}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                            <span className="font-semibold text-white">Total TTC</span>
                            <span className="text-2xl font-bold text-gold">{order.total.toFixed(2)} €</span>
                        </div>
                    </div>
                </div>

                {/* Adresse de livraison */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-gold" />
                        <p className="text-sm font-medium text-gray-300">Adresse de livraison</p>
                    </div>
                    <p className="text-white text-sm">{order.deliveryAddress}</p>
                    <p className="text-gray-400 text-sm">{order.postalCode}</p>
                </div>

                {/* Facture */}
                {canDownloadInvoice && (
                    <div className="flex items-center justify-between bg-gray-800/50 rounded-lg border border-gray-700 px-5 py-4">
                        <div>
                            <p className="text-sm font-medium text-white">Facture</p>
                            <p className="text-xs text-gray-500 font-mono">{order.invoiceNumber}</p>
                        </div>
                        <button
                            onClick={handleDownloadInvoice}
                            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/80 border border-gold/30 hover:border-gold/60 px-4 py-2 rounded transition-colors"
                        >
                            <Download size={14} />
                            Télécharger la facture
                        </button>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};
