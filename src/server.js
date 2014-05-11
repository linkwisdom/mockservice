/**
 * 独立mockservice服务器
 */


/**
 * 独立服务运行，为了兼容edp中post数据获取方式
 * 
 * @param {http.ClientRequest} request  客户端请求
 * @param {http.ServerResponse} response 服务端响应对象
 * @public
 */
function service(request, response) {
    var serve = this.serve ||  exports.serve;
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
                serve(request, response);
            }
        );

    } else {
        serve(request, response);
    }
}

/**
 * 独立服务运行
 * 
 * @param  {number} port 端口号
 */
exports.listen = function (port) {
    port || (port = 8181);
    this._server = require('http').createServer(service.bind(this));
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
