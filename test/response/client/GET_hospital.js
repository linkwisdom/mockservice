define(function (require, exports, module) {
    var db = require('lib/db');
    var tpl = require('source/hospital');
    var random = require('random');
    var servcie = require('debug/service');

    module.exports = function (path, param) {
        var hospital = db.hospital.find({id: param.hospitalId})[0];

        // 修改hospital的访问量
        hospital.visitCount++;

        var model = {
            id: hospital.id + 2,
            name: hospital.name,
            city: random.words(hospital.cities), // 随机选择国内城市
            section: random.words(hospital.sections) // 随机选择医院科室
        };

        // 业务数据
        var data = {
            service: servcie,
            info: hospital,
            visitCount: hospital.visitCount,
            timestamp: random.timestamp(),
            title: tpl.title(model),
            creative: tpl.creative(model)
         };

        // 返回数据
        return {
            status: 200, // 业务status，与http状态无关
            _status: 300, // 指定http状态； 不输出
            _timeout: 1000, // 延迟发送毫秒时间；不输出
            data: data
        };
    };
});