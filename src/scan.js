/**
 * @file 扫描目标文件夹；将文件夹下所有符合匹配规则的文件加入服务列表
 * @author  liandong (liu@liandong.org liuliandong01@baidu.com)
 * 
 * - 加入ws列表的为冷服务，运行期间修改无效
 * - 加入pathList列表的为热服务，运行期间修改即时生效
 *
 * 除index.js文件中定义的服务；独立mock文件中的服务不会预先加载；
 * mock文件中的语法错误和运行时错误不会停止服务；
 *   但是会在日志信息和返回数据中提示错误信息；
 */

var fs = require('fs');
var path = require('path');

// default config
var config = {
    cache: false,
    pathRegs: [/\w+_\w+/]
};

// `冷服务`缓存; index.js中定义的服务; 支持缓存的服务
var ws = {};

// `热服务`寻址映射路径
var pathList = {};

// 检查文件名是否符合接口定义规则
function matchPath(file, regs) {
    regs || (regs = [/\w+_/]);

    for (var i = 0; i < regs.length; i++) {
        var reg = regs[i];
        if ('string' == typeof reg) {
            if (file.indexOf(reg) > -1) {
                return true;
            }
        } else if (file.match(reg)) {
            return true;
        }
    }

    return false;
}

/**
 * 递归扫描目标目录
 * @param  {string} cwd 当前目标目录
 */
function scanDir(cwd) {
    // preConfig 是上级目录的配置
    var preConfig = config;

    if (fs.existsSync(cwd + '/index.js')) {
        var pkg = require(cwd + '/index.js');
        for (var item in pkg) {
            ws[item] = pkg[item];
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
    files.forEach( function (file) {

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

                // 存入ws是会被缓存的模块
                ws[item] = require(pathname);
            } else {

                // 存入pathList是不被缓存的模块
                pathList[item] = pathname;
            }
        }
    });

    var custom = config;

    config = preConfig;

    // 返回配置信息
    return custom || config || {};
}

// 暴露扫描接口
exports.scanDir = scanDir;

/**
 * 模块加载错误提示信息
 * @param  {string} path  请求path
 * @param  {Object} param 请求参数
 * @return {Object}       返回数据
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
 * @return {Function}    请求响应函数
 */
exports.getResponse = function (path) {
    // 先检查冷服务是否存在
    if (path in ws) {
        return ws[path];
    }

    // 检查热服务是否存在
    if (path in pathList) {

        // pathList 上的模块是不缓存的；
        var fileName = pathList[path];
        if (fileName in require.cache) {
            delete require.cache[fileName];
        }

        // 所有动态模块不使用缓存
        var obj = {};
        try {
            obj = require(fileName);
            if ('function' == typeof obj) {
                return obj;
            } else if (obj && path in obj) {
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
    } else {
        // 找不到服务文件，需要重启服务，以便扫描mock目录文件是否添加
        console.log(path, 'not found! add mock-file and reboot your server');
    }

    return null;
};