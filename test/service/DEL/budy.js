define(function (require, exports, module) {
    var db = require('database');

    module.exports = function (path, param) {
        var uid = param.uid;
        if (uid) {
            db.budy.remove({uid: uid});
        }

        var budy = db.budy.find({uid: true});
        return {
            path: path,
            data: budy
        };
    };
});