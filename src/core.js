/**
 * @file 为前端构造数据提供mockservice服务
 * 
 * @refer https://github.com/fcfe/mockservice
 * 
 * @author  Liandong Liu (liuliandong01@baidu.com)
 */

/**
 * 服务扫描发现
 * 
 * @type {Object}
 */
var scan = require('./scan');

/**
 * configMap 保存不同路径的配置
 * 
 * @type {Object}
 */
var configMap = {};

/** 
 * beef是为了支持A/CMDJS模块在服务端共用
 * 
 * @type {Object}
 * @public
 */
require = require('beef');

/**
 * HTTP 响应Response的mine类型
 * 
 * @type {Object}
 */
var headContent = {
    'status': 200,
    'content-type': 'application/json;charset=UTF-8'
};

/**
 * 默认延迟时间为 50ms
 * 
 * @inner
 * @type {number}
 */
var timeoutSpan = 50;

/**
 * dumpResult 异步输出请求结果
 * - 使用nextTick调用，提高并行性及容错性
 *
 * @private
 */
function dumpResult () {
    var result = this.result;
    var response = this.response;
    var path = this.path;
    setTimeout(
        function () {
            // timeout 不返回到客户端
            delete result._timeout;
            try {
                response.end(packJSON(result));
            } catch (ex) {
                printError(ex, path);
            }
        },
        result._timeout || timeoutSpan
    );
}

/**
 * 配置参数
 * 
 * @param  {Object} config 配置参数
 *     dir: mock文件路径
 *     pacakges: 包路径配置
 *     logError: 错误日志输出文件
 * 
 * @public
 */
exports.config = function (config) {
    if (Array.isArray(config)) {
        config.forEach(function (cfg) {
            exports.config(cfg);
        });
        return;
    }

    if (config && config.dir) {

        config.dir = require('path').resolve(process.cwd(), config.dir);

        if (!configMap.hasOwnProperty(config.dir)) {
            configMap[config.dir] = config;
        }

        var custom = scan.scanDir(config.dir);

        // 合并配置信息, 
        for (var item in custom) {
            config[item] = custom[item];
        }

        // 错误日志配置, 全局`唯一`配置
        if (config.logError) {
            process._logError = config.logError;
        }
        
        // beef 包管理配置, 可`重复`配置
        require.config({
            name: config.name,
            baseUrl: config.dir,
            packages: config.packages
        });

        // include 用于自定义module引入 (即将废弃!!)
        global.include = function(moduleId) {
            return require(moduleId);
        };

         // 增加debug入口，方便mock调试
        process.argv.forEach(function (item) {
            if (item == '--debug') {
                process._debugProcess(process.pid);
            }
        });
    }
};

/**
 * 更新服务列表
 * 
 * - 清空所有缓存
 */
exports.update = function () {
    require('beef').clear(true);
    for (var item in configMap) {
        exports.config(configMap[item]);
    }
};

/**
 * 获得请求上下文
 * 
 * @param  {Request} request
 * @param  {Response} response
 * @return {Object}
 */
exports.getContext = function (request, response) {
    var headers = {
        'content-type': 'application/json;charset=UTF-8'
    };

    var func = require('./context').getContext;
    var context = func.call(this, request, response) || {};

    if (!context.path) {
        context.path = 'status_404'; 
    }

    context.request = request;
    context.response = response;
    context.headers = headers;
    context.setCookie = setCookie;
    return context;
};

/**
 * 获取响应结果
 * 
 * @param  {string} target  请求path
 * @param  {Object} context 上下文对象
 * @return {Object}
 */
exports.getResult = function(target, context) {
    var router = require('./router');
    var getResult = exports.getResult;
    var result = {};

    // 从服务列表中获取处理函数
    var proc = router.getResponse(target);
    if (proc && 'function' == typeof proc) {
        try {
            result = proc(context.path, context.param, context);
            if (!result) {
                // 如果返回值为空；则认为是服务端错误
                return getResult('status_300', context);
            }
        } catch (ex) {
            // 如果出现脚本错误；默认发送的是500错误
            context.param.msg = ex.message;
            printError(ex, context.path);
            return getResult('status_500', context);
        }
    } else if (proc) {
        // proc 返回的是一个对象；而不是函数；
        result = proc;
    } else {
        return getResult('status_404', context);
    }

    return result;
}

/**
 * 从结果或上下文中获取headers内容
 * 
 * @param  {Object} result 返回结果
 * @param  {Object} context 请求上下文
 * @return {Object}
 */
exports.getHeaders = function(result, context) {
    var headers = context.headers || headContent;

    if (result._status) {
        headers.status = result._status;
        delete result._status;
    }

    if (result._timeout) {
        headers.timeout = result._timeout;
        delete result._timeout;
    }
    return headers;
};

/**
 * 对外暴露的service接口
 * 
 * @param {http.ClientRequest} request  客户端请求
 * @param {http.ServerResponse} response 服务端响应对象
 * @public
 */
exports.serve = function (request, response) {
    var context = exports.getContext(request, response);
    var result = exports.getResult(context.path, context);
    var headers = exports.getHeaders(result, context);

    response.writeHeader(headers.status || 200, headers);

    // 延迟响应请求， 默认为100ms
    process.nextTick(dumpResult.bind({
        result: result,
        response: response,
        path: context.path
    }));
};