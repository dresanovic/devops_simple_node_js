const request = require('supertest');
const app = require('../index'); // the exported Express app

describe('Express routes', () => {
    test('GET / → 200 and "Hi there"', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Hi there');
        expect(res.headers['content-type']).toMatch(/text\/html|text\/plain/);
    });

    test('GET /health → 200 and "OK"', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.text).toBe('OK');
    });

    // Express treats HEAD as GET (without body), so this should still be 200
    test('HEAD /health → 200 (Express HEAD handling)', async () => {
        const res = await request(app).head('/health');
        expect(res.status).toBe(200);
    });

    test('GET /ready → 200 and JSON payload with ISO time', async () => {
        const res = await request(app).get('/ready');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
        expect(res.body).toHaveProperty('status', 'ready');
        expect(typeof res.body.time).toBe('string');
        // time is valid ISO and close to "now"
        const parsed = Date.parse(res.body.time);
        expect(Number.isNaN(parsed)).toBe(false);
        const deltaMs = Math.abs(Date.now() - parsed);
        expect(deltaMs).toBeLessThan(10_000); // within 10 seconds
    });

    test('Unknown route → 404', async () => {
        const res = await request(app).get('/nope');
        expect(res.status).toBe(404);
    });

    test('Unsupported method on existing path (POST /) → 404', async () => {
        const res = await request(app).post('/');
        expect(res.status).toBe(404);
    });

    describe('GET /greet', () => {
        it('responds with a personalized greeting', async () => {
            const res = await request(app).get('/greet?name=Daniel');
            expect(res.status).toBe(200);
            expect(res.text).toBe('Hello, Daniel!');
        });

        it('returns 400 when name query param is missing', async () => {
            const res = await request(app).get('/greet');
            expect(res.status).toBe(400);
            expect(res.text).toBe('Name query parameter is required');
        });
    });
});
