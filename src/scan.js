var fs = require('fs');
var path = require('path');

var ws = {};
var pathList = {};

function scanDir(cwd) {
    var files = fs.readdirSync(cwd);
    files.forEach(function(file) {
        var pathname = path.join(cwd, file);
        var stat = fs.lstatSync(pathname);

        if (stat.isDirectory()) {
            if (fs.existsSync(pathname + '/index.js')) {
                var pkg = require(pathname);
                for (var item in pkg) {
                    ws[item] = pkg[item];
                }
            }
            // 递归搜索
            scanDir(pathname);
        } else if (file.match(/^((GET)|(MOD)|(DEL))_/)) {
            var item = file.replace('.js', '');
            // 不会预加载; 动态加载；热响应
            pathList[item] = pathname;
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
            var json = require.cache[fileName];
            if (!json || json.cache == true) {
                delete require.cache[fileName];
            }
        }

        // 所有动态模块不使用缓存
        return require(fileName);
    }
};