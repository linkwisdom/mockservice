var random = require('../../modules/random');

describe('jasmine-node', function () {

    it('test get random number', function () {
        expect(random.int(12, 15)).not.toBeGreaterThan(15);
        expect(random.int(12, 15)).not.toBeLessThan(12);
        expect(random.float(12, 15, 0.01)).not.toBeGreaterThan(15);
        expect(random.float(12, 15, 0.01)).toBeLessThan(16);
    });

    it('test get random strings', function () {
        expect(random.chars(12, 15)).toMatch(/[\w-]{12,15}/);
        expect(random.chars(12).length).toBe(12);
        expect(random.words(12, 15).length).not.toBeGreaterThan(15);
        var rst = random.words(15, ['abb', 'bcc', 'cdd']);
        expect(rst.length).toBe(15);
    });
});

