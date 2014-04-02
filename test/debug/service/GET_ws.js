define(function (require, exports, module) {
    var ws = require('service');
    var cities = require('lib/cities');
    module.exports = function (path, param) {
        return {
            data: ['1'],
            cities: cities,
            list: ws.list
        };
    };
});