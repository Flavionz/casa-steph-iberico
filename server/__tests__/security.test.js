/**
 * Security tests — middleware auth & input validation
 *
 * These tests do NOT require a real database.
 * The middleware rejects requests before any DB call is made.
 */

// Imposta il secret PRIMA che dotenv carichi il .env (dotenv non sovrascrive env già impostate)
const TEST_SECRET = 'test-secret-key-for-jest';
process.env.JWT_SECRET = TEST_SECRET;

// Mock Prisma so the app module loads without a real DB connection
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        user: {
            findUnique: jest.fn().mockResolvedValue(null),
            create: jest.fn(),
        },
        product: {
            findMany: jest.fn().mockResolvedValue([]),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        category: { findMany: jest.fn().mockResolvedValue([]) },
        featuredProduct: {
            findMany: jest.fn().mockResolvedValue([]),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        order: { findMany: jest.fn().mockResolvedValue([]), findUnique: jest.fn(), update: jest.fn() },
    })),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');

// Token firmato con ruolo "user" (non admin)
const userToken = jwt.sign(
    { userId: 1, email: 'user@test.com', role: 'user' },
    TEST_SECRET,
    { expiresIn: '1h' }
);

// Token firmato con ruolo "admin"
const adminToken = jwt.sign(
    { userId: 2, email: 'admin@test.com', role: 'admin' },
    TEST_SECRET,
    { expiresIn: '1h' }
);

// ─────────────────────────────────────────────────────────
// 1. Route protette — nessun token → 401
// ─────────────────────────────────────────────────────────
describe('Route admin senza token → 401', () => {
    const routes = [
        ['post',   '/api/products'],
        ['put',    '/api/products/1'],
        ['delete', '/api/products/1'],
        ['post',   '/api/featured'],
        ['put',    '/api/featured/1'],
        ['delete', '/api/featured/1'],
        ['get',    '/api/orders/admin/all'],
        ['put',    '/api/orders/1/status'],
        ['put',    '/api/orders/1/delivery'],
        ['post',   '/api/orders/1/notify'],
    ];

    test.each(routes)('%s %s', async (method, path) => {
        const res = await request(app)[method](path);
        expect(res.status).toBe(401);
    });
});

// ─────────────────────────────────────────────────────────
// 2. Route admin con token utente normale → 403
// ─────────────────────────────────────────────────────────
describe('Route admin con token user (non admin) → 403', () => {
    const routes = [
        ['post',   '/api/products'],
        ['put',    '/api/products/1'],
        ['delete', '/api/products/1'],
        ['post',   '/api/featured'],
        ['put',    '/api/featured/1'],
        ['delete', '/api/featured/1'],
        ['get',    '/api/orders/admin/all'],
        ['put',    '/api/orders/1/status'],
        ['put',    '/api/orders/1/delivery'],
        ['post',   '/api/orders/1/notify'],
    ];

    test.each(routes)('%s %s', async (method, path) => {
        const res = await request(app)[method](path)
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(403);
    });
});

// ─────────────────────────────────────────────────────────
// 3. Token malformato → 401
// ─────────────────────────────────────────────────────────
describe('Token non valido → 401', () => {
    test('token scaduto', async () => {
        const expiredToken = jwt.sign(
            { userId: 1, email: 'user@test.com', role: 'admin' },
            TEST_SECRET,
            { expiresIn: '-1s' }
        );
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(res.status).toBe(401);
    });

    test('token con firma errata', async () => {
        const fakeToken = jwt.sign(
            { userId: 1, email: 'hacker@test.com', role: 'admin' },
            'chiave-sbagliata',
            { expiresIn: '1h' }
        );
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(res.status).toBe(401);
    });

    test('header Authorization malformato', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', 'not-a-bearer-token');
        expect(res.status).toBe(401);
    });
});

// ─────────────────────────────────────────────────────────
// 4. Validazione input — auth routes
// ─────────────────────────────────────────────────────────
describe('Auth — validazione input', () => {
    test('login senza email e password → 400', async () => {
        const res = await request(app).post('/api/auth/login').send({});
        expect(res.status).toBe(400);
    });

    test('login senza password → 400', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@test.com' });
        expect(res.status).toBe(400);
    });

    test('register senza campi → 400', async () => {
        const res = await request(app).post('/api/auth/register').send({});
        expect(res.status).toBe(400);
    });

    test('register con password troppo corta (< 6 chars) → 400', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@test.com', password: '123' });
        expect(res.status).toBe(400);
    });

    test('login con credenziali errate → 401', async () => {
        // Il mock Prisma restituisce null → utente non trovato
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nonexistent@test.com', password: 'wrongpassword' });
        expect(res.status).toBe(401);
    });
});

// ─────────────────────────────────────────────────────────
// 5. Route pubbliche — devono rimanere accessibili
// ─────────────────────────────────────────────────────────
describe('Route pubbliche → accessibili senza token', () => {
    test('GET /api/products → non 401', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).not.toBe(401);
    });

    test('GET /api/categories → non 401', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.status).not.toBe(401);
    });

    test('GET /api/featured → non 401', async () => {
        const res = await request(app).get('/api/featured');
        expect(res.status).not.toBe(401);
    });
});
