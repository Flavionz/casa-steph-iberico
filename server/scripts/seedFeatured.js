const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialFeatured = [
    {
        title: 'Charcuterie Artisanale',
        category: 'Charcuterie',
        image: '/uploads/charcuterie-platter.jpg',
        position: 1,
        isActive: true
    },
    {
        title: 'Sélection de Fromages',
        category: 'Fromages',
        image: '/uploads/fromage-selection.jpg',
        position: 2,
        isActive: true
    },
    {
        title: 'Fromages Affinés',
        category: 'Fromages',
        image: '/uploads/fromage-artisanal.jpg',
        position: 3,
        isActive: true
    },
    {
        title: 'Vins d\'Exception',
        category: 'Vins',
        image: '/uploads/vins-selection.jpg',
        position: 4,
        isActive: true
    },
    {
        title: 'Épicerie Fine',
        category: 'Épicerie',
        image: '/uploads/epicerie-fine.jpg',
        position: 5,
        isActive: true
    },
    {
        title: 'Sangria Authentique',
        category: 'Boissons',
        image: '/uploads/sangria-lolailo.jpg',
        position: 6,
        isActive: true
    }
];

async function seedFeatured() {
    console.log('🌱 Seeding featured products...');

    for (let i = 0; i < initialFeatured.length; i++) {
        const item = initialFeatured[i];
        const id = i + 1;

        await prisma.featuredProduct.upsert({
            where: { id: id },
            update: item,
            create: { id: id, ...item },
        });

        console.log(`✅ Seeded: ${item.title}`);
    }

    console.log('✅ All featured products seeded!');
}

seedFeatured()
    .catch((e) => {
        console.error('❌ Error seeding featured products:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });