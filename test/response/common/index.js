/**
 * @file 测试index文件
 * 
 * 定义在index文件中的接口不做缓存
 * 
 */
define(function (require, exports, module) {
    exports.GET_auth = function (path, param) {
        return {
            status: 200,
            data: {
                login: true,
                username: 'jack'
            }
        };
    };

    exports.GET_group = function (path, param) {
        return {
            status: 200,
            data: [
                {groupid: 111, name: 'cpp'},
                {groupid: 121, name: 'js'}
            ]
        };
    };
});