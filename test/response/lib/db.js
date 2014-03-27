/**
 * @file lib/db 
 * - 物料信息增删改查入口
 *
 * @author Liandong Liu (liuliandong01@baidu.com)
 */
define(function (require, exports, module) {
    var data = require('./data');
    var storage = include('storage');
    storage.init(data);
    module.exports = storage;
});