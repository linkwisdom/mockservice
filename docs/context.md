context
=========
> context 是通过global.getContex方法得到的请求上下文对象；
> 可以通过改写改函数满足不同的业务需求
> 以下解说是默认的解析得到的结果


```js
var context = getContext(request, response);
```

## context.path
> 请求的`GET`/`POST`指定的`path`参数

## context.param

> param 表示GET/POST请求中包含的 `param` 或  `params` 字段

- context.param 只是请求中的一个字段
- 要获得所有请求字段通过`context.GET`或者`context.POST`得到

# context.GET
> 通过GET得到的参数

# context.POST
> 通过POST得到的参数

## context.headers

> headers 为当前请求设置头文件，如设置状态、设置cookie等

- 设置cookie可以用setCookie(context, cookies)方式
- 设置状态码可以返回_status的方式设置

## context.request
> 请求Request 对象本身

## context.response
> 请求Response 对象本身