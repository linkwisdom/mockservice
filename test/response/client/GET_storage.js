define(function (require, exports, module) {
    var storage = require('storage');
    storage.set('message', 'ok');

    module.exports = function (path, param) {
        return {
            status: 200,
            data: storage.get('message'),
            _timeout: 50
        };
    };
});