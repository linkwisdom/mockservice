/**
 * @file 自定义配置
 *
 * ## 自定义配置 ms-config;
 * - 配置文件放在mock数据根目录
 */
define(function (require, exports, module) {
    module.exports = {
        cache: false,  // 是否缓存

        // 接口名匹配规则
        pathRegs: [/\w+_\w+/, 'scookie', 'zebra'],
        
        // 错误日志输出，打印或输出到文件
        logError: {
            logFile: 'ms-error-log'
        },

        // 包路径配置
        packages: {
            common: './common',
            client: './client',
            source: './source',
            lib: './lib'
        }
    };
});