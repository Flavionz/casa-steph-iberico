const express = require('express');
const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

const router = express.Router();

// Inizializzazione lazy: evita il crash all'avvio se STRIPE_SECRET_KEY non è configurata
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY non configurata nel file .env');
    }
    return Stripe(process.env.STRIPE_SECRET_KEY);
};

// POST /api/payments/create-intent
// Crea un PaymentIntent Stripe e restituisce il clientSecret al frontend
router.post('/create-intent', authenticate, async (req, res) => {
    try {
        const stripe = getStripe();
        const { amount } = req.body;

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return res.status(400).json({ error: 'Montant invalide' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(parseFloat(amount) * 100), // Stripe usa i centesimi
            currency: 'eur',
            metadata: {
                userId: req.user.userId.toString(),
            },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Failed to create payment intent:', error);
        res.status(500).json({ error: 'Erreur lors de la création du paiement' });
    }
});

// POST /api/payments/webhook
// Gestisce gli eventi Stripe (configurare STRIPE_WEBHOOK_SECRET per produzione)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        // Webhook non ancora configurato — OK in sviluppo
        return res.json({ received: true });
    }

    let event;
    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const paymentIntent = event.data.object;

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await prisma.order.updateMany({
                    where: { paymentIntentId: paymentIntent.id },
                    data: { paymentStatus: 'paid' }
                });
                console.log('Webhook: payment succeeded, order updated —', paymentIntent.id);
                break;

            case 'payment_intent.payment_failed':
                await prisma.order.updateMany({
                    where: { paymentIntentId: paymentIntent.id },
                    data: { paymentStatus: 'failed' }
                });
                console.log('Webhook: payment failed, order updated —', paymentIntent.id);
                break;

            default:
                break;
        }
    } catch (err) {
        console.error('Webhook DB update error:', err);
        return res.status(500).json({ error: 'Webhook handler error' });
    }

    res.json({ received: true });
});

module.exports = router;
