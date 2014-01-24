mockservice
===========

> 构造数据服务

-----------------------

## 构造mock数据规范

-请求规范

>前端代码发送真实请求；请求路径符合request.ajax?path=XXX形式;参数param可以是POST或GET参数
param符合严格规范的json格式

-构造数据代码规范

> 所有响应request.ajax?path={pathname}&param={object}请求每个pathname对应一个mock文件；mock文件名`/`替换为`_`；
独立mock文件命名为{pkgname}/{pathname}.js;

- 对应每个接口应该指定一个响应函数；响应函数有固定参数列表(path, param)
- index.js 文件可以定义多个接口的响应函数 (但是不建议写到index文件；除非path不符合GET/ADD/MOD/DEL形式)
- {pathname}.js 文件只能定义对应pathname的响应函数

## 安装

> npm install git://github.com/fcfe/mockservice.git -g

选择npm安装 (最近dns还未完全恢复)

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

### 独立服务

    // 进入工作路径
    cd workspace

    // 指定debug为mock代码目录;
    mock 8181 debug

 > mockservice会自动扫描目录下所有文件；并导入所有文件暴露的接口
 > mock 的两个参数都是可选的

### ISSUE todo

- 构造数据支持简单物料读写逻辑

- 构造数据模版

- 构造数据工具方法

- 构造数据规范