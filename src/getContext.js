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
 * ```
 * 
 * @param  {http.ClientRequest} request  客户端请求
 * @param  {http.ServerResponse} response 服务端响应对象
 * @public
 */
function getContext(request, response) {
    var query= request.query; // 请求参数
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

    return {
        path: path,
        param: param
    };
}

module.exports = getContext;