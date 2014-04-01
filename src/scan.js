/**
 * @file 扫描目标文件夹；将文件夹下所有符合匹配规则的文件加入服务列表
 * 
 * @author  Liandong Liu (liuliandong01@baidu.com)
 * 
 * - 加入staticList列表的为冷服务，运行期间修改无效
 * - 加入dynamicList列表的为热服务，运行期间修改即时生效
 *
 * 除index.js文件中定义的服务；独立mock文件中的服务不会预先加载；
 * mock文件中的语法错误和运行时错误不会停止服务；
 *   但是会在日志信息和返回数据中提示错误信息；
 */

var fs = require('fs');
var path = require('path');
var config = require('./config');

/**
 * `冷服务`列表; 支持缓存的服务
 * 
 * - index.js中定义的服务都为冷服务
 * - 通过模块配置cache=true的模块
 * 
 * @inner
 * @type {Object}
 */
var staticList = {};

/**
 * `热服务`列表；不缓存，每次请求都会更新
 * 
 * @inner
 * @type {Object}
 */
var dynamicList = {};

/**
 * 检查文件名是否符合接口定义规则
 * @param  {string} file 文件名
 * @param  {?RegExp|string} regs 正则表达式或字符串
 * @return {boolean}      是否匹配
 */
function matchPath(file, regs) {
    regs || (regs = [/\w+_/]);

    for (var i = 0, l = regs.length; i < l; i++) {
        var reg = regs[i];
        if ( ('string' == typeof reg ) && ( file.indexOf(reg) > -1 ) ) {
            return true;
        } else if (file.match(reg)) {
            return true;
        }
    }
    return false;
}

/**
 * 递归扫描目标目录
 * 
 * @param  {string} cwd 当前目标目录
 * @return {Object} 当前目录的配置
 */
function scanDir(cwd) {
    // preConfig 是上级目录的配置
    var preConfig = config;

    if (fs.existsSync(cwd + '/index.js')) {
        var pkg = require(cwd + '/index.js');
        for (var item in pkg) {
            staticList[item] = pkg[item];
        }
    }

    // 读取当前模块配置，影响子文件夹
    if (fs.existsSync(cwd + '/ms-config.js')) {
        config = require(cwd + '/ms-config.js');
        config.customize = true;
        
        // 如果未配置规则列表，继承上级目录配置
        config.pathRegs || (config.pathRegs = preConfig.pathRegs);
    }

    var files = fs.readdirSync(cwd);
    files.forEach(function (file) {

        // 避免引入.svn中的文件
        if (file.charAt(0) == '.') {
            return true;
        }

        var pathname = path.join(cwd, file);
        var stat = fs.lstatSync(pathname);
        
        if (stat.isDirectory()) {
            scanDir(pathname);
        } else if (matchPath(file, config.pathRegs)) {
            var item = file.replace('.js', '');
            if (config.cache) {

                // 存入staticList是会被缓存的模块
                staticList[item] = require(pathname);
            } else {

                // 存入dynamicList是不被缓存的模块
                dynamicList[item] = pathname;
            }
        }
    });

    var custom = config;
    config = preConfig;

    // 返回配置信息
    return custom || config || {};
}

/**
 * 暴露扫描文件接口
 * 
 * @type {Function}
 */
exports.scanDir = scanDir;

/**
 * 模块加载错误提示信息
 * @param  {string} path  请求path
 * @param  {?Object} param 请求参数
 * @return {Object}  返回数据
 */
function moduleError(path, param) {
    return {
        status: 500,
        data: {
            path: path,
            msg: 'module require fail'
        }
    };
}

/**
 * 获得响应服务函数
 * @param  {string} path 请求path
 * @return {Function|Object} 请求响应函数或数据对象
 */
exports.getResponse = function (path) {
    // 先检查冷服务是否存在
    if (staticList.hasOwnProperty(path)) {
        return staticList[path];
    }

    // 检查热服务是否存在
    if (dynamicList.hasOwnProperty(path)) {

        // dynamicList 上的模块是不缓存的；
        var fileName = dynamicList[path];
        if (require.cache.hasOwnProperty(fileName)) {
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
            return moduleError;
        }
    }

    return null;
};