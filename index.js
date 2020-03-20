const prerender = require('prerender');
const s3plugin = require('./s3-plugin');

const options = {};

if (process.env.CHROME_LOCATION) {
  options.chromeLocation = process.env.CHROME_LOCATION;
}

server = prerender(options);

server.use(s3plugin);
server.start();
