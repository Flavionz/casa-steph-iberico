const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
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
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { civility, firstName, lastName, phone, address, city, postalCode } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                civility,
                firstName,
                lastName,
                phone,
                address,
                city,
                postalCode
            },
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
                postalCode: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: req.user.userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Erreur lors de la modification du mot de passe' });
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

module.exports = {
    getUserProfile,
    updateUserProfile,
    updatePassword,
    getUserOrders
};