// index.js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
});

// Only listen when started directly: `node index.js`
if (require.main === module) {
    app.listen(8080, () => {
        console.log('Listening on port 8080');
    });
}

module.exports = app; // <-- export for tests
