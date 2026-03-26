const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockOrders = [
    {
        userId: 1,
        status: 'en_attente',
        total: 127.40,
        items: JSON.stringify([
            { id: 1, name: 'Jambon Ibérique Pata Negra', quantity: 2, price: 45.90 },
            { id: 2, name: 'Manchego Affiné 12 Mois', quantity: 1, price: 24.50 },
            { id: 3, name: 'Chorizo Extra', quantity: 1, price: 11.10 }
        ]),
        deliveryAddress: '25 Rue de la République',
        postalCode: '57000',
        phone: '+33 6 12 34 56 78',
        notes: 'Livraison après 14h si possible',
        paymentMethod: 'cash',
        paymentStatus: 'pending'
    },
    {
        userId: 1,
        status: 'livre',
        total: 89.90,
        items: JSON.stringify([
            { id: 4, name: 'Vin Ribera del Duero', quantity: 1, price: 32.75 },
            { id: 5, name: 'Huile d\'Olive Extra Vierge', quantity: 1, price: 18.90 },
            { id: 6, name: 'Piments Piquillo', quantity: 2, price: 19.10 }
        ]),
        deliveryAddress: '12 Avenue Foch',
        postalCode: '57050',
        phone: '+33 6 98 76 54 32',
        notes: null,
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        deliveryDate: '2025-02-13',
        deliveryTimeSlot: '14:00 - 16:00'
    },
    {
        userId: 1,
        status: 'livre',
        total: 254.30,
        items: JSON.stringify([
            { id: 1, name: 'Jambon Ibérique Pata Negra', quantity: 3, price: 45.90 },
            { id: 7, name: 'Plateau de Fromages', quantity: 2, price: 38.50 },
            { id: 8, name: 'Sangria Lolailo', quantity: 2, price: 12.90 }
        ]),
        deliveryAddress: '8 Rue Serpenoise',
        postalCode: '57000',
        phone: '+33 6 45 78 90 12',
        notes: 'Interphone : Dupont',
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        deliveryDate: '2025-02-10',
        deliveryTimeSlot: '11:00 - 13:00'
    },
    {
        userId: 1,
        status: 'annule',
        total: 45.50,
        items: JSON.stringify([
            { id: 9, name: 'Chips Truffe Noire', quantity: 3, price: 8.90 },
            { id: 10, name: 'Olives Vertes Farcies', quantity: 2, price: 9.40 }
        ]),
        deliveryAddress: '15 Boulevard Poincaré',
        postalCode: '57140',
        phone: '+33 6 23 45 67 89',
        notes: 'Client a annulé - changement de date',
        paymentMethod: 'cash',
        paymentStatus: 'cancelled'
    },
    {
        userId: 1,
        status: 'livre',
        total: 156.80,
        items: JSON.stringify([
            { id: 1, name: 'Jambon Ibérique Pata Negra', quantity: 2, price: 45.90 },
            { id: 11, name: 'Chorizo Bellota', quantity: 2, price: 16.50 },
            { id: 12, name: 'Fromage Manchego Gran Reserva', quantity: 1, price: 31.50 }
        ]),
        deliveryAddress: '42 Rue aux Arènes',
        postalCode: '57000',
        phone: '+33 6 87 65 43 21',
        notes: null,
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        deliveryDate: '2025-02-08',
        deliveryTimeSlot: '16:00 - 18:00'
    }
];

async function seedOrders() {
    console.log('🌱 Seeding orders...');

    try {
        const user = await prisma.user.findFirst();

        if (!user) {
            console.log('❌ No user found. Create a user first.');
            return;
        }

        console.log(`✅ Trovato utente: ${user.email} (ID: ${user.id})`);

        await prisma.order.deleteMany({});
        console.log('🗑️  Ordini esistenti cancellati');

        for (const orderData of mockOrders) {
            const order = await prisma.order.create({
                data: {
                    ...orderData,
                    userId: user.id
                }
            });
            console.log(`✅ Ordine #${order.id} creato - ${order.status} - ${order.total}€`);
        }

        console.log('✅ Seeding complete!');
        console.log(`📊 ${mockOrders.length} orders created`);
    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedOrders();