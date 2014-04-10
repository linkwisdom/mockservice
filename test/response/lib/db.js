define(function (require, exports, module) {
    var data = require('./data');
    var storage = require('storage');
    storage.init(data);
    module.exports = storage;
});
