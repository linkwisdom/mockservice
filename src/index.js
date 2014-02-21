/**
 * @file 为前端构造数据提供mockservice服务
 * 
 * @refer https://github.com/fcfe/mockservice
 * 
 * @author  liandong (liu@liandong.org liuliandong01@baidu.com)
 * 
 * - 纯js实现的构造数据服务
 * - 使用前端AMD标准模块化实现mock代码（依赖beef组件
 * - 构造数据支持浏览器端与服务端
 * - 自动扫描所有符合匹配规则的文件作为mock文件
 * - 支持即时mock即时修改生效；无需重启服务器
 * - 支持独立server启动; 也可兼容edp等支持node的服务器
 * - 支持设置延迟响应
 * - 支持自定义配置
 *
 */

var scan = require('./scan');

// beef是为了支持客户端amd模块(@github.com/fcfe/beef)
global.require = require('beef');

// 设置服务mine类型
var contentType = {
    'Content-Type': 'text/json;charset=utf-8'
};

// 默认延迟时间为 100ms
var timeoutSpan = 100;

// 接受配置参数
exports.config = function (config) {
    if (config && config.dir) {
        scan.scanDir(config.dir);
        if (config.logError) {
            process._logError = config.logError;
        }
    }
};

global.printError = function (exception, msg) {
    if (!process._logError) {
        return;
    }

    if (msg) {
        console.log(msg);
    }

    if ('object' == typeof exception) {
        console.log(exception.message);

        var logFile =  process._logError.logFile;

        // 如果指定了logFile 错误日志打印到日志文件
        // 否则直接输出
        if (logFile) {
            logFile = require('path').join(process.cwd(), logFile);

            var errorMSG = [
                msg,
                exception.stack,
                '\n'
            ].join('\n');

            require('fs').appendFile(logFile, errorMSG, function(err) {
                err && console.log(err);
            });
        } else {
            console.log(exception.stack);
        }
    }
}

// 封装数据
function pack(obj) {
    return JSON.stringify(obj, '\t', 4);
}

// 对外暴露的service接口
exports.serve = function (request, response) {
    var query= request.query; // 请求参数
    var path = query.path; //请求路径信息
    var result = {status: 200, data: null};

    // 支持param和params两种参数接口
    var param = query.param || query.params;

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
        // param 需要符合标准json格式
        try {
            param = JSON.parse(param);
        } catch (ex) {
            param = eval( '(' + param + ')');
        }
    }

    // 如果从query和body中都未能够获得path信息；
    if (path) {

        // 所有/转为_；方便mock接口命名
        path = path.replace(/\//g, '_');
    } else {

        // path不存在是参数错误
        response.end(pack({
            staus: 300,
            data: 'request path undefined'
        }));
        return;
    }

    // 从服务列表中获取处理函数
    var proc = scan.getResponse(path);

    if (proc && 'function' == typeof proc) {
        try {
            result = proc(path, param);

            // 根据返回值设定http status code
            if (result && result.status) {

                // 返回正常，且有状态码
                response.writeHead(result.status, contentType);
            } else if (result) {

                // 如果有数据返回但是没有status, 默认为200
                response.writeHead(200, contentType);
            } else {

                // 如果返回值为空；则认为是服务端错误
                result = {
                    timeout: 3000,
                    path: path,
                    data: 'no result defined'
                };

                response.writeHead(500, contentType);
            }

        } catch (ex) {

            // 如果出现脚本错误；默认发送的是500错误
            result = {
                status: 500,
                msg: ex.message
            };

            // 设置错误状态
            response.writeHead(result.status, contentType);

            printError(ex, path);
        }

    } else if (proc) {

        // proc 返回的是一个对象；而不是函数；
        result = proc;
    } else {

        // 获取服务或数据失败
        response.writeHead(404, contentType);
        result = {
            status: 404,
            msg: 'service not found'
        };


    }

    // 延迟响应请求， 默认为100ms
    setTimeout( function () {
        // timeout 不返回到客户端
        delete result.timeout;
        response.end(pack(result));
    }, result.timeout || timeoutSpan);
};

// 独立服务运行，为了兼容edp中post数据获取方式
function service(request, response) {
    var url = require('url').parse(request.url, true);
    request.query = url.query;

    if (request.method == 'POST') {
        var data = [];

        request.on('data', function (trunk) {
            data.push(trunk && trunk.toString());
        });

        request.on('end', function (trunk) {
            if (trunk) {
                data.push(trunk.toString());
            }
            
            request.body = data.join('');
            // 转给通用处理函数处理
            exports.serve(request, response);
        });

    } else {
        exports.serve(request, response);
    }
}

// 独立服务运行
exports.listen = function (port) {
    port || (port = 8181);
    require('http').createServer(service).listen(port);
    console.log('mockservice start on port:' + port);
};

// 为edp提供服务暴露接口
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