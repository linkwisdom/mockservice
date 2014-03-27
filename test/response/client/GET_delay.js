/**
 * @file 测试模块加载
 * 
 * @author Liandong Liu (liuliandong01@baidu.com)
 *
 * ## 测试内容
 * - 测试响应延迟效果
 */
define(function (require, exports, module) {
    module.exports = function (path, param) {
        var data = {count: 0};
        var p = setInterval(function () {
            data.count++;
            // 限制最大次数，降低性能开销
            if (data.count > 300) {
                clearInterval(p);
            }
        }, 10);

        return {
            status: 200,
            data: data,
            _timeout: param.delay || 10
        };
    };
});