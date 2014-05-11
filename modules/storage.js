/**
 * @file memory storage of dataset
 * 
 * @author Liandong Liu (liuliandong01@baidu.com)
 */

/** 
 * 当前默认数据集
 * @inner
 * @type {Object}
 */
var collection = {};

/**
 * 内存数据库集合
 * @inner
 * @type {Object}
 */
var db = {
    global: collection
};

/**
 * 初始化数据库
 * 
 * @param  {Object} data 初始化的数据集合
 * @return {Object}      当前数据集合
 * @public
 */
exports.init = function (data) {
    for (var item in data) {
        db[item] = data[item];
        this.define(item);
    }
    collection = db.global || {};
    return collection;
};

exports.addSet = function (data) {
    return this.init(data);
};

/**
 * 从当前集合获取值
 * 
 * @param  {string} key 数据键
 * @return {*}     对应key的值
 * @public
 */
exports.get = function (key) {
    return key? collection[key] : collection;
};

/**
 * 设定值
 * 
 * @param {string} key   数据键
 * @param {*} value 数据值
 * @return {Object} 当前集合
 * @public
 */
exports.set = function (key, value) {
    collection[key] = value;
    return collection;
};

/**
 * 使用集合
 * 
 * @param  {string} name 集合名称
 * @return {Object}                当前集合
 * @public
 */
exports.use = function (name) {
    if (!(name in db)) {
        db[name] = {};
        this.define(name);
    }
    return collection = db[name];
};

/**
 * 定义存取器
 * 
 * 支持类似mongodb写法
 * storage.aopackage.get('userid')
 *
 * @param {string} name 集合名
 * @public
 */
exports.define = function (name) {
    this.__defineGetter__(name, function () {
        collection = db[name];
        return collection;
    });
};