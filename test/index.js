var ms = require('../');

// 脱离edp直接运行mock服务
var argv = process.argv;
if (argv[1] == __filename) {
    ms.config({
        dir: __dirname + '/response'
    });
    ms.listen(argv[2] || 8848);
}