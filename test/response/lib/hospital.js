/**
 * @file lib/hospital
 * - 产生医院类物料信息
 * - 本文件是为了实现menset设计的过渡文件；
 *
 * @author Liandong Liu (liuliandong01@baidu.com)
 */
define(function (require, exports, module) {
    var random = include('random');
    var cities = require('./cities');
    var sections = ['儿科' , '产科' , '妇科', '男科'];

    var data = [];
    var cityList = Object.keys(cities);

    // 批量产生随机物料信息
    for (var i = 0; i < 30; i++) {
        var regions = random.getFrom(cityList, 3);
        data.push({
            id: i + 1000,
            visitCount: random.number(50, 1000),
            name: random.words(regions) + random.words(sections) + '专业医院',
            sections: random.getFrom(sections, 3),
            cities: regions
        });
    }

    module.exports = {
        find: function (selector) {
            if (!selector || !selector.id) {
                return random.getFrom(data);
            }

            return data.filter(function (item) {
                if (item.id == selector.id) {
                    return item;
                } else {
                    return false;
                }
            });
        }
    };
});