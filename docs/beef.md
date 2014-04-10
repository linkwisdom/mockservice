# beef 模块管理

## beef 做了什么
- 模块封装

```js
define(function (require, exports, module) {
    
});
```

- 模块/包管理

> `name-dir` 为每个包提供了一个全局命名空间
> 在默认的npm寻址方式前采用了自定义包的路径
> packages的配置相当于将子文件夹路径提升为全局路径

```js
    // 配置单个包
    require.config({
        name: 'moment',
        dir: './modules/moment'
    });
    
    // 批量导入包
    require.config({
        name: 'modules',
        dir: __dirname + '/../modules',
        packages: {
            moment: 'moment',
            random: 'random',
            storage: 'storage',
            template: 'template'
        }
    });
    
    var modules = require('modules');
    
    var random = require('modules/random');
    
    // 等价于
    var random = require('random');
```

- 支持插件

```js
var json = require('json!resource/config.json');

var text = require('text!resource/r.txt');
```

- 可以通过扩展`beef.plugin`定义自己的插件


- 支持异步调用方式

```js
require(['remote/rpc/math'], function (math) {
    
});
```

## 使用方法

```js
    // 覆盖当前require实例，不影响其它模块
    require = require('beef');
    
    // beef 包管理配置, 可`重复`配置
    require.config({
        name: 'debug',
        baseUrl: './debug',
        packages: {
            lib: './lib',
            common: './common'
        }
    });
```

## 对默认的模块影响
- 兼容node模块文件
- beef.define 是强制侵入的
- beef.require 是非侵入的

