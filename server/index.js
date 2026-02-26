const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Hola! Il server Auberge Espagnol è online 🇪🇸');
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
            image: p.image ? `http://localhost:${PORT}${p.image}` : null
        })));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({ error: 'Erreur dans la récupération des produits' });
    }
});

app.post('/api/products', upload.single('image'), async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;
    const imageRelativePath = req.file ? `/uploads/${req.file.filename}` : null;
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);
    const parsedCategoryId = parseInt(categoryId, 10);

    if (!name || isNaN(parsedPrice) || isNaN(parsedCategoryId)) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to clean up invalid file:", err);
            });
        }
        return res.status(400).json({ error: "Données manquantes: nom, prix ou catégorie sont requis." });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                name: name,
                description: description,
                price: parsedPrice,
                stock: parsedStock,
                image: imageRelativePath,
                categoryId: parsedCategoryId,
            }
        });

        res.status(201).json({
            ...newProduct,
            image: newProduct.image ? `http://localhost:${PORT}${newProduct.image}` : null,
            message: 'Produit créé avec succès.'
        });
    } catch (error) {
        console.error("Failed to save product:", error);
        res.status(500).json({ error: 'Erreur interne du serveur lors de la publication.' });
    }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
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
                const oldImagePath = path.join(__dirname, oldProduct.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.json({
            ...updatedProduct,
            image: updatedProduct.image ? `http://localhost:${PORT}${updatedProduct.image}` : null,
            message: 'Produit modifié avec succès'
        });
    } catch (error) {
        console.error('Failed to update product:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        if (product.image) {
            const imagePath = path.join(__dirname, product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
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
            image: f.image.startsWith('http') ? f.image : `http://localhost:${PORT}${f.image}`
        })));
    } catch (error) {
        console.error('Failed to fetch featured products:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

app.post('/api/featured', upload.single('image'), async (req, res) => {
    try {
        const { title, category, position } = req.body;
        const imageRelativePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !category || !imageRelativePath) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        const newFeatured = await prisma.featuredProduct.create({
            data: {
                title,
                category,
                image: imageRelativePath,
                position: parseInt(position, 10) || 999,
                isActive: true
            }
        });

        res.status(201).json({
            ...newFeatured,
            image: `http://localhost:${PORT}${newFeatured.image}`,
            message: 'Produit vitrine créé avec succès'
        });
    } catch (error) {
        console.error('Failed to create featured product:', error);
        res.status(500).json({ error: 'Erreur lors de la création' });
    }
});

app.put('/api/featured/:id', upload.single('image'), async (req, res) => {
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
                const oldImagePath = path.join(__dirname, oldFeatured.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updated = await prisma.featuredProduct.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.json({
            ...updated,
            image: updated.image.startsWith('http') ? updated.image : `http://localhost:${PORT}${updated.image}`,
            message: 'Produit vitrine modifié avec succès'
        });
    } catch (error) {
        console.error('Failed to update featured product:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
});

app.delete('/api/featured/:id', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
    console.log(`🔐 Auth API disponibile su http://localhost:${PORT}/api/auth`);
    console.log(`👤 User API disponibile su http://localhost:${PORT}/api/user`);
    console.log(`📦 Orders API disponibile su http://localhost:${PORT}/api/orders`);
    console.log(`🎨 Featured API disponibile su http://localhost:${PORT}/api/featured`);
});