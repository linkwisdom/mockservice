## 模板工具
--------------
使用帮助参考 https://github.com/ecomfe/etpl

### 使用示例
——————————

```js
    var tpl = require('template');

    var html = require('text!./tpl.html');

    var render = tpl.compile('hello ${name}!');
    var data = render({name: 'mockservice'});

    // render from html which includes multi targets

    // compile html
    tpl.compile(html);

    tpl.getRenderer('title')({
        name: 'my cloud',
        city: 'beijing'
    });

```