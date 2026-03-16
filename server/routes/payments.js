const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/payments/create-intent
// Crea un PaymentIntent Stripe e restituisce il clientSecret al frontend
router.post('/create-intent', authenticate, async (req, res) => {
    try {
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
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        // Webhook non ancora configurato — OK in sviluppo
        return res.json({ received: true });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            // TODO: aggiornare paymentStatus dell'ordine a 'paid'
            console.log('Payment succeeded:', event.data.object.id);
            break;
        case 'payment_intent.payment_failed':
            // TODO: aggiornare paymentStatus dell'ordine a 'failed'
            console.log('Payment failed:', event.data.object.id);
            break;
        default:
            break;
    }

    res.json({ received: true });
});

module.exports = router;
