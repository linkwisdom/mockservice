var fs = require('fs');
var path = require('path');

var ws = {};
var pathList = {};

function scanDir(cwd) {

    if (fs.existsSync(cwd + '/index.js')) {
        var pkg = require(cwd + '/index.js');
        for (var item in pkg) {
            ws[item] = pkg[item];
        }
    }

    var files = fs.readdirSync(cwd);
    files.forEach(function(file) {
        var pathname = path.join(cwd, file);
        var stat = fs.lstatSync(pathname);
        
        if (stat.isDirectory()) {
            scanDir(pathname);
        } else if (file.match(/^((GET)|(MOD)|(DEL)|(ADD))_/)) {
            var item = file.replace('.js', '');
            // 不会预加载; 动态加载；热响应
            pathList[item] = pathname;
        } else if (file == 'index.js') {

        }
    });
}

exports.scanDir = scanDir;

exports.getResponse = function(item) {
    if (item in ws) {
        return ws[item];
    } 
    if (item in pathList) {
        // pathList 上的模块是不缓存的；除非指定为cache==true
        var fileName = pathList[item];
        if (fileName in require.cache) {
            require.cache[fileName];
            delete require.cache[fileName];
        }

        // 所有动态模块不使用缓存
        var obj = require(fileName);
        if ('function' == typeof obj) {
            return obj;
        } else if (obj && item in obj) {
            return obj[item];
        }
    }
};