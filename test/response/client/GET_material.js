/**
 * @file 存储模块
 * 
 * @author Liandong Liu (liuliandong01@baidu.com)
 */
define(function (require, exports, module) {
    var db = require('lib/db');
    module.exports = function (path, param) {
        return {
            data: db.cities,
            _timeout: 500
        };
    };
});