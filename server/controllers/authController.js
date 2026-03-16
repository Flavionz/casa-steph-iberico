const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../services/emailService');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'user'
            }
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Compte créé avec succès',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Erreur registration:', error);
        res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Connexion réussie',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                civility: user.civility,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
                city: user.city,
                postalCode: user.postalCode,
            },
            token
        });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                civility: user.civility,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
                city: user.city,
                postalCode: user.postalCode,
            }
        });

    } catch (error) {
        console.error('Erreur verify token:', error);
        res.status(401).json({ error: 'Token invalide' });
    }
};

const logout = async (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email requis' });

        const user = await prisma.user.findUnique({ where: { email } });

        // Always return success to avoid user enumeration
        if (!user) {
            return res.json({ message: 'Si cet email existe, un lien a été envoyé.' });
        }

        const resetToken = jwt.sign(
            { userId: user.id, purpose: 'reset' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`;
        await sendPasswordResetEmail(user, resetLink);

        res.json({ message: 'Si cet email existe, un lien a été envoyé.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch {
            return res.status(400).json({ error: 'Lien invalide ou expiré' });
        }

        if (decoded.purpose !== 'reset') {
            return res.status(400).json({ error: 'Token invalide' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword },
        });

        res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    register,
    login,
    verifyToken,
    logout,
    forgotPassword,
    resetPassword,
};