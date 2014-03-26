define(function (require, exports, module) {
    var data = require('./data');
    module.exports = {
        global: {},
        cities: require('json!./cities.json'),
        hospital: require('./hospital')
    }
});