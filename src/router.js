/**
 * 获得响应服务函数
 *
 * @public
 * @param {string} path 请求path
 * @return {Function}    请求响应函数
 */
exports.getResponse = function (path) {
    var scan = require('./scan');
    var staticList = scan.staticList;
    var dynamicList = scan.dynamicList;
    
    // 先检查冷服务是否存在
    if (path in staticList) {
        return staticList[path];
    }

    // 检查热服务是否存在
    if (path in dynamicList) {

        // dynamicList 上的模块是不缓存的；
        var fileName = dynamicList[path];
        if (fileName in require.cache) {
            delete require.cache[fileName];
        }

        // 所有动态模块不使用缓存
        var obj = {};
        try {
            obj = require(fileName);
            if ('function' == typeof obj) {
                return obj;
            } else if (obj && obj.hasOwnProperty(path)) {
                return obj[path];
            } else {
                return obj;
            }
        } catch (ex) {
            // 预防语法错误导致模块加载失败
            console.log('module error', fileName);

            // 全局错误信息处理方法
            printError(ex, path);
            if (staticList.hasOwnProperty('status_500')) {
                return staticList['status_500'](path, {msg: ex.message});
            }
        }
    } else {
        // 找不到服务文件，需要重启服务，以便扫描mock目录文件是否添加
        console.log(path, 'not found! add mock-file and reboot your server');
    }

    return null;
};