define(function (require, exports, module) {
    var data = require('./data');
    var storage = include('storage');
    storage.init(data);
    module.exports = storage;
});
