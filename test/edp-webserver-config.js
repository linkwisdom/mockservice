exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var ms = require('../src/index');

/**
 * 配置多个service模块
 * - dir 必须字段，指定扫描的路径
 * - logError： 指定错误信息处理方式
 * - name 模块名，方便调用
 */
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
    },
    {
        name: 'service',
        dir: './service'
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