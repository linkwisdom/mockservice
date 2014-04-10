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
    
    // 获取数据长度
    var len = set.length;
    
    // 删除数据, 返回删除后的数据长度
    var num = set.remove({mod: 2});
    
    // 插入数据
    set.insert({name: 'mygod', mod: 1});
    
    // 批量拆入数据
    set.insert([...]);
    
    // 修改数据 (直接对查询结构修改)
    items.forEach(function (item, idx) {
        item.name = 'baby ' + idx;
    });
```
