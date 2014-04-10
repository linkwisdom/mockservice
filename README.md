mockservice [![NPM version](https://badge.fury.io/js/mockservice.png)](https://npmjs.org/package/mockservice) [![Dependencies Status](https://david-dm.org/linkwisdom/mockservice.png)](https://david-dm.org/linkwisdom/mockservice)

===========

> 构造数据服务

---------------------------

## 安装与配置


### 选择npm安装

> npm install mockservice

### gitub安装 (需要支持git协议)

> npm install git://github.com/fcfe/mockservice.git

### 配置edp服务器 

/// (如果开发依赖不是是edp环境，绕道[mock-cli](#mock-cli))

> 配置方法: 在edp-webserver-config文件中添加如下代码

```js
    exports.port = 8848;

    var ms = require('mockservice');
    ms.config({
        // dir 相当于定义了mock的basedir 及require的baseUrl
        dir: __dirname + '/phoenix/debug'
    });

    // edp 通过getLocations 路由请求处理器
    exports.getLocations = function () {
        return [
            { // 将特定请求转向代理
                location: /path=GET\/nikon/,
                handler: ms.proxy({
                        replace: { // 对url的替换规则
                            source: '/nirvana-workspace',
                            target: ''
                        },
                        host: 'dev.liandong.org',
                        port: 8848
                    });
            },
            { // 其它请求转为本地mock
                location: /^\/request.ajax/, 
                handler: ms.request()
            }
        ];
    };
```

### 多个项目模块的配置

- 传入config为数组

```js
    ms.config([
        {
            dir: './response',
            logError: {
                logFile: 'ms-error-log'
            }
        },
        {
            dir: './debug'
        }
    ]);
```

- 多次config
```js
    ms.config({
        dir: './response',
        packages: {
            'lib': './service'
        }
    });

    ms.config({
        dir: './debug',
        packages: {
            'service': './service'
        }
    });
```

- 配置说明

1. 每个模块的配置独立可以有分别的dir和packages配置
2. `packages`不同模块可以共享，因此不可命名冲突
3. 多次`logError`配置只有最后一次有效
4. 建议`packages`、`cache`、`pathRegs`的配置分别写到项目模块配置文件`ms-config.js`文件中

- 启动服务器

> edp ws start

- 使用edp时建议mocksrvice安装在项目代码上一级目录, 如`F://fengchao/node_modules`

### mock-cli

- 如使用独立服务器; 需要全局安装 `npm install mocksrvice -g`; 

    // 进入工作路径
    cd workspace
    
    // 启动mock服务器
    mock 8848

### ms-config.js配置

> ms-config.js 文件是可选文件，配置是为了使用更方便
> ms-config.js 文件可以放到目标文件夹下；只影响当前文件夹或子文件夹下的模块

> 详细配置参考 [config 详细说明](https://github.com/linkwisdom/mockservice/blob/master/docs/config.md);

```js
    module.exports = {
        // mock接口文件是否缓存
        cache: false,
        
        // 接口匹配规则
        pathRegs: [/\w+_\w+/, 'scookie', 'zebra'],
        
        // 以下配置只在baseDir中有效
        // packages 定义了基于basedir的寻址方式
        packages: {
            'lib': './lib',
            'tpl': './template'
        },
        // 如果不写logError，则错误信息不显示输出
        logError: {
            // 如果不指定logFile，则将错误信息输出到控制台
            logFile: 'ms-erorr.log'
        }
    };
```

----------------------------

### 使用说明

 > 启动程序后ms自动扫描目录下所有index.js文件及符合特定规则的文件（如果需要，规则可由ms-config.js文件配置）;
 
 > mock文件不会立即加载；只有请求触发时会加载；且不进行缓存；
 
 > 测试：启动edp或mock程序；浏览器中测试，或发curl请求
 
     http://localhost:8848/request.ajax?path=GET/auth&param={}
     
-----------------------

## 构造mock数据规范

- 请求规范

> 以下规范为默认的请求规范，如果不符合，可自定义getContext方法获取`path`、`param`和`Context`对象

> 前端代码发送真实请求；请求路径符合request.ajax?path=XXX形式;
> 参数param可以是POST或GET参数
param符合严格规范的json格式

- 构造数据代码规范

> 所有响应request.ajax?path={pathname}&param={object}请求每个pathname对应一个mock文件；

> mock文件名`/`替换为`_`；

> 独立mock文件命名为{pkgname}/{pathname}.js;

-- 对应每个接口应该指定一个响应函数；响应函数有固定参数列表(path, param, context)

-- index.js 文件可以定义多个接口的响应函数 (但是不建议写到index文件)

-- {pathname}.js 文件只能定义对应pathname的响应函数

————————————————————————

## mock文件示例

```js
// mock 的用法参考./test的文件

/**
 * 参数说明
 *
 * @param  {string} path    路由路径
 * @param  {Object} param   请求参数
 * @param  {HttpRequest} context.request
 * @param  {HttpResponse} context.response
 * @param  {function({array|object})} context.setCookie
 * @param  {function} context.update 更新服务
 */
module.exports = function (path, param, context) {

    // tpl在packages定义了路径
    var tpl = require('tpl/hospital');
    
    // lib/mendb是基于menset概念设计(未完全实现）
    var db = require('lib/mendb');
    
    /**
     * 
     * moment, random, template 为支持mockservice内置的组件
     */
    var moment = require('moment');  // 时间格式化组件
    var random = require('random');  // 随机数据产生器
    var template = require('template'); // 基于etpl的模板解析引擎 
    
    /**
     * 因为采用的是menset设计，因此直接赋值相当于改变了数据集
     * db 支持数据集的增删改查
     */
    var hospital = db.hospital.find({id: param.hospitalId})[0];
    // 修改hospital的访问量
    hospital.visitCount++;
    
    // 业务数据
    var data = {
        timestamp: random.timestamp(),
        title: tpl.title(hospital),
        creative: tpl.creative({
            id: hospital.id,
            name: hospital.name,
            city: random.words(hospital.cities), // 随机选择国内城市
            section: random.words(hospital.sections) // 随机选择医院科室
        })
     };
    
    // 返回数据
    return {
        status: 200, // 业务status，与http状态无关
        _status: 300, // 指定http状态； 不输出
        _timeout: 1000, // 延迟发送毫秒时间；不输出
        data: data
    };
};

// 注意db相关的功能尚在完善与测试中；暂不要在业务中使用
// 以上代码参考 test/response/GET_hospital.js
```

## 扩展modules 说明
> 扩展的modules是为了更好的支持mock数据的生成；

> 所有的modules通过require(modulename)既可以获取到；

> 从v0.1.12开始停止使用include; 全部使用require方式获取组件；

> mockservice; 内置了以下通用mock支持组件

- random : 产生随机数据 
> [random 说明文档](https://github.com/linkwisdom/mockservice/blob/master/docs/random.md)

- storage : 数据增删改查操作支持
> [storage 说明文档](https://github.com/linkwisdom/mockservice/blob/master/docs/storage.md)

- template : 采用的是etpl解析引擎，方便模板化产生数据
> [template 说明文档](https://github.com/linkwisdom/mockservice/blob/master/docs/template.md)

- moment : 基于moment.js时间格式化组件（无多国语言包）
> [moment 中文](http://momentjs.cn/docs/)

------------------------

### 调试

- 在执行参数列表中出现 `--debug` 字段，即可进入调试模式；
- 为方便调试，建议安装node-inspector；即 `npm install node-inspector -g`

```bash
    
    # edp 环境调试
    edp ws start --debug
```


### ISSUE todo

- 构造数据支持简单物料读写逻辑
