const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    try {
        const { items, total, deliveryAddress, postalCode, phone, notes, paymentMethod, paymentIntentId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Le panier est vide' });
        }

        if (!deliveryAddress || !postalCode || !phone) {
            return res.status(400).json({ error: 'Informations de livraison manquantes' });
        }

        const itemsString = JSON.stringify(items);

        const order = await prisma.order.create({
            data: {
                userId: req.user.userId,
                status: 'en_attente',
                total: parseFloat(total),
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
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true
                    }
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

        const validStatuses = ['pending', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Statut invalide' });
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({
            message: 'Statut de la commande mis à jour',
            order
        });

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