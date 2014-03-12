
## config 文件说明

> ms-config.js 是放在mock文件中的配置文件；文件的配置字段与ms.config(options)中的字段一致；
> 放在ms-config.js中的目的是为了更方便的在开发过程中修改配置
> ms-config.js不是必需的；只有默认规则不满足需要时添加该文件即可;


```js
define(function (require, exports, module) {
    module.exports = {
        cache: false,  // 是否缓存

        // 接口名匹配规则
        pathRegs: [/\w+_\w+/, 'scookie', 'zebra'],

        // 错误日志输出，打印或输出到文件
        // 如果logFile 没有设置，则错误结果直接输出在控制台
        logError: {
            logFile: 'ms-error-log'
        },

        // 包路径配置，相对baseDir的位置
        packages: {
            'common': './common',
            'client': './client',
            'template': './template',
            'lib': './lib'
        }
    };
});
```