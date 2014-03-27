/**
 * @file lib/data 
 * - 物料信息数据集合定义
 *
 * @author Liandong Liu (liuliandong01@baidu.com)
 */
define(function (require, exports, module) {
    module.exports = {
        global: {}, // 默认存储库
        cities: require('json!./cities.json'),
        hospital: require('./hospital')
    };
});