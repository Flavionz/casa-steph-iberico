const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du seeding...');

    // ── Catégories ─────────────────────────────────────────────────────────────
    const catCharcuterie = await prisma.category.upsert({
        where: { name: 'Charcuterie & Fromages' },
        update: {},
        create: { name: 'Charcuterie & Fromages' },
    });

    const catBoissons = await prisma.category.upsert({
        where: { name: 'Boissons & Vins' },
        update: {},
        create: { name: 'Boissons & Vins' },
    });

    const catConserves = await prisma.category.upsert({
        where: { name: 'Épicerie & Conserves' },
        update: {},
        create: { name: 'Épicerie & Conserves' },
    });

    console.log('✅ Catégories créées.');

    // ── Produits ───────────────────────────────────────────────────────────────
    const products = [
        {
            name: 'Jambon Ibérique Pata Negra',
            description: "Le roi des jambons. Affiné 36 mois, saveur intense et texture fondante en bouche. Élevage en plein air, alimentation aux glands.",
            price: 89.90,
            stock: 10,
            categoryId: catCharcuterie.id,
            image: 'https://images.unsplash.com/photo-1590558620893-6c8206411267?q=80&w=600&auto=format',
        },
        {
            name: 'Manchego Affiné 12 Mois',
            description: "Fromage de brebis DOP de La Mancha. Saveur prononcée et légèrement piquante. Parfait en plateau ou râpé sur des pâtes.",
            price: 24.50,
            stock: 25,
            categoryId: catCharcuterie.id,
            image: 'https://images.unsplash.com/photo-1624806992066-5d519d559483?q=80&w=600&auto=format',
        },
        {
            name: 'Rioja Reserva 2018',
            description: "Vin rouge structuré aux notes de vanille et fruits rouges. Vieilli 12 mois en fûts de chêne américain. Idéal avec les viandes rôties.",
            price: 32.75,
            stock: 60,
            categoryId: catBoissons.id,
            image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format',
        },
        {
            name: 'La Planche des Deux',
            description: "Une planche généreuse pour deux, composée d'une sélection de charcuteries ibériques — jambon, lomo, chorizo — accompagnée de fromages affinés et de conserves espagnoles. Parfaite pour un apéritif dînatoire ou un moment gourmand en tête-à-tête.",
            price: 49.90,
            stock: 8,
            categoryId: catCharcuterie.id,
            image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=600&auto=format',
        },
        {
            name: 'Chorizo Ibérique Extra',
            description: "Chorizo artisanal au paprika fumé de La Vera. Texture ferme, goût intense. Se déguste en tranches fines avec du pain de campagne.",
            price: 18.50,
            stock: 30,
            categoryId: catCharcuterie.id,
            image: 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?q=80&w=600&auto=format',
        },
        {
            name: 'Pimientos del Piquillo',
            description: "Poivrons rouges doux grillés au feu de bois, en conserve. Récoltés à Lodosa, Navarre. Incontournables de la cuisine espagnole.",
            price: 8.90,
            stock: 45,
            categoryId: catConserves.id,
            image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&auto=format',
        },
    ];

    for (const product of products) {
        const exists = await prisma.product.findFirst({ where: { name: product.name } });
        if (!exists) await prisma.product.create({ data: product });
    }

    console.log('✅ Produits créés.');

    // ── Utilisateurs demo ──────────────────────────────────────────────────────
    const adminPassword  = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('client123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@auberge.com' },
        update: {},
        create: {
            email: 'admin@auberge.com',
            password: adminPassword,
            role: 'admin',
            civility: 'M.',
            firstName: 'Stéphane',
            lastName: 'Milhau',
            phone: '+33 6 89 66 91 15',
            address: '33 Rue des Chenevières',
            city: 'La Maxe',
            postalCode: '57140',
        },
    });

    await prisma.user.upsert({
        where: { email: 'client@auberge.com' },
        update: {},
        create: {
            email: 'client@auberge.com',
            password: clientPassword,
            role: 'user',
            civility: 'Mme',
            firstName: 'Marie',
            lastName: 'Dupont',
            phone: '+33 6 12 34 56 78',
            address: '12 Rue des Jardins',
            city: 'Metz',
            postalCode: '57000',
        },
    });

    console.log('✅ Utilisateurs demo créés.');
    console.log('');
    console.log('   👤 Admin  : admin@auberge.com  / admin123');
    console.log('   👤 Client : client@auberge.com / client123');
    console.log('');
    console.log('🎉 Seeding terminé.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
