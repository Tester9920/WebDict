const log4js = require('log4js');
const config = require('./config/log4js.json');

log4js.configure(config);

const DefaultLogger = log4js.getLogger('default');
const AccessLogger = log4js.getLogger('http');

module.exports = {
    DefaultLogger,
    AccessLogger
};