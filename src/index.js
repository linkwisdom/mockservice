/**
 * @file 为前端构造数据提供mockservice服务
 * 
 * @refer https://github.com/fcfe/mockservice
 * 
 * @author  Liandong Liu (liuliandong01@baidu.com)
 */

// 全局方法扩展
require('./extension');

var scan = require('./scan');
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
    'content-type': 'application/json;charset=UTF-8'
};

/**
 * 默认延迟时间为 50ms
 * 
 * @inner
 * @type {Number}
 */
var timeoutSpan = 50;

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
    if (config instanceof Array) {
        config.forEach(function (cfg) {
            exports.config(cfg);
        });
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

        // 配置自定义响应处理函数
        if (config.getContext) {
            process.getContext = config.getContext;
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

exports.update = function () {
    require('beef').clear(true);
    for (var item in configMap) {
        exports.config(configMap[item]);
    }
};

exports.getContext = function (request, response) {
    var headers = {
        'content-type': 'application/json;charset=UTF-8'
    };
    var func = global.getContext || require('./getContext');
    var context = func.call(this, request, response) || {};
    context.request = request;
    context.response = response;
    context.headers = headers;
    context.update = exports.update;
    context.setCookie = setCookie;
    return context;
};

/**
 * 对外暴露的service接口
 * 
 * @param  {http.ClientRequest} request  客户端请求
 * @param  {http.ServerResponse} response 服务端响应对象
 * @public
 */
exports.serve = function (request, response) {
    var result = {status: 200, data: null};
    var context = this.getContext(request, response);
    var headers = context.headers || headContent;
    
    if (!context.path) {
        response.end('');
        return;
    }

    // 从服务列表中获取处理函数
    var proc = scan.getResponse(context.path);

    if (proc && 'function' == typeof proc) {
        try {
            result = proc(context.path, context.param, context);

            // 根据返回值设定http status code
            if (result && result._status) {

                // 返回正常，且有状态码
                response.writeHead(result._status, headers);
                delete result._status;
            } else if (result) {

                // 如果有数据返回但是没有status, 默认为200
                response.writeHead(200, headers);
            } else {

                // 如果返回值为空；则认为是服务端错误
                result = {
                    timeout: 1000,
                    path: context.path,
                    data: 'no result defined'
                };

                response.writeHead(500, headers);
            }

        } catch (ex) {

            // 如果出现脚本错误；默认发送的是500错误
            result = {
                status: 500,
                msg: ex.message
            };

            // 设置错误状态
            response.writeHead(result.status, headers);

            printError(ex, context.path);
        }
    } else if (proc) {

        // proc 返回的是一个对象；而不是函数；
        result = proc;
    } else {

        // 获取服务或数据失败
        response.writeHead(404, headContent);
        result = {
            status: 404,
            msg: 'service not found'
        };
    }

    // 延迟响应请求， 默认为100ms
    setTimeout( 
        function () {
            // timeout 不返回到客户端
            delete result._timeout;
            response.end(packJSON(result));
        },
        result._timeout || timeoutSpan
    );
};

/**
 * 独立服务运行，为了兼容edp中post数据获取方式
 * 
 * @param  {http.ClientRequest} request  客户端请求
 * @param  {http.ServerResponse} response 服务端响应对象
 * @public
 */
function service(request, response) {
    var url = require('url').parse(request.url, true);
    request.query = url.query;

    if (request.method == 'POST') {
        var data = [];

        request.on(
            'data', 
            function (trunk) {
                data.push(trunk && trunk.toString());
            }
        );

        request.on(
            'end',
            function (trunk) {
                if (trunk) {
                    data.push(trunk.toString());
                }
                
                request.body = data.join('');
                // 转给通用处理函数处理
                exports.serve(request, response);
            }
        );

    } else {
        exports.serve(request, response);
    }
}

/**
 * 独立服务运行
 * 
 * @param  {number} port 端口号
 */
exports.listen = function (port) {
    port || (port = 8181);
    this._server = require('http').createServer(service);
    this._server.listen(port);
    console.log('mockservice start on port:' + port);
};

/**
 * 关闭服务
 * 
 * @param  {nunber} millies 延迟时间
 * @public
 */
exports.close = function (millies) {
    var server = this._server;
    console.log('mockservice stoping...');

    // 延迟一秒关闭服务
    setTimeout(
        function () {
            server.close();
        },
        millies || 10000
    );
};

/**
 * 为edp提供服务暴露接口
 * 
 * @param  {Object} config 配置参数
 * @return {Fucntion}      请求处理函数
 * @public
 */
exports.request = function (config) {
    var me = this;
    me.config(config);
    return function (context) {
        var request = context.request;
        var response = context.response;
        request.body = request.bodyBuffer;
        me.serve(request, response);

        // 阻止其它规则干扰改请求
        context.stop();
    };
};

/**
 * 扩展edp的请求转发服务
 * 
 * @param  {Object} config 配置参数
 *     source {string|RegExp} 源字符串或正则表达
 *     target {string|Fucntion} 替换目标字符串或函数
 *     host {string} 目标主机hostname 
 *     port {number} 目标主机端口
 *     
 * @return {Function}      请求处理函数
 * @public
 */
exports.proxy = function (config) {
    return function (context) {
        var request = context.request;
        var replace = config.replace;

        if (replace && replace.source) {
            var url = request.url;
            request.url = url.replace(replace.source, replace.target);
        }

        if (config.host) {
            config.port = config.port  || 80;

            if (config.port && config.port) {
                request.headers = config.host + ':' + config.port;
            } else {
                config.host = config.host || 'localhost';
                config.port = config.port || process.port || 8848;
            }
            
            proxy(config.host, config.port)(context);
        }
    };
};

/**
 * 增加自动包配置
 * add in v0.1.12
 *
 * - 废弃使用paw-include
 */
exports.config(require('./config'));
