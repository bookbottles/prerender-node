const prerender = require('prerender');
const removeScriptTags = require('prerender/lib/plugins/removeScriptTags');
const s3plugin = require('./s3-plugin');

const options = {};

if (process.env.CHROME_LOCATION) {
  options.chromeLocation = process.env.CHROME_LOCATION;
}

server = prerender(options);

server.use(removeScriptTags);
server.use(s3plugin);
server.start();
