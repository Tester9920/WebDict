const log4js = require('log4js');
const config = require('./config/log4js.json');

log4js.configure(config);

const DefaultLogger = log4js.getLogger();
const AppLogger = log4js.getLogger('application');
const AccessLogger = log4js.getLogger('access');
const ErrorLogger = log4js.getLogger('error');

module.exports = {
    DefaultLogger,
    AppLogger,
    AccessLogger,
    ErrorLogger
};