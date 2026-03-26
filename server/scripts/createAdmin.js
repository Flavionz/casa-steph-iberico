const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@auberge.com' }
        });

        if (existingAdmin) {
            console.log('✅ Admin already exists');
            console.log('📧 Email: admin@auberge.com');
            console.log('🔑 Password: admin');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin', 10);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@auberge.com',
                password: hashedPassword,
                role: 'admin'
            }
        });

        console.log('✅ Admin created successfully');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: admin');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
