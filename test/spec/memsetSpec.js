/**
 * memsetSpec.js
 */
var random = require('../../modules/random');
var Memset = require('../../modules/memset');

var data = [];

for (var i = 0; i < 15; i++) {
    data.push({
        idx: i,
        mod: i % 5,
        name: random.words(10)
    });
}

describe('jasmine-node', function () {

    var set = new Memset(data);
    var item = set.find({idx: 1});
    var items = set.find([{mod: 3}]);
    var all = set.find({name: true});
    var parts = set.find(3, 5);

    it('test find memset', function () {
        expect(item.length).toBe(1);
        expect(items.length).toBeGreaterThan(2);
        expect(all.length).toBe(15);
        expect(parts.length).toBe(5);
    });

    set.remove({mod: 3});
    
    it('test remove memset', function () {
        expect(set.length).toBeLessThan(13);
    });

});