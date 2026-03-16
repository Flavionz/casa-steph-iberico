const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ─── Règles métier (miroir de client/src/constants/delivery.ts) ───────────────
const ZONE_1_FREE     = ['57000', '57050', '57070', '57140', '57155', '57160', '57950'];
const ZONE_2_FEE      = ['57130', '57170', '57245', '57420', '57530', '57645', '57685'];
const ZONE_2_AMOUNT   = 5;
const FREE_THRESHOLD  = 100;
const MIN_CART        = 30;

const calcDeliveryFee = (postalCode, cartTotal) => {
    if (ZONE_1_FREE.includes(postalCode)) return 0;
    if (ZONE_2_FEE.includes(postalCode))  return cartTotal >= FREE_THRESHOLD ? 0 : ZONE_2_AMOUNT;
    return 0;
};

const createOrder = async (req, res) => {
    try {
        const { items, total, deliveryAddress, postalCode, phone, notes, paymentMethod, paymentIntentId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Le panier est vide' });
        }

        if (!deliveryAddress || !postalCode || !phone) {
            return res.status(400).json({ error: 'Informations de livraison manquantes' });
        }

        const cartTotal = parseFloat(total);

        // Panier minimum
        if (cartTotal < MIN_CART) {
            return res.status(400).json({ error: `Commande minimum de ${MIN_CART} € requise` });
        }

        // Zone éligible
        const allZones = [...ZONE_1_FREE, ...ZONE_2_FEE];
        if (!allZones.includes(postalCode)) {
            return res.status(400).json({ error: 'Code postal non éligible à la livraison' });
        }

        // Cash uniquement pour clients ayant déjà commandé
        if (paymentMethod === 'cash' && !paymentIntentId) {
            const previousOrders = await prisma.order.count({
                where: { userId: req.user.userId }
            });
            if (previousOrders === 0) {
                return res.status(400).json({
                    error: 'Le paiement à la livraison est réservé aux clients ayant déjà passé une commande'
                });
            }
        }

        const deliveryFee = calcDeliveryFee(postalCode, cartTotal);
        const orderTotal  = cartTotal + deliveryFee;
        const itemsString = JSON.stringify(items);

        const order = await prisma.order.create({
            data: {
                userId: req.user.userId,
                status: 'en_attente',
                total: orderTotal,
                deliveryFee,
                items: itemsString,
                deliveryAddress,
                postalCode,
                phone: phone || '',
                notes: notes || '',
                paymentMethod: paymentMethod || 'cash',
                paymentStatus: paymentIntentId ? 'paid' : 'pending',
                ...(paymentIntentId && { paymentIntentId }),
            }
        });

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { email: true, firstName: true, lastName: true }
        });

        res.status(201).json({
            message: 'Commande créée avec succès',
            order: {
                id: order.id,
                orderNumber: `AE-${order.id.toString().padStart(6, '0')}`,
                status: order.status,
                total: order.total,
                deliveryFee: order.deliveryFee,
                items: JSON.parse(order.items),
                deliveryAddress: order.deliveryAddress,
                postalCode: order.postalCode,
                createdAt: order.createdAt
            },
            user: {
                email: user.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
            }
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: { email: true, firstName: true, lastName: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['en_attente', 'en_preparation', 'pret_pour_livraison', 'livre', 'annule'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Statut invalide' });
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({ message: 'Statut de la commande mis à jour', order });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
};
