exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var ms = require('mockservice');
ms.config({dir: __dirname + '/response'});

exports.getLocations = function () {
    return [
        {
            location: /^\/request.ajax/, 
            handler: ms.request({})
        }
    ];
};
