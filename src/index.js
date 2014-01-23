var scan = require('./scan');

// beef是为了支持客户端amd模块
global.require = require('beef');

var contentType = 'text/json;charset=utf-8';

// 接受配置参数
exports.config = function(config) {
    if (config && config.dir) {
        scan.scanDir(config.dir);
    }
};

function pack(obj) {
    return JSON.stringify(obj, '\t', 2);
}


// 对外暴露的service接口
exports.serve = function(request, response) {
    var query= request.query; // 请求参数
    var path = query.path; //请求路径信息
    var param = query.param;

    if (!path) {
        response.end(pack({
            status: 200,
            url: request.query
        }));
        return;
    }

    // 所有/转为_；方便mock接口命名
    path = path.replace(/\//g, '_');

    // 如果是post过来的请求
    if (request.body) {
        var body = request.body.toString();
        body = require('querystring').parse(body);
        if (body.param) {
            param = JSON.parse(body.param);
        }
    } else if (param && 'string' == typeof param) {
        param = JSON.parse(param);
    }

    var proc = scan.getResponse(path);

    if (proc && 'function' == typeof proc) {
        var result = proc(path, param);
        if (result && result.status) {
            response.writeHead(200, contentType);
        } else {
            response.writeHead(500, contentType);
        }
        
        response.end(pack(result));
    } else {

        response.writeHead(404, contentType);
        response.end(pack({
            status: 404,
            msg: 'not found'
        }));
    }
};

function service(request, response) {
    var url = require('url').parse(request.url, true);
    request.query = url.query;

    if (request.method == 'POST') {
        var data = [];

        request.on('data', function(trunk) {
            data.push(trunk && trunk.toString());
        });

        request.on('end', function(trunk) {
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
exports.listen = function(port) {
    port || (port = 8181);
    require('http').createServer(service).listen(port);
    console.log('mockservice start on port:' + port);
};

// 为edp提供暴露接口
exports.request = function(config) {
    var me = this;
    me.config(config);
    return function(context) {
        var request = context.request;
        var response = context.response;
        request.body = request.bodyBuffer;
        me.serve(request, response);
    };
};