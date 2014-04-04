## mockservice扩展

> mockservice 可以通过config实现自定义配置不同参数；
如果mockservice的默认逻辑无法满足你的项目特征；比如请求参数、处理过程不一致；

通过重写全局函数，能够方便的扩展应用；但是注意与其它全局方法或变量产生冲突；

### getContext

- getContext 通过请求和响应对象；获得mockservice必须的上下文；
上下文必需包含`path`和`param`两个属性，分别对应handler函数的两个参数;

`path` 表示请求的路径；能够区分ajax指向的服务名称

`param` 表示请求的参数；比如GET或POST传递的参数；或部分数据字段


```js

    global.getContext = functiong (request, response) {
        // 返回值按需求处理
        return {
            path: request.query.pathname,
            param: request.query
        };
    };
```

### printError

- printError定义了全局重叠错误处理方法

### packJSON

- packJSON 定义了输出数据格式

### setCookie
- setCookie 实现了cookie设置方法

### 其它全局方法

- 你可以定义其它全局方法，方便再mock模块中直接使用；但是慎重添加以免与其它全局数据命名冲突

