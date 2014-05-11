define(function (require, exports, module) {
    var Memset = require('memset');
    var random = require('random');
    var data = [];
    var names = ['jack', 'mike', 'steph'];

    for (var i = 10; i >= 0; i--) {
        data.push({
            uid: random.int(100, 5000),
            name: random.chars(names) + i,
            age: random.int(12, 15),
        });
    };
    
    exports.budy = new Memset(data);
});