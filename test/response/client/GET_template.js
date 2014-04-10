define(function (require, exports, module) {
    var random = require('random');
    var tpl = require('source/hospital');

    module.exports = function (path, param) {
        var regions = ['北京', '海淀', '朝阳', '西城', '东城'];

        var info = {
            city: random.words(regions),
            section: random.words(['幼儿', '男科', '妇科']),
            planname: random.chars(10, 40),
            unitid: random.number(1000, 5000),
            planid: random.number(300, 500)
        };

        return {
            status: 200,
            data: {
                unitid: info.unitid,
                planid: info.planid,
                planname: info.planname,
                creative: tpl.creative(info),
                title: tpl.title(info)
            }
        };
    };
});