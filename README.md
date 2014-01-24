mockservice
===========

> 构造数据服务

-----------------------

## 构造mock数据规范

-请求规范

> 前端代码发送真实请求；请求路径符合request.ajax?path=XXX形式;参数param可以是POST或GET参数
param符合严格规范的json格式

- 构造数据代码规范

> 所有响应request.ajax?path={pathname}&param={object}请求每个pathname对应一个mock文件；mock文件名`/`替换为`_`；
独立mock文件命名为{pkgname}/{pathname}.js;

- 对应每个接口应该指定一个响应函数；响应函数有固定参数列表(path, param)
- index.js 文件可以定义多个接口的响应函数 (但是不建议写到index文件；除非path不符合GET/ADD/MOD/DEL形式)
- {pathname}.js 文件只能定义对应pathname的响应函数

## gitup安装 (需要支持git协议)

> npm install git://github.com/fcfe/mockservice.git

选择npm安装 (最近dns还未完全恢复, npm安装可能会有问题)

> npm install mockservice



## 启动服务器

### 依赖edp
> 配置方法: 在edp-webserver-config文件中添加如下代码

    exports.port = 8848;

    var ms = require('mockservice');
    ms.config({dir: __dirname + '/phoenix/debug'});

    exports.getLocations = function () {
        return [
            {
                location: /^\/request.ajax/, 
                handler: ms.request({})
            }
        ];
    };

启动服务器

> edp ws start

- 使用edp时建议mocksrvice安装在项目代码上一级目录, 如`F://fengchao/node_modules`

### 独立服务

    // 进入工作路径
    cd workspace

    // 指定debug为mock代码目录;
    mock 8848

- 如使用独立服务器; 需要全局安装`-g`; 

### 使用说明

 > 启动程序后ms自动扫描目录下所有index.js文件及符合`(GET|ADD|DEL|MOD)_xxx.js` 格式的文件;
 > `(GET|ADD|DEL|MOD)_xxx.js` 格式的文件不会立即加载；只有请求触发时会加载；且不进行缓存；
 
 > 测试：启动edp或mock程序；浏览器中测试，或发curl请求
 
     http://localhost:8848/request.ajax?path=GET/auth&param={}
     

### ISSUE todo

- 构造数据支持简单物料读写逻辑

- 构造数据模版

- 构造数据工具方法

- 构造数据规范
