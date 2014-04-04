exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var ms = require('../src/index');

ms.config([
    {
        dir: './response',
        logError: {
            logFile: 'ms-error-log'
        }
    },
    {
        name: 'debug',
        dir: './debug'
    }
]);

exports.getLocations = function () {
    return [
        {
            location: /^\/request.ajax/, 
            handler: ms.request()
        }
    ];
};