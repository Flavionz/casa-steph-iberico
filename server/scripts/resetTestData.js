/**
 * resetTestData.js
 * Cancella tutti gli ordini e ricrea 3 ordini di test puliti
 * con utenti che hanno tutti i campi obbligatori compilati.
 *
 * Usage: node server/scripts/resetTestData.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetTestData() {
    console.log('🧹 Reset dati di test...\n');

    try {
        // 1. Cancella tutti gli ordini
        const deleted = await prisma.order.deleteMany({});
        console.log(`🗑️  ${deleted.count} ordini cancellati`);

        // 2. Aggiorna l'admin con nome e cognome
        await prisma.user.updateMany({
            where: { role: 'admin' },
            data: {
                firstName: 'Admin',
                lastName: 'Auberge',
                phone: '+33 6 00 00 00 00',
            },
        });
        console.log('✅ Utente admin aggiornato (Admin Auberge)');

        // 3. Crea (o aggiorna) 2 utenti cliente di test
        const passwordHash = await bcrypt.hash('Test1234!', 10);

        const marie = await prisma.user.upsert({
            where: { email: 'marie.dupont@test.fr' },
            update: {
                firstName: 'Marie',
                lastName: 'Dupont',
                phone: '+33 6 12 34 56 78',
                address: '25 Rue de la République',
                city: 'Metz',
                postalCode: '57000',
            },
            create: {
                email: 'marie.dupont@test.fr',
                password: passwordHash,
                role: 'user',
                firstName: 'Marie',
                lastName: 'Dupont',
                phone: '+33 6 12 34 56 78',
                address: '25 Rue de la République',
                city: 'Metz',
                postalCode: '57000',
            },
        });
        console.log(`✅ Utente test: ${marie.email} (ID: ${marie.id})`);

        const thomas = await prisma.user.upsert({
            where: { email: 'thomas.martin@test.fr' },
            update: {
                firstName: 'Thomas',
                lastName: 'Martin',
                phone: '+33 6 98 76 54 32',
                address: '8 Rue Serpenoise',
                city: 'Metz',
                postalCode: '57000',
            },
            create: {
                email: 'thomas.martin@test.fr',
                password: passwordHash,
                role: 'user',
                firstName: 'Thomas',
                lastName: 'Martin',
                phone: '+33 6 98 76 54 32',
                address: '8 Rue Serpenoise',
                city: 'Metz',
                postalCode: '57000',
            },
        });
        console.log(`✅ Utente test: ${thomas.email} (ID: ${thomas.id})`);

        // 4. Crea 3 ordini di test in stati diversi
        const orders = [
            {
                userId: marie.id,
                status: 'en_attente',
                total: 127.40,
                items: JSON.stringify([
                    { name: 'Jambon Ibérique Pata Negra', quantity: 2, price: 45.90 },
                    { name: 'Manchego Affiné 12 Mois', quantity: 1, price: 24.50 },
                    { name: 'Chorizo Extra', quantity: 1, price: 11.10 },
                ]),
                deliveryAddress: '25 Rue de la République',
                postalCode: '57000',
                phone: '+33 6 12 34 56 78',
                notes: 'Livraison après 14h si possible',
                paymentMethod: 'cash',
                paymentStatus: 'pending',
            },
            {
                userId: thomas.id,
                status: 'en_preparation',
                total: 89.90,
                items: JSON.stringify([
                    { name: 'Vin Ribera del Duero', quantity: 1, price: 32.75 },
                    { name: "Huile d'Olive Extra Vierge", quantity: 2, price: 18.90 },
                    { name: 'Piments Piquillo', quantity: 1, price: 19.35 },
                ]),
                deliveryAddress: '8 Rue Serpenoise',
                postalCode: '57000',
                phone: '+33 6 98 76 54 32',
                notes: null,
                paymentMethod: 'cash',
                paymentStatus: 'pending',
            },
            {
                userId: marie.id,
                status: 'livre',
                total: 68.50,
                items: JSON.stringify([
                    { name: 'Sangria Lolailo', quantity: 2, price: 12.90 },
                    { name: 'Chips Truffe Noire', quantity: 3, price: 8.90 },
                    { name: 'Olives Vertes Farcies', quantity: 2, price: 6.75 },
                ]),
                deliveryAddress: '25 Rue de la République',
                postalCode: '57000',
                phone: '+33 6 12 34 56 78',
                notes: null,
                paymentMethod: 'cash',
                paymentStatus: 'paid',
                deliveryDate: '2026-03-10',
                deliveryTimeSlot: '14:00 - 16:00',
            },
        ];

        console.log('\n📦 Creazione ordini di test...');
        for (const data of orders) {
            const order = await prisma.order.create({ data });
            console.log(`  ✅ Ordine #${order.id} — ${order.status} — ${order.total}€ — userId: ${order.userId}`);
        }

        console.log('\n✨ Reset completato!');
        console.log('─────────────────────────────────────');
        console.log('Credenziali utenti di test:');
        console.log('  marie.dupont@test.fr   / Test1234!');
        console.log('  thomas.martin@test.fr  / Test1234!');
        console.log('─────────────────────────────────────');
    } catch (error) {
        console.error('❌ Errore:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetTestData();
