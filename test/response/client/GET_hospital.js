/**
 * @file 测试医院
 * 
 * @author Liandong Liu (liuliandong01@baidu.com)
 *
 * 测试内容
 * - storage 存取器
 * - template 模版内容生成
 * - random 随机物料生成器
 */
define(function (require, exports, module) {
    var db = require('lib/db');
    var tpl = require('template/hospital');
    var random = include('random');

    module.exports = function (path, param) {
        var hospital = db.hospital.find({id: param.hospitalId})[0];

        if (!hospital) {
            return {
                status: 400,
                data: []
            };
        }

        // 修改hospital的访问量
        hospital.visitCount++;

        var model = {
            id: hospital.id,
            name: hospital.name,
            city: random.words(hospital.cities), // 随机选择国内城市
            section: random.words(hospital.sections) // 随机选择医院科室
        };

        // 业务数据
        var data = {
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