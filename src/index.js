/**
 * @file 为前端构造数据提供mockservice服务
 * 
 * @refer https://github.com/fcfe/mockservice
 * 
 * @author  Liandong Liu (liuliandong01@baidu.com)
 */

// scan 扫描目标文件夹获取mock文件
var scan = require('./scan');

/** 
 * beef是为了支持AMDJS模块在服务端共用
 * 
 * @type {Object}
 */
global.require = require('beef');

/**
 * HTTP 响应Response的mine类型
 * 
 * @const
 * @type {Object}
 */
var CONTENT_TYPE = {
    'content-type': 'application/json;charset=UTF-8'
};

/**
 * 默认延迟时间为 50ms
 * 
 * @const
 * @type {Number}
 */
var TIMEOUT_SPAN = 50;

/**
 * 配置参数
 * 
 * @param {!Object} config 配置参数
 * @param {!string} config.dir: mock文件路径
 * @param {?Object} config.pacakges: 包路径配置
 * @param {?Object} config.logError 错误日志输出配置
 */
exports.config = function (config) {
    if (config && config.dir) {
        var custom = scan.scanDir(config.dir);

        // 合并配置信息
        for (var item in custom) {
            config[item] = custom[item];
        }

        // 错误日志配置
        if (config.logError) {
            process._logError = config.logError;
        }

        // beef 包管理配置
        require('beef').config({
            baseUrl: config.dir,
            packages: config.packages
        });

        // include 用于自定义module引入
        global.include = require('paw').require;

         // 增加debug入口，方便mock调试
        process.argv.forEach(function (item) {
            if (item == '--debug') {
                process._debugProcess(process.pid);
            }
        });
    }
};

/**
 * 错误日志处理
 * 
 * @param  {Error} exception 异常对象
 * @param  {string} msg      异常描述
 */
global.printError = function (exception, msg) {
    // 如果全局没有指定错误处理方法；默认不输出
    if (!process._logError) {
        return;
    }

    // 描述信息直接打印
    if ('undefined' !== typeof msg) {
        console.log(msg);
    }

    // 错误信息高亮显示在console中
    if ('object' == typeof exception) {
        // 高亮显示错误信息
        console.log('\033[31m \033[05m ', exception.message, '\033[0m');

        var logFile =  process._logError.logFile;

        // 如果指定了logFile 错误日志打印到日志文件，否则直接输出
        if (logFile) {
            var errorMSG = [msg, exception.stack].join('\n');
            logFile = require('path').join(process.cwd(), logFile);

            // 追加方式写入文件
            require('fs').appendFile(
                logFile,
                errorMSG,
                function (err) {
                    err && console.log(err);
                }
            );
        } else {
            console.log(exception.stack);
        }
    }
};

/**
 * 格式化输出数据
 * 
 * @param  {Object} data 输出数据对象
 * @return {string}     输出文本
 */
function pack(data) {
    return JSON.stringify(data, '\t', 4);
}

/**
 * 请求解析出path和param
 * - 如果业务参数与默认接口格式不一致；通过扩展这个接口即可
 * 
 * ```js
 * require('mockservice').getContext = function(req, res) {
 *     var query = req.query;
 *     return {
 *         path: query.path,
 *         param: query.param
 *     };
 * };
 * ``
 * @param  {http.ClientRequest} request  客户端请求
 * @param  {http.ServerResponse} response 服务端响应对象
 */
exports.getContext = function (request, response) {
    var query = request.query; // 请求参数
    var path = query.path; //请求路径信息

    // 支持param和params两种参数接口
    var param = query.param || query.params || {};

    // 如果是post过来的请求
    if (request.body) {
        var body = request.body.toString();
        body = require('querystring').parse(body);

        if (body.param || body.params) {
            param = body.param || body.params;
        }

        if (body.path) {
            path = body.path;
        }
    }

    // param 解析为对象
    if (param && 'string' == typeof param) {
        try {
            // 符合标准json格式的处理
            param = JSON.parse(param);
        } catch (ex) {
            // 对于不规范的json对象额外处理
            param = eval( '(' + param + ')');
        }
    }

    // 如果从query和body中都未能够获得path信息；
    if (path) {
        // 所有/转为_方便mock接口命名
        path = path.replace(/\//g, '_');
    } else {
        // path不存在是参数错误
        response.end(pack({
            staus: 300,
            data: 'request path undefined'
        }));
        return;
    }

    // 接口必须返回path和param
    return {
        path: path,
        param: param
    };
};

/**
 * 对外暴露的service接口
 * 
 * @param  {http.ClientRequest} request  客户端请求
 * @param  {http.ServerResponse} response 服务端响应对象
 */
exports.serve = function (request, response) {
    var result = {status: 200, data: null};
    var context = this.getContext(request, response);
    if (!context) {
        return;
    }

    // 从服务列表中获取处理函数
    var proc = scan.getResponse(context.path);

    if (proc && 'function' == typeof proc) {
        try {
            result = proc(context.path, context.param);

            // 根据返回值设定http status code
            if (result && result._status) {

                // 返回正常，且有状态码
                response.writeHead(result._status, CONTENT_TYPE);
                delete result._status;
            } else if (result) {

                // 如果有数据返回但是没有status, 默认为200
                response.writeHead(200, CONTENT_TYPE);
            } else {

                // 如果返回值为空；则认为是服务端错误
                result = {
                    timeout: 1000,
                    path: context.path,
                    data: 'no result defined'
                };
                response.writeHead(500, CONTENT_TYPE);
            }

        } catch (ex) {

            // 如果出现脚本错误；默认发送的是500错误
            result = {
                status: 500,
                msg: ex.message
            };

            // 设置错误状态
            response.writeHead(result.status, CONTENT_TYPE);
            printError(ex, context.path);
        }
    } else if (proc) {

        // proc 返回的是一个对象；而不是函数；
        result = proc;
    } else {

        // 获取服务或数据失败
        response.writeHead(404, CONTENT_TYPE);
        result = {
            status: 404,
            msg: 'service not found'
        };
    }

    // 延迟响应请求
    setTimeout( 
        function () {
            // timeout 不返回到客户端
            delete result._timeout;
            response.end(pack(result));
        },
        result._timeout || TIMEOUT_SPAN
    );
};

/**
 * 独立服务运行，为了兼容edp中post数据获取方式
 * 
 * @param  {http.ClientRequest} request  客户端请求
 * @param  {http.ServerResponse} response 服务端响应对象
 */
function service(request, response) {
    var url = require('url').parse(request.url, true);
    request.query = url.query;

    // 获取post数据
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
 * @param  {Object}             config 配置参数
 * @param  {string|RegExp}      config.source 源字符串或正则表达
 * @param  {string|Fucntion}    config.target 替换目标字符串或函数
 * @param  {string}             config.host 目标主机hostname 
 * @param  {number}             config.port 目标主机端口
 *     
 * @return {function}      请求处理函数
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
            request.headers = config.host + ':' + config.port;
            proxy(config.host, config.port)(context);
        }
    };
};
