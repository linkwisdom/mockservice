var ms = require('../');

// 为edp提供请求接口
exports.request = function(config) {
    config.dir = __dirname + '/response';
    ms.config(config);



    return function(context) {
        var request = context.request;
        var response = context.response;
        request.body = request.bodyBuffer;
        ms.serve(request, response);
    };
};

// 脱离edp直接运行mock服务
var argv = process.argv;
if (argv[1] == __filename) {
    
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
    
    ms.listen(argv[2] || 8848);
}