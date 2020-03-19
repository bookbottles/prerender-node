const prerender = require('prerender');
const server = prerender();
const s3plugin = require('./s3-plugin');

server.use(s3plugin);

server.start();
