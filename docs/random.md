## 随机数据产生器

### 产生数字

```js
    var random = require('random');

    random.int(0, 1000); // 产生大于100的数据整数
    random.int(100); // 产生大于100的数据整数

    random.float(0.01, 0.9, 0.001); // 产生随机浮点数据，在[0.01, 0.9]之间；精度为0.001
    random.float(1, 99); // 产生随机浮点数据，在[1, 99]之间；精度不限制

```

### 产生日期时间


```js
    var random = require('random');

    random.timestamp(-100, -10); // 产生100天到10天之前的随机时间戳
    random.formatDate(-100, -10, 'YYYY年MM月DD日'); // ..., 产生随机时间，指定特定日期格式
    random.formatDate(-100, -10); // ..., 默认日期格式为'YYYY-MM-DD'

```

### 产生字符串

```js
    var random = require('random');

    var source = ['计划', '单元', '关键词'];

    random.chars(100); // 生成随机英文、数字字符串；长度为100
    random.chars(20, 100); // 生成随机英文、数字字符串，长度为20-100
    random.words(source); // 从source中随机取值1次；长度取决source单词长度
    random.words(10, source) // 从source中随机取值字符串；长度为10
    random.words(10, 20, source) // 从source中随机取值组合字符串；长度为10-10
```

### 随机数组摘取
```js
    var random = require('random');

    var source = ['计划', '单元', '关键词'];

    random.getFrom(source); // 从指定数组取值一次；返回数组
    random.getFrom(source, 5); // 从指定数组取值5次；返回数组

```