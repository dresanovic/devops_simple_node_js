// index.js
const express = require('express');

const app = express();

// Health endpoint for container/liveness checks
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Optional: simple readiness/info endpoint
app.get('/ready', (req, res) => {
    res.json({ status: 'ready', time: new Date().toISOString() });
});

// Demo root route
app.get('/', (req, res) => {
    res.send('Hi there');
});

// New route added for TDD demo
app.get('/greet', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).send('Name query parameter is required');
    }
    res.status(200).send(`Hello, ${name}!`);
});


// Pick port from env (Dockerfile/workflow) or default 8080
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// Only listen when started directly: `node index.js`
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

module.exports = app; // export for tests
