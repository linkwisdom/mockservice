var ms = require('../');

// 脱离edp直接运行mock服务
var argv = process.argv;
if (argv[1] == __filename) {

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
    
    ms.listen(argv[2] || 8848);
}