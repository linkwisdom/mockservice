# beef 模块管理

## beef 做了什么
- 模块封装

```js
define(function (require, exports, module) {
    
});

- 模块/包管理

> `name + dir` 为每个包提供了一个全局命名空间
> 在默认的npm寻址方式前采用了自定义包的路径
> packages的配置相当于将子文件夹路径提升为全局路径

```js

// 采用本地moment模块
require.config({
    name: 'moment',
    dir: './modules/moment'
});

// 定义math包
reqruire.config({
    name: 'math',
    dir: './modules/math',
    packages: {
        add: './add',
        multiply: './multiply',
        util: './util'
    }
});

var math = require('math');

var power = require('math/power');

var add = require('add');

// 等价于
add = require('math/add');

```

## beef 支持插件

```js
var json = require('json!resource/config.json');
```

## beef 支持异步调用方式

```js
require(['remote/rpc/math'], function (math) {
    
});
```

## 对默认的模块影响
- 兼容node模块文件
- beef.define 是强制侵入的
- beef.require 是非侵入的

