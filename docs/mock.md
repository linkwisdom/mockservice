## mock 文件

### mock文件的组织

- mockservice 会自动扫描指定dir下的所有文件，并且符合匹配规则的文件加入服务列表
- mock文件应该按业务结构划分；分别放在不同目录结构中；
- mock的文件名与服务的path名保持一致
- index.js文件可以写多个service; 但是不会动态更新
- 每个文件夹可以独立配置`ms-config.js`文件

### 请求服务方法及参数

```js
    exports.GET_list = function (path, param, context) {
        var request = context.request;
        var response = context.response;

        setCookie({user: 'liandong'}, context);

        return {
            status: 200,
            data: [],
            _status: 200,
            _timeout: 500
        };
    };
```
- 请求参数 `param`
- 请求上下文 `context`
- 设置状态码 `_status`
- 设置超时 `_timeout`
- 设置cookie `setCookie`

### 补充说明

- define 结构不是必需的, 只是为了前后端兼容

> 如果不准备兼容前端包, 可以直接用nodejs的写法；

```js
    module.exports = function (path, param) {
        return {
            status: 200,
            data: []
        };
    };
```

等价于

```js
    define(function (require, expors, modules) {
        module.exports = function (path, param) {
            return {
                status: 200,
                data: []
            };
        };
    });
```

- 接口处理函数不是必须的

> mock 的数据如果是上下文无关的，可以不用函数

```js
    // service/index.js

    exports.GET_list = {
        status: 200,
        data: [1, 2, 3]
    };

    exports.GET_DList = function (path, param) {
        return {
            status: 200,
            data: {
                path: path,
                appId: param.appId
            }
        };
    };
```
