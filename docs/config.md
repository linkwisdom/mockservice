## config 文件说明

### 配置EDP开发环境

1. 安装mockservice

```sh
    npm install mockservice
```

2. 配置edp服务

- 配置方法: 在`edp-webserver-config`文件中添加如下代码

```js
    exports.port = 8848;

    var ms = require('mockservice');

    ms.config({
        dir: './nirvana-workspace/nirvana/debug',
        logError: {
            logFile: './server-log'
        },
        packages: {
            lib: './lib'
        }
    });
    
    ms.config({
        name: 'phoenix',
        dir: './nirvana-workspace/phoenix/debug',
        packages: {
            advManage: './advManage',
            common: './common'
        }
    });

    // edp 通过getLocations 路由请求处理器
    exports.getLocations = function () {
        return [
            {
                location: /^\/request.ajax/, 
                handler: ms.request()
            }
        ];
    };
```

- 如果同一个项目的不同模块需要独立配置mock目录，只需要多次config或者传入config数组

**传入config为数组**

```js
    ms.config([
        {
            dir: './response',
            logError: {
                logFile: 'ms-error-log'
            }
        },
        {
            name: 'debug',
            dir: './debug'
        }
    ]);
```

**多次config**

```js
    ms.config({
        dir: './response',
        packages: {
            'lib': './lib'
        }
    });

    ms.config({
        name: 'debug',
        dir: './debug',
        packages: {
            'service': './service'
        }
    });
```

- 不同项目模块之间的服务可以共享

```js
    require('lib/db'); //  ./response/lib/db.js

    require('service/getCities'); //  ./debug/service/getCitites.js

    // 项目配置名字，可以从项目根目录直接寻找文件

    require('debug/GET_auth'); // ./debug/GET_auth.js

    // 给项目配置名字可以防止不同模块命名或服务冲突

    require('debug/lib/getCities'); //  ./debug/lib/getCities.js

```

- mock 文件内部可以使用相对路径

```js
   // debug/app/GET_list.js
   module.exports = function () {

       // debug/app/appList.js
       var appList = require('./appList');

   };
```

- mock文件使用了改写的require机制，但是与npm的包机制是不冲突的；

```js
    var service = require('service'); // ./debug/service
    var express = require('express'); // ../node_modules/express
```

### 模块内项目配置

> ms-config.js 是放在mock文件中的配置文件；

> 文件的配置字段与ms.config(options)中的字段一致；

> ms-config.js 文件的配置向子文件夹传递

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
