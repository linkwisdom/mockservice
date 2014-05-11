
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
 *     {string|RegExp} config.source源字符串或正则表达
 *     {string|Fucntion} config.target 替换目标字符串或函数
 *     {string=} config.host目标主机hostname 
 *     {number=} config.port目标主机端口
 *     
 * @return {function} 请求处理函数
 * @public
 */
exports.proxy = function (config) {
    var _host = config.host + ':' + config.port;
    return function (context) {
        var request = context.request;
        var replace = config.replace;
        var headers = request.headers;

        if (replace && replace.source) {
            var url = request.url;
            request.url = url.replace(replace.source, replace.target);
        }

        if (headers && headers.host) {
            var hd = headers.host.split(':');
            config.port = config.port || hd[1];
            config.host = config.host || hd[0];
            headers.host = config.host + ':' + config.port;
            proxy(config.host, config.port)(context);
        }
    };
};