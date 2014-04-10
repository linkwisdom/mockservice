/**
 * @file 测试随机数据产生模块
 *
 */
define(function (require, exports, module) {
    var random = require('random');

    module.exports = function (path, param) {
        return {
            status: 200,
            _status: 300, // http status
            _timeout: 1000, // delay response
            data: {
                name:  random.chars(4, 5),
                birthday: random.formatDate(-5000, -2000, 'YYYY年MM月DD日'),
                timestamp: random.timestamp(-21, 0),
                age: random.int(20, 50),
                inroduction: random.words(4, 5, 
                    ['中国', '大学', '北京', '本科', '计算机'])
            }
        };
    };
});