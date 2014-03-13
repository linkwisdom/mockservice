define(function (require, exports, module) {
    var data = require('./data');
    module.exports = {
        global: {},
        cities: require('json!./cities.json'),
        countries: require('json!./countries.json'),
        hospital: require('./hospital')
    }
});