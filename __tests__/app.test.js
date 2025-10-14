const request = require('supertest');
const app = require('../index'); // import the exported Express app

describe('GET /', () => {
    it('responds with 200 and "Hi there"', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Hi there');
    });
    it('returns 404 for unknown routes', async () => {
        const res = await request(app).get('/nope');
        expect(res.status).toBe(404);
    });
});
