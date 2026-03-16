const express = require('express');
const Stripe = require('stripe');
const { authenticate } = require('../middleware/authMiddleware');

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
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
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
