storage 数据支持
=============


```js
    var db = require('storage');
    var memSet = require('memset');
    
    db.use('aoPackage'); // 使用aoPackage作为数据集
    
    // 存取数据对象
    db.set('message', 'ok');
    var msg = db.get('message');
    
    // 结合memset使用
    var hospital = new memSet();
    
    // 初始化一个数据集
    db.init({
        hospital: hospital
    });
    
    db.hospital.find({name: '北京天坛医院'});
    
    // 插入数据集合
    db.hospital.insert([
        ...
    ]);
    
    // 删除数据
    db.hospital.remove([
        {score: 0},
        {name: '*美容医院*'}
    ]);
```
