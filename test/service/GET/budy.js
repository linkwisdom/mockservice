define(function (require, exports, module) {
    var db = require('database');

    module.exports = function (path, param) {
        var budy = db.budy.find({uid: param.uid || true});

        return {
            path: path,
            data: budy
        };
    };
});