/**
 * @file 默认配置
 * 
 * 自定义配置需要在目标目录中加入ms-config.js
 * 配置对当前目录及子目录生效
 * 
 * cache: 是否缓存模块
 * pathRegs: 匹配的规则列表，字符串或者正则表达式
 */

module.exports = {
    name: 'modules',
    dir: __dirname + '/../modules',
    packages: {
        moment: 'moment',
        random: 'random',
        storage: 'storage',
        template: 'template',
        memset: 'memset'
    },
    cache: false,
    pathRegs: [/\w+_\w+/, 'scookie', 'zebra']
};