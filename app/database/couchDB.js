const nano = require('nano');
const config = require('config');

module.exports = nano(config.COUCHDB_URL);
