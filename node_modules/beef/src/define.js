var fs = require("fs");
var Module = require("module");

// 依赖包管理
var _stack = [];
var _compile = module.constructor.prototype._compile;

module.constructor.prototype._compile = function(content, filename){  
    _stack.push(this);
    try {
        return _compile.call(this, content, filename);
    } finally {
        _stack.pop();
    }
};

// 定义define
function define(id, injects, factory) {

    // infere the module
    var currentModule = _stack[_stack.length-1];
    var mod = currentModule || module.parent || require.main;
    
    // 如果小于三个参数
    if (!factory) {
        // two or less arguments
        factory = injects;
        if (factory) {

            // 如果只有两个参数, 
            if (typeof id === 'string') {
                if (id !== mod.id) {
                    throw new Error('module id must be consistent');
                }
                // default injects
                injects = [];
            } else {
                // anonymous, deps included
                injects = id;          
            }
        } else {

            // 如果只有一个参数, 这个参数就是构造函数
            factory = id;
            injects = [];
        }
    }

    var req = require('./require').bind(this, mod);

    id = mod.id;

    if (typeof factory !== 'function') {
        // 如果构造对象是函数
        return mod.exports = factory;
    }

    // 注入参数
    injects.unshift('require', 'exports', 'module');
    var arglist =  injects.map(function (injection) {
        switch (injection) {
            // check for CommonJS injection variables
            case 'require': return req;
            case 'exports': return mod.exports;
            case 'module': return mod;
            default:
                // a module dependency
                return req(injection);
        }
    });
    
    // 获得构造对象或返回的数据
    var returned = factory.apply(mod.exports, arglist);
    
    if (returned) {
        // 允许使用return方式返回值
        mod.exports = returned;
    }
};

module.exports = define;