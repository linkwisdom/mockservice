define(function (require, exports, module) {
    var db = require('database');

    module.exports = function (path, param) {
        var uid = param.uid;
        if (uid) {
            console.log('insert', param);
            db.budy.insert(param)
        }

        var budies = db.budy.find({uid: uid});

        return {
            path: path,
            data: budies
        };
    };
});