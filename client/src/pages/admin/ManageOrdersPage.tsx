import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Package, Clock, CheckCircle, XCircle, Eye, Truck, Mail } from 'lucide-react';
import axios from 'axios';

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
    };
}

export const ManageOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    const API_URL = 'http://localhost:3000/api';

    const statusConfig = {
        en_attente: { label: 'En attente', color: 'bg-yellow-500', icon: Clock },
        en_preparation: { label: 'En préparation', color: 'bg-blue-500', icon: Package },
        pret_pour_livraison: { label: 'Prêt pour livraison', color: 'bg-green-500', icon: Truck },
        livre: { label: 'Livré', color: 'bg-gray-500', icon: CheckCircle },
        annule: { label: 'Annulé', color: 'bg-red-500', icon: XCircle },
    };

    const timeSlots = [
        '09:00 - 11:00',
        '11:00 - 13:00',
        '14:00 - 16:00',
        '16:00 - 18:00',
        '18:00 - 20:00',
    ];

    useEffect(() => {
        fetchOrders();
    }, [selectedStatus]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            const url = selectedStatus === 'all'
                ? `${API_URL}/orders/admin/all`
                : `${API_URL}/orders/admin/all?status=${selectedStatus}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
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

            alert('Statut mis à jour avec succès !');
            fetchOrders();
            setShowModal(false);
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
                {
                    deliveryDate,
                    deliveryTimeSlot: deliveryTime
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await sendNotification(selectedOrder.id, 'ready');

            alert('Créneau défini et email envoyé avec succès !');
            fetchOrders();
            setShowDeliveryModal(false);
            setShowModal(false);
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
            await handleStatusChange(orderId, 'livre');
            await sendNotification(orderId, 'delivered');
            alert('Commande marquée comme livrée et email de confirmation envoyé !');
        } catch (error) {
            console.error('Failed to mark as delivered:', error);
        }
    };

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const parseItems = (itemsString: string) => {
        try {
            return JSON.parse(itemsString);
        } catch {
            return [];
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
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                    <div>
                        <h2 className="text-3xl font-serif text-gray-800">Gestion des Commandes</h2>
                        <p className="text-sm text-gray-500 mt-1">{orders.length} commande(s) total</p>
                    </div>
                </div>

                <div className="flex space-x-2 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setSelectedStatus('all')}
                        className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                            selectedStatus === 'all'
                                ? 'bg-gold text-dark font-semibold'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Toutes ({orders.length})
                    </button>
                    {Object.entries(statusConfig).map(([key, config]) => {
                        const count = orders.filter(o => o.status === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedStatus(key)}
                                className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center space-x-2 ${
                                    selectedStatus === key
                                        ? 'bg-gold text-dark font-semibold'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${config.color}`}></span>
                                <span>{config.label} ({count})</span>
                            </button>
                        );
                    })}
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow text-center">
                        <Package size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">Aucune commande pour ce filtre</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => {
                                const config = statusConfig[order.status as keyof typeof statusConfig] || {
                                    label: order.status,
                                    color: 'bg-gray-500',
                                    icon: Package
                                };
                                const Icon = config.icon;
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.user.firstName} {order.user.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">{order.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {order.total.toFixed(2)}€
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold text-white ${config.color}`}>
                          <Icon size={14} />
                          <span>{config.label}</span>
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button
                                                onClick={() => openOrderDetails(order)}
                                                className="inline-flex items-center space-x-1 px-3 py-1 bg-gold text-dark rounded hover:bg-gold/90 transition-colors font-medium"
                                            >
                                                <Eye size={16} />
                                                <span>Détails</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    {/* text-gray-900 esplicito: evita di ereditare text-white dal tema dark dell'app */}
                    <div className="bg-white text-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-serif text-gray-800">Commande #{selectedOrder.id}</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Client</h4>
                                    {selectedOrder.user ? (
                                        <>
                                            <p className="text-sm text-gray-900">
                                                {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">{selectedOrder.user.email}</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-red-500 italic">Utilisateur supprimé</p>
                                    )}
                                    <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Livraison</h4>
                                    <p className="text-sm text-gray-900">{selectedOrder.deliveryAddress}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.postalCode}</p>
                                    {selectedOrder.deliveryDate && (
                                        <p className="text-sm text-green-600 font-semibold mt-2">
                                            📅 {selectedOrder.deliveryDate} — {selectedOrder.deliveryTimeSlot}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Produits</h4>
                                <div className="bg-gray-50 rounded p-4 space-y-2">
                                    {parseItems(selectedOrder.items).length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">Données produits non disponibles</p>
                                    ) : (
                                        parseItems(selectedOrder.items).map((item: { name: string; quantity: number; price: number }, idx: number) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-800">{item.name} x{item.quantity}</span>
                                                <span className="font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)}€</span>
                                            </div>
                                        ))
                                    )}
                                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>{selectedOrder.total.toFixed(2)}€</span>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                                    <p className="text-sm text-gray-800 bg-yellow-50 p-3 rounded border border-yellow-200">
                                        {selectedOrder.notes}
                                    </p>
                                </div>
                            )}

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3">Changer le statut</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(statusConfig).map(([key, config]) => {
                                        const Icon = config.icon;
                                        const isCurrentStatus = selectedOrder.status === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => handleStatusChange(selectedOrder.id, key)}
                                                disabled={isCurrentStatus}
                                                className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                                                    isCurrentStatus
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : `${config.color} text-white hover:opacity-90`
                                                }`}
                                            >
                                                <Icon size={18} />
                                                <span className="text-sm font-medium">{config.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedOrder.status === 'en_preparation' && (
                                <button
                                    onClick={() => setShowDeliveryModal(true)}
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <Truck size={20} />
                                    <span>Définir créneau de livraison</span>
                                </button>
                            )}

                            {selectedOrder.status === 'pret_pour_livraison' && (
                                <button
                                    onClick={() => handleMarkDelivered(selectedOrder.id)}
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    <CheckCircle size={20} />
                                    <span>Marquer comme livré</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDeliveryModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                                    {timeSlots.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={handleSetDelivery}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    <Mail size={18} />
                                    <span>Confirmer et envoyer email</span>
                                </button>
                                <button
                                    onClick={() => setShowDeliveryModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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