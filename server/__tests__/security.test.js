/**
 * Security tests — middleware auth & input validation
 *
 * These tests do NOT require a real database.
 * The middleware rejects requests before any DB call is made.
 */

// Set the secret BEFORE dotenv loads .env (dotenv does not override already-set env vars)
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

// Token signed with role "user" (not admin)
const userToken = jwt.sign(
    { userId: 1, email: 'user@test.com', role: 'user' },
    TEST_SECRET,
    { expiresIn: '1h' }
);

// Token signed with role "admin"
const adminToken = jwt.sign(
    { userId: 2, email: 'admin@test.com', role: 'admin' },
    TEST_SECRET,
    { expiresIn: '1h' }
);

// ─────────────────────────────────────────────────────────
// 1. Protected routes — no token → 401
// ─────────────────────────────────────────────────────────
describe('Admin routes without token → 401', () => {
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
// 2. Admin routes with regular user token → 403
// ─────────────────────────────────────────────────────────
describe('Admin routes with user token (non-admin) → 403', () => {
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
// 3. Malformed token → 401
// ─────────────────────────────────────────────────────────
describe('Invalid token → 401', () => {
    test('expired token', async () => {
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

    test('token with wrong signature', async () => {
        const fakeToken = jwt.sign(
            { userId: 1, email: 'hacker@test.com', role: 'admin' },
            'wrong-secret-key',
            { expiresIn: '1h' }
        );
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(res.status).toBe(401);
    });

    test('malformed Authorization header', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', 'not-a-bearer-token');
        expect(res.status).toBe(401);
    });
});

// ─────────────────────────────────────────────────────────
// 4. Input validation — auth routes
// ─────────────────────────────────────────────────────────
describe('Auth — input validation', () => {
    test('login without email and password → 400', async () => {
        const res = await request(app).post('/api/auth/login').send({});
        expect(res.status).toBe(400);
    });

    test('login without password → 400', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@test.com' });
        expect(res.status).toBe(400);
    });

    test('register without fields → 400', async () => {
        const res = await request(app).post('/api/auth/register').send({});
        expect(res.status).toBe(400);
    });

    test('register with password too short (< 6 chars) → 400', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@test.com', password: '123' });
        expect(res.status).toBe(400);
    });

    test('login with wrong credentials → 401', async () => {
        // Prisma mock returns null → user not found
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nonexistent@test.com', password: 'wrongpassword' });
        expect(res.status).toBe(401);
    });
});

// ─────────────────────────────────────────────────────────
// 5. Public routes — must remain accessible
// ─────────────────────────────────────────────────────────
describe('Public routes → accessible without token', () => {
    test('GET /api/products → not 401', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).not.toBe(401);
    });

    test('GET /api/categories → not 401', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.status).not.toBe(401);
    });

    test('GET /api/featured → not 401', async () => {
        const res = await request(app).get('/api/featured');
        expect(res.status).not.toBe(401);
    });
});
