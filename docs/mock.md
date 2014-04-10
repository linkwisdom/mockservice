## mock 文件

### mock文件的组织

- mockservice 会自动扫描指定dir下的所有文件，并且符合匹配规则的文件加入服务列表
- mock文件应该按业务结构划分；分别放在不同目录结构中；
- mock的文件名与服务的path名保持一致
- index.js文件可以写多个service; 但是不会动态更新
- 每个文件夹可以独立配置`ms-config.js`文件

[文件结构配置](config.md)
[beef包管理](beef.md)
[自定义扩展](extension.md)

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

[context参数说明](context.md)

### 补充说明

- define 结构不是必需的, 只是为了前后端兼容
- 如果是静态数据，直接将数据作为暴露对象即可

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

等价于

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
module.exports = {
   status: 200,
   data: [] 
};
```