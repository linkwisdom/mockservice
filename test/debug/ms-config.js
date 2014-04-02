/**
 * @file 自定义配置
 *
 * ## 自定义配置 ms-config;
 * - 配置文件放在mock数据根目录
 */
define(function (require, exports, module) {
    module.exports = {
        cache: false,  // 是否缓存
        packages: {
            'service': './service'
        }
    };
});