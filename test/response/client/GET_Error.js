/**
 * @file 测试随机数据产生模块
 * 
 * @author Liandong Liu (liuliandong01@baidu.com)
 *
 * ##测试内容
 * - 这个模块会出错，但是服务器能够处理该错误，
 * - 记录错误信息，并且给客户端状态提示
 */
define(function (require, exports, module) {
    module.exports = function (path, param) {
        return {
            data: iamnotbedefined,
            status: 200
        };
    };
});