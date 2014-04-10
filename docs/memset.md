memset
==========
> 内存数据集合管理


```js
    var random = require('random');
    var Memset = require('memset');

    // 产生随机测试数据
    var data = [];
    for (var i = 0; i < 15; i++) {
        data.push({
            idx: i,
            mod: i % 5,
            name: random.words(10)
        });
    }

    // 创建一个数据集合示例
    var set = new Memset(data);

    // 寻找idx == 1的数据
    var item = set.find({idx: 1});

    // 寻找mod == 3的对象 或者 idx == 5 的对象
    var items = set.find([{mod: 3, idx: 5}]);

    // 寻找name不为空的对象
    var all = set.find({name: true});

    // 获取第3, 8个数据对象
    var parts = set.find(3, 5);
```