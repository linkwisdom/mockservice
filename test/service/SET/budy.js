define(function (require, exports, module) {
    var db = require('database');

    module.exports = function (path, param) {
        var uid = param.uid;
        var budies = db.budy.find({uid: uid || true});

        // 修改内存中数据
        budies.forEach(function (budy) {
            for (var item in param) {
                budy[item] = param[item];
            }
        });

        return {
            path: path,
            data: budies
        };
    };
});