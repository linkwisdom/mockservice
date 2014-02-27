exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var ms = require('../src/index');
ms.config({
    dir: __dirname + '/response',
    packages: {
        'common': './common',
        'client': './client',
        'lib': './lib'
    },
    logError: {
        logFile: 'ms-error-log'
    }
});

exports.getLocations = function () {
    return [
        {
            location: /^\/request.ajax/, 
            handler: ms.request()
        }
    ];
};
