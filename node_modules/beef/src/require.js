var Module = require('module');
var plugin = require('./plugin');

// 循环依赖, 不要怕
global.define = require('./define');

var _mod = module.parent;

function requireModule(module, relativeId, callback) {

    if ('string' == typeof module || module instanceof Array) {
        callback = relativeId;
        relativeId = module;
        return requireModule.call(this, _mod, relativeId, callback);
    }

    if (Array.isArray(relativeId)) {
        // 如果是异步加载
        return callback.apply(this, relativeId.map(requireModule.bind(this, module)));
    }

    // 支持插件形式
    var chunks = relativeId.split("!");
    var prefix;

    if (chunks.length >= 2) {
        prefix = chunks[0];
        relativeId = chunks.slice(1).join("!");
    }

    relativeId = require('./config').resolve(relativeId, module);
    
    var fileName = Module._resolveFilename(relativeId, module);

    if (Array.isArray(fileName)) {
        fileName = fileName[0];
    }

    // 支持文本读取
    if (prefix && prefix in plugin) {
        return plugin[prefix](fileName);
    } else {
        return require(fileName);
    }
}

requireModule.brow = require('./brow');
requireModule.config = require('./config').config;
requireModule.plugin = plugin;

module.exports = requireModule;