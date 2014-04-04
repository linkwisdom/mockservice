/**
 * @file debug
 * - debug 是配置的第二个项目模块
 * - 所有的参数都可以单独配置
 * 
 */
define(function (require, exports, module) {

    // 你也可以在项目中增加这个配置
    exports.UPDATE_service = function (path, params, context) {
        context.update();
    };

    // 增加客户端cookie
    exports.SET_cookies = function (path, params, context) {
        var cookies = params.cookies;
        if (cookies) {
            setCookie(cookies, context);
        }
        return {
            cookies: cookies
        }; 
    };
});