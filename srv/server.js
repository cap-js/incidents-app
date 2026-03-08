const cds = require('@sap/cds');

cds.once('listening', ({ server }) => {
    // Increase timeout to 100 minutes (6000000ms)
    server.requestTimeout = 6000000; // 100 minutes in milliseconds
    console.log('Node.js server timeout ', server.requestTimeout, 'ms');
});

module.exports = cds.server;