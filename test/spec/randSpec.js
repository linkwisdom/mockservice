var random = require('../../modules/random');

describe('jasmine-node', function () {

    it('test get random number', function () {
        expect(random.int(12, 15)).not.toBeGreaterThan(15);
        expect(random.int(12, 15)).not.toBeLessThan(12);
        expect(random.float(12, 15, 0.01)).not.toBeGreaterThan(15);
        expect(random.float(12, 15, 0.01)).toBeLessThan(16);
    });

    it('test get random strings', function () {

        // 数组源
        var source = ['推广', '搜索', '营销'];

        // 获取长度为12-15的字符串
        expect(random.chars(12, 15)).toMatch(/[\w-]{12,15}/);

        // 获取长度为12的随机字符串
        expect(random.chars(12).length).toBe(12);

        // 从默认数组中获取长度为12 - 15的中文字符串
        expect(random.words(12, 15).length).not.toBeGreaterThan(15);

        // 单独数组参数，表示从中取值一个单词
        expect(random.words(source).length).toBe(2);

        // 从源中产生长度为15的随机字符串
        expect(random.words(15, source).length).toBe(15);

        // 从数组中选取单词2词
        expect(random.getFrom(source, 2).length).toBe(2);
    });
});

