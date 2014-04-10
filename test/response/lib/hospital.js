/**
 * @file 测试index文件
 * 
 * 本文件是为了实现menset设计的过度文件；
 * 
 */
define(function (require, exports, module) {
    var random = require('random');
    var cities = require('./cities');
    var sections = ['儿科' , '产科' , '妇科', '男科'];

    var data = [];

    for (var i = 0; i < 30; i++) {
        data.push({
            id: i * 1000,
            visitCount: random.int(50, 1000),
            name: random.words(cities) + random.words(sections) + '专业医院',
            sections: random.getFrom(sections, 3),
            cities: cities
        });
    }

    module.exports = {
        // find 本应该在memset中设计的暂时在这里实现
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
        },
        remove: function (sections) {
            // 删除符合条件的数据
            return true;
        }
    };
});