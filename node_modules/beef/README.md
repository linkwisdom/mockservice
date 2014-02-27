beef -- 牛排
-----------------

> 解决前后端模块化共用；面向前端AMDJS模块，支持前端模块在服务端使用；提供模块插件机制；支持自定义路由

> beef means that modules from backend to frontend stay works

## Features
 * 支持标准模块加载器, requirejs, esl, seajs
 * 支持常用插件形式, text, json, less, css
 * 支持自定义扩展插件 require.plugin
 * 支持自定义路由配置

```js

  global.require = require('beef');
  
  // 自定义路由
  require.config({
      baseUrl: './source',
      packages: {
          'admin': '../admin'
      }
  });
  
  // 自定义扩展插件
  require.plugin.ext = function (filename) {
      return require(filename);
  };

```

 
## 使用方法

使用npm安装beef

> npm install beef


```js

// 如果不仅仅当前模块使用，建议暴露为全局对象
global.require = require('beef');

// 同步require 方式
var mod = require('./mod');

// 异步调用方式
require(['./amd'], function(amd) {
    console.log(amd);
});

// 利用插件读取
var text = require('text!./text.txt');

console.log(text);

```

## 模块写法

- 采用AMDJS写法
> 需要用define-function定义模块

```js
define(function(require, exports, module) {
    return "mod";
});
```
- 采用node_modules写法

```js
module.exports = {
  name: 'node-module'
};
```




  ![fresh beef](http://image4.buy.ccb.com/images/59288134/1373701097874_3.jpg)
