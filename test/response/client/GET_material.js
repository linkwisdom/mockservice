define(function (require, exports, module) {
    var db = require('lib/db');

    module.exports = function (path, param) {
        return {
            data: db.cities,
            countries: db.countries,
            _timeout: 500
        };
    };
});