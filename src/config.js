/**
 * @file 默认配置
 *
 * @author Liandong Liu (liuliandong01@baidu.com)
 * 
 * 自定义配置需要在目标目录中加入ms-config.js
 * 配置对当前目录及子目录生效
 */

module.exports = {
    // 是否缓存模块
    cache: false,
    // 匹配的规则列表，字符串或者正则表达式
    pathRegs: [/\w+_\w+/, 'scookie', 'zebra']
};