const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
require('dotenv').config();

const { storage: cloudinaryStorage } = require('./config/cloudinary');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const { sendOrderReadyEmail, sendOrderDeliveredEmail, sendPaymentLinkEmail } = require('./services/emailService');
const { authenticate, isAdmin } = require('./middleware/authMiddleware');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const upload = multer({ storage: cloudinaryStorage });

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // needed for Cloudinary images
}));
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));
// Stripe webhook requires raw body — must be registered before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Images hosted on Cloudinary — no local /uploads to serve

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.send('Casa Steph Iberico API is running 🥩');
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        res.status(500).json({ error: 'Erreur de récupération des catégories' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { category: true }
        });
        res.json(products.map(p => ({
            ...p,
            image: p.image || null
        })));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({ error: 'Erreur dans la récupération des produits' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { category: true }
        });
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json({
            ...product,
            image: product.image || null
        });
    } catch (error) {
        console.error("Failed to fetch product:", error);
        res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
    }
});

app.post('/api/products', authenticate, isAdmin, upload.single('image'), async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);
    const parsedCategoryId = parseInt(categoryId, 10);

    if (!name || isNaN(parsedPrice) || isNaN(parsedCategoryId)) {
        return res.status(400).json({ error: "Données manquantes: nom, prix ou catégorie sont requis." });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                name: name,
                description: description,
                price: parsedPrice,
                stock: parsedStock,
                image: imageUrl,
                categoryId: parsedCategoryId,
            }
        });

        res.status(201).json({
            ...newProduct,
            message: 'Produit créé avec succès.'
        });
    } catch (error) {
        console.error("Failed to save product:", error);
        res.status(500).json({ error: 'Erreur interne du serveur lors de la publication.' });
    }
});

app.put('/api/products/:id', authenticate, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, categoryId } = req.body;
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock, 10);
        const parsedCategoryId = parseInt(categoryId, 10);

        if (!name || isNaN(parsedPrice) || isNaN(parsedCategoryId)) {
            return res.status(400).json({ error: "Données manquantes" });
        }

        const updateData = {
            name,
            description,
            price: parsedPrice,
            stock: parsedStock,
            categoryId: parsedCategoryId,
        };

        if (req.file) {
            const oldProduct = await prisma.product.findUnique({
                where: { id: parseInt(id) }
            });

            if (oldProduct && oldProduct.image) {
            }

            updateData.image = req.file.path;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.json({
            ...updatedProduct,
            message: 'Produit modifié avec succès'
        });
    } catch (error) {
        console.error('Failed to update product:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
});

app.delete('/api/products/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
    }
});

app.get('/api/featured', async (req, res) => {
    try {
        const featured = await prisma.featuredProduct.findMany({
            where: { isActive: true },
            orderBy: { position: 'asc' }
        });
        res.json(featured.map(f => ({
            ...f,
            image: f.image
        })));
    } catch (error) {
        console.error('Failed to fetch featured products:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

app.post('/api/featured', authenticate, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, category, position } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        if (!title || !category || !imageUrl) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        const newFeatured = await prisma.featuredProduct.create({
            data: {
                title,
                category,
                image: imageUrl,
                position: parseInt(position, 10) || 999,
                isActive: true
            }
        });

        res.status(201).json({
            ...newFeatured,
            message: 'Produit vitrine créé avec succès'
        });
    } catch (error) {
        console.error('Failed to create featured product:', error);
        res.status(500).json({ error: 'Erreur lors de la création' });
    }
});

app.put('/api/featured/:id', authenticate, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, position } = req.body;

        const updateData = {
            title,
            category,
            position: parseInt(position, 10)
        };

        if (req.file) {
            const oldFeatured = await prisma.featuredProduct.findUnique({
                where: { id: parseInt(id) }
            });

            if (oldFeatured && oldFeatured.image && !oldFeatured.image.startsWith('http')) {
            }

            updateData.image = req.file.path;
        }

        const updated = await prisma.featuredProduct.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.json({
            ...updated,
            message: 'Produit vitrine modifié avec succès'
        });
    } catch (error) {
        console.error('Failed to update featured product:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
});

