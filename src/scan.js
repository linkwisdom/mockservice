/**
 * @file 扫描目标文件夹；将文件夹下所有符合匹配规则的文件加入服务列表
 * @author  liandong (liu@liandong.org liuliandong01@baidu.com)
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

// default config
var config = {
    cache: false,
    pathRegs: [/\w+_\w+/]
};

// `冷服务`缓存; index.js中定义的服务; 支持缓存的服务
var staticList = {};

// `热服务`寻址映射路径
var dynamicList = {};

// 检查文件名是否符合接口定义规则
function matchPath(file, regs) {
    regs || (regs = [/\w+_/]);

    for (var i = 0, l = regs.length; i < l; i++) {
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

function getServicePath(filename, basePath) {
    if (basePath && matchPath(basePath, config.pathRegs)) {
        return basePath.replace('.js', '').replace(/\//g, '_');
    }

    if (matchPath(filename, config.pathRegs)) {
        var item = filename.replace('.js', '');
        return item;
    }
}

function getRelativePath(pathname, baseDir) {
    var idx = pathname.indexOf(baseDir);
    var size = baseDir && baseDir.length || 0;

    if (idx >= 0) {
        return pathname.substr(idx + size + 1);
    } else {
        return pathname;
    }
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
            staticList[item] = pkg[item];
        }
    }
    // 读取当前模块配置，影响子文件夹
    if (fs.existsSync(cwd + '/ms-config.js')) {
        config = require(cwd + '/ms-config.js');
        
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
        } else if (stat.isFile()) {
            var basePath = null;

            if (config.baseDir) {
                basePath = getRelativePath(pathname, config.baseDir);
            }
            
            var item = getServicePath(file, basePath);

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

exports.addService = function (service) {
    for (var item in service) {
        staticList[item] = service[item];
    }
};

// 暴露扫描接口
exports.scanDir = scanDir;
exports.staticList = staticList;
exports.dynamicList = dynamicList;
exports.getServicePath = getServicePath;