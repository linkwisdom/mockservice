mockservice
===========

mock方案


## 构造mock数据规范

> 所有响应request.ajax?path={pathname}&param={object}请求只能定义在 {pkgname}/index.js文件中；单个接口mock代码如果较大建议写成单个文件；文件命名为{pkgname}/{pathname}.js;

- 对应每个接口应该指定一个响应函数；响应函数有固定参数列表(path, param)
- index.js 文件可以定义多个接口的响应函数
- {pathname}.js 文件只能定义对应pathname的响应函数
- 所有在mock文件夹下的index.js文件及{}