/**
 * @file 存储模块
 * 
 * @author Liandong Liu (liuliandong01@baidu.com)
 *
 * ##测试内容
 * - path与param测试是否正确获得
 * - lib/db 包路径解析是否正常
 * - storage 是否能够正确解析物料数据
 */
define(function (require, exports, module) {
    var db = require('lib/db');
    module.exports = function (path, param) {
        var cityName = param.cityName;
        return {
            data: db.cities[cityName],
            status: 200
        };
    };
});