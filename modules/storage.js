/**
 * 内存变量存储- 建议所有会话请求相关变量存储
 */
define(function(require, exports, module) {
    var collection = {};

    var db = {
        'default': collection
    };

    // 获取值
    exports.get = function(key) {
        return collection[key];
    };

    // 指定值
    exports.set = function(key, value) {
        collection[key] = value;
    };

    // 切换数据集合
    exports.use = function(collectionName) {
        if (!(collectionName in db)) {
            db[collectionName] = {};
            this.define(collectionName);
        }
        return collection = db[collectionName];
    };

    /**
     * 支持类似mongodb写法
     * storage.aopackage.get('userid')
     */
    exports.define = function(name) {
        this.__defineGetter__(name, function() {
            collection = db[name];
            return exports;
        });
    };
});