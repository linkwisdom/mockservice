/**
 * @file 自定义配置
 *
 * ## 自定义配置 ms-config;
 * - 配置文件放在mock数据根目录
 */
define(function (require, exports, module) {
    module.exports = {
        baseDir: __dirname,

        // 接口名匹配规则
        pathRegs: [ /(ADD|GET|SET|DEL)\/\w+/],

        // 包路径配置
        packages: {
            database: './database',
        }
    };
});