# mockservice 介绍
-----------

## 安装使用
 - 参考阅读 [mockservice 安装](/linkwisdom/mockservice)

## 项目配置
 - [参考阅读](config.md)

## 模块设计
 - 建议采用前端CMD模块开发，保持前端兼容
 - 建议一个请求一个mock文件
 - 建议按业务逻辑划分包结构；并且配置好`packages`路由
 - 建议使用`module.exports` 或 `exports.xx`的接口风格；

## 文件结构设计
 - 按业务结构划分多个包；
 - `lib/xxx`定义公共支持组件
 - `template/xxx`定义数据模板
 - 每个包下面的`index.js`可以定义多个接口；但是不建议接口定义在`index.js`文件中
 - 在根目录下创建`ms-config.js` 设置mock相关的配置

## 支持组件
 > 所有支持类组件包括mockservice内置的支持组件及自定义的支持组件；
 
 > 支持组件可以通过npm安装；
 
 > 但是如果是业务定制的组件建议在mock目录下建立`modules`文件夹；
 
##### mockservice 内置了以下支持类组件，通过include('xxx')方式即可引用；
 
 - [random](random.md) 随机数据生成
 - [template](template.md) 字符串模板解析引擎
 - [storage](storage.md) 数据存储支持


## 特点
- 建议采用CMD规范设计模块；
- 纯js实现的构造数据服务
- 使用前端AMD标准模块化实现mock代码（依赖beef组件
- 构造数据支持浏览器端与服务端
- 自动扫描所有符合匹配规则的文件作为mock文件
- 支持即时mock即时修改生效；无需重启服务器
- 支持独立server启动; 也可兼容edp等支持node的服务器
- 支持设置延迟响应
- 支持自定义配置, 再目标目录中增加ms-config.js文件
- 支持错误跟踪配置；支持错误输出到日志文件
