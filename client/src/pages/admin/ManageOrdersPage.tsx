import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
    Package, Clock, CheckCircle, XCircle, Truck, Mail,
    User, MapPin, X, ChevronRight, StickyNote
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config/api';

interface Order {
    id: number;
    status: string;
    total: number;
    items: string;
    deliveryAddress: string;
    postalCode: string;
    phone: string;
    notes: string | null;
    paymentMethod: string;
    deliveryTimeSlot: string | null;
    deliveryDate: string | null;
    createdAt: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
    } | null;
}

const STATUS_CONFIG = {
    en_attente:          { label: 'En attente',       color: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800', icon: Clock },
    en_preparation:      { label: 'En préparation',   color: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-800',    icon: Package },
    pret_pour_livraison: { label: 'Prêt à livrer',    color: 'bg-green-500',  badge: 'bg-green-100 text-green-800',  icon: Truck },
    livre:               { label: 'Livré',             color: 'bg-gray-500',   badge: 'bg-gray-100 text-gray-700',    icon: CheckCircle },
    annule:              { label: 'Annulé',            color: 'bg-red-500',    badge: 'bg-red-100 text-red-800',      icon: XCircle },
} as const;

const TIME_SLOTS = ['09:00 - 11:00', '11:00 - 13:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];

const clientName = (order: Order) => {
    if (!order.user) return 'Utilisateur supprimé';
    return `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim() || order.user.email;
};

const parseItems = (raw: string | null | undefined): { name: string; quantity: number; price: number }[] => {
    if (!raw) return [];
    try {
        let parsed = JSON.parse(raw);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
};

export const ManageOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    useEffect(() => { fetchOrders(); }, [selectedStatus]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            const url = selectedStatus === 'all'
                ? `${API_URL}/orders/admin/all`
                : `${API_URL}/orders/admin/all?status=${selectedStatus}`;
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            alert('Erreur lors du chargement des commandes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        if (!window.confirm('Confirmer le changement de statut ?')) return;
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `${API_URL}/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchOrders();
            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleSetDelivery = async () => {
        if (!selectedOrder || !deliveryDate || !deliveryTime) {
            alert('Veuillez sélectionner une date et un créneau horaire');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `${API_URL}/orders/${selectedOrder.id}/delivery`,
                { deliveryDate, deliveryTimeSlot: deliveryTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await sendNotification(selectedOrder.id, 'ready');
            alert('Créneau défini et email envoyé avec succès !');
            await fetchOrders();
            setShowDeliveryModal(false);
            setSelectedOrder(null);
        } catch (error) {
            console.error('Failed to set delivery:', error);
            alert('Erreur lors de la définition du créneau');
        }
    };

    const sendNotification = async (orderId: number, type: 'ready' | 'delivered') => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `${API_URL}/orders/${orderId}/notify`,
                { type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    };

    const handleMarkDelivered = async (orderId: number) => {
        if (!window.confirm('Marquer cette commande comme livrée ?')) return;
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `${API_URL}/orders/${orderId}/status`,
                { status: 'livre' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await sendNotification(orderId, 'delivered');
            await fetchOrders();
            setSelectedOrder(prev => prev ? { ...prev, status: 'livre' } : null);
        } catch (error) {
            console.error('Failed to mark as delivered:', error);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-3xl font-serif text-gray-800">Gestion des Commandes</h2>
                    <p className="text-sm text-gray-500 mt-1">{orders.length} commande(s)</p>
                </div>

                {/* Filtres statut */}
                <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedStatus('all')}
                        className={`px-4 py-2.5 rounded-md transition-colors text-sm font-medium ${
                            selectedStatus === 'all' ? 'bg-gold text-dark' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Toutes ({orders.length})
                    </button>
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                        const count = orders.filter(o => o.status === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedStatus(key)}
                                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md transition-colors text-sm font-medium ${
                                    selectedStatus === key ? 'bg-gold text-dark' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.color}`} />
                                {cfg.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Cards */}
                {orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow text-center border border-gray-100">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Aucune commande pour ce filtre</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orders.map((order) => {
                            const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                                ?? { label: order.status, badge: 'bg-gray-100 text-gray-700', icon: Package };
                            const StatusIcon = cfg.icon;
                            const items = parseItems(order.items);

                            return (
                                <button
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:border-gold hover:shadow-md transition-all duration-200 group"
                                >
                                    {/* Top row */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900 text-base">#{order.id}</p>
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${cfg.badge}`}>
                                                <StatusIcon size={11} />
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gold transition-colors mt-1 flex-shrink-0" />
                                    </div>

                                    {/* Client */}
                                    <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5 mb-0.5">
                                        <User size={13} className="text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{clientName(order)}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 pl-5 truncate mb-3">
                                        {order.user?.email ?? '—'}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-lg font-bold text-gold">{order.total.toFixed(2)} €</span>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                            </p>
                                            {items.length > 0 && (
                                                <p className="text-xs text-gray-400">{items.length} article{items.length > 1 ? 's' : ''}</p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Slide panel */}
            {selectedOrder && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedOrder(null)} />

                    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

                        {/* Panel header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                            <div>
                                <h3 className="font-serif text-lg text-gray-800">Commande #{selectedOrder.id}</h3>
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${
                                    (STATUS_CONFIG[selectedOrder.status as keyof typeof STATUS_CONFIG] ?? { badge: 'bg-gray-100 text-gray-700' }).badge
                                }`}>
                                    {(STATUS_CONFIG[selectedOrder.status as keyof typeof STATUS_CONFIG] ?? { label: selectedOrder.status }).label}
                                </span>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Client */}
                            <section>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Client</h4>
                                <div className="space-y-1.5 text-sm text-gray-700">
                                    <p className="flex items-center gap-2">
                                        <User size={14} className="text-gray-400" />
                                        <span className="font-medium">{clientName(selectedOrder)}</span>
                                    </p>
                                    {selectedOrder.user && (
                                        <p className="pl-5 text-gray-500">{selectedOrder.user.email}</p>
                                    )}
                                    <p className="flex items-center gap-2">
                                        <Mail size={14} className="text-gray-400" />
                                        {selectedOrder.phone}
                                    </p>
                                </div>
                            </section>

                            {/* Livraison */}
                            <section>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Livraison</h4>
                                <div className="space-y-1.5 text-sm text-gray-700">
                                    <p className="flex items-start gap-2">
                                        <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span>{selectedOrder.deliveryAddress}, {selectedOrder.postalCode}</span>
                                    </p>
                                    {selectedOrder.deliveryDate && (
                                        <p className="pl-5 text-green-700 font-semibold">
                                            {selectedOrder.deliveryDate} — {selectedOrder.deliveryTimeSlot}
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Produits */}
                            <section>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Produits</h4>
                                <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                                    {parseItems(selectedOrder.items).length === 0 ? (
                                        <p className="p-4 text-sm text-gray-400 italic">Données non disponibles</p>
                                    ) : (
                                        <>
                                            {parseItems(selectedOrder.items).map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm px-4 py-2.5 border-b border-gray-100 last:border-0">
                                                    <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                                                    <span className="font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)} €</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between px-4 py-3 bg-gray-100 font-bold text-gray-900 text-sm">
                                                <span>Total</span>
                                                <span>{selectedOrder.total.toFixed(2)} €</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </section>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Notes</h4>
                                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex gap-2">
                                        <StickyNote size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                        {selectedOrder.notes}
                                    </p>
                                </section>
                            )}

                            {/* Changer statut */}
                            <section>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Changer le statut</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                                        const Icon = cfg.icon;
                                        const isCurrent = selectedOrder.status === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => handleStatusChange(selectedOrder.id, key)}
                                                disabled={isCurrent}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                                    isCurrent
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : `${cfg.color} text-white hover:opacity-90`
                                                }`}
                                            >
                                                <Icon size={15} />
                                                {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Actions contextuelles */}
                            {selectedOrder.status === 'en_preparation' && (
                                <button
                                    onClick={() => setShowDeliveryModal(true)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    <Truck size={18} />
                                    Définir créneau de livraison
                                </button>
                            )}

                            {selectedOrder.status === 'pret_pour_livraison' && (
                                <button
                                    onClick={() => handleMarkDelivered(selectedOrder.id)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                >
                                    <CheckCircle size={18} />
                                    Marquer comme livré
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Delivery modal (centré — reste inchangé) */}
            {showDeliveryModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white text-gray-900 rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-serif text-gray-800 mb-4">Définir le créneau de livraison</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date de livraison</label>
                                <input
                                    type="date"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Créneau horaire</label>
                                <select
                                    value={deliveryTime}
                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
                                >
                                    <option value="">Sélectionner un créneau</option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSetDelivery}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                                >
                                    <Mail size={16} />
                                    Confirmer et envoyer email
                                </button>
                                <button
                                    onClick={() => setShowDeliveryModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
