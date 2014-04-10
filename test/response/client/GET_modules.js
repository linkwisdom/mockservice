define(function (require, exports, module) {

    // 测试pacakge配置是否正确
    var moment = require('lib/db');

    // 测试加载module是否正确
    var storage = require('storage');

    storage.set('count', (storage.get('count') || 0) + 1);

    module.exports = function (path, param) {
        return {
            status: 200,
            data: {
                finished: true
            },
            _timeout: 500
        };
    };
});