app.delete('/api/featured/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.featuredProduct.update({
            where: { id: parseInt(id) },
            data: { isActive: false }
        });

        res.json({ message: 'Produit vitrine désactivé avec succès' });
    } catch (error) {
        console.error('Failed to delete featured product:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

app.get('/api/admin/users', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                civility: true,
                firstName: true,
                lastName: true,
                phone: true,
                createdAt: true,
                _count: { select: { orders: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

app.get('/api/admin/users/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                role: true,
                civility: true,
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
                city: true,
                postalCode: true,
                createdAt: true,
                orders: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        status: true,
                        total: true,
                        paymentMethod: true,
                        paymentStatus: true,
                        createdAt: true,
                    }
                }
            }
        });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalProducts,
            pendingOrders,
            monthlySalesResult,
            newUsersThisMonth,
            lowStockProducts,
            recentOrders,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.order.count({ where: { status: 'en_attente' } }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    createdAt: { gte: startOfMonth },
                    status: { not: 'annule' },
                },
            }),
            prisma.user.count({
                where: {
                    createdAt: { gte: startOfMonth },
                    role: 'user',
                },
            }),
            prisma.product.count({ where: { stock: { lte: 5 } } }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { email: true, firstName: true, lastName: true },
                    },
                },
            }),
        ]);

        res.json({
            totalProducts,
            pendingOrders,
            monthlySales: monthlySalesResult._sum.total ?? 0,
            newUsersThisMonth,
            lowStockProducts,
            recentOrders,
        });
    } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
});

app.get('/api/orders/admin/all', authenticate, isAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const where = status && status !== 'all' ? { status } : {};

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
});

app.get('/api/orders/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        address: true,
                        city: true,
                        postalCode: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        res.json(order);
    } catch (error) {
        console.error('Failed to fetch order:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

app.put('/api/orders/:id/status', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['en_attente', 'lien_envoye', 'paye', 'en_preparation', 'pret_pour_livraison', 'livre', 'annule'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Statut invalide' });
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                status,
                updatedAt: new Date()
            },
            include: {
                user: true
            }
        });

        res.json({
            ...order,
            message: 'Statut mis à jour avec succès'
        });
    } catch (error) {
        console.error('Failed to update order status:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

app.put('/api/orders/:id/delivery', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryTimeSlot, deliveryDate } = req.body;

        if (!deliveryTimeSlot || !deliveryDate) {
            return res.status(400).json({ error: 'Créneau et date requis' });
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                deliveryTimeSlot,
                deliveryDate,
                status: 'pret_pour_livraison',
                updatedAt: new Date()
            },
            include: {
                user: true
            }
        });

        res.json({
            ...order,
            message: 'Créneau de livraison défini'
        });
    } catch (error) {
        console.error('Failed to set delivery time:', error);
        res.status(500).json({ error: 'Erreur lors de la définition du créneau' });
    }
});

app.post('/api/orders/:id/payment-link', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { sumupLink } = req.body;

        if (!sumupLink || !sumupLink.startsWith('http')) {
            return res.status(400).json({ error: 'Lien de paiement invalide' });
        }

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { user: true }
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                sumupLink,
                sumupLinkSentAt: new Date(),
                status: 'lien_envoye',
                updatedAt: new Date(),
            }
        });

        if (order.contactPreference === 'email' && order.user) {
            await sendPaymentLinkEmail(order, order.user, sumupLink);
        }

        res.json({
            message: order.contactPreference === 'email'
                ? 'Lien enregistré et email envoyé au client'
                : 'Lien enregistré — envoyez-le manuellement au client',
            order: updatedOrder,
            contactPreference: order.contactPreference,
        });
    } catch (error) {
        console.error('Failed to send payment link:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du lien' });
    }
});

app.post('/api/orders/:id/notify', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { user: true }
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        let result;
        if (type === 'ready') {
            result = await sendOrderReadyEmail(order, order.user);
        } else if (type === 'delivered') {
            result = await sendOrderDeliveredEmail(order, order.user);
        } else {
            return res.status(400).json({ error: 'Type de notification invalide' });
        }

        if (result.success) {
            res.json({ message: 'Email envoyé avec succès' });
        } else {
            res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
        }
    } catch (error) {
        console.error('Failed to send notification:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;