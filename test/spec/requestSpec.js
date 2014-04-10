var request = require('request');

process.chdir(__dirname);

var ms = require('../../');

ms.config([
    {
        dir: '../response',
        logError: {
            logFile: 'ms-error-log'
        }
    },
    {
        name: 'debug',
        dir: '../debug'
    }
]);

ms.listen(8848);

// close server in N seconds
ms.close(3500);

var testResponse = function (option, done) {

    option.params = JSON.stringify(option.params || {});

    var url = 'http://localhost:8848/request.ajax?path=' 
        + option.path + '&params=' + option.params;

    request(url, function(error, response, body){
        var data = JSON.parse(body).data;

        if (option.validate) {
            option.validate(data);  
        } else {
            var exValue = option.key ? data[option.key] : data;
            expect(exValue).toEqual(option.value);
        }
        
        done && done();
    });
};

describe('jasmine-node', function () {
    it('should response with hello mockies!', function (done) {
        testResponse({
            path: 'GET/halo',
            params: {name: 'mockies'},
            value: 'hello mockies!'
        }, done);
    });

    it('test get_material. data.length == 3', function (done) {
        testResponse({
            path: 'GET/material',
            params: {},
            key: 'length',
            value: 3
        }, done);
    });

    it('should respond with data.finished == true', function (done) {
        testResponse({
                path: 'GET/modules',
                params: {},
                key: 'finished',
                value: true
            }, done);
    }, 4000);

    it('should respond with data == ok', function (done) {
        testResponse({
                path: 'GET/storage',
                params: {},
                key: false,
                value: 'ok'
            }, done);
    }, 4000);

    it('should respond with hospital information', function (done) {
        testResponse({
            path: 'GET/hospital',
            params: {hospitalId: 1000},
            validate: function (data) {
                expect(data.info).not.toBeNull();
                expect(data.info.id).toBe(1000);
                expect(data.creative.length).toBeGreaterThan(10);
            }
        }, done);
    }, 4000);

    it('should respond with fcfe', function (done) {
        testResponse({
                path: 'scookie',
                params: {},
                key: false,
                value: 'fcfe'
            }, done);
    }, 5000);

    it('should respond with data with title, creative and planname',
        function(done) {
            testResponse({
                path: 'GET/template',
                params: {},
                validate: function (data) {
                    expect(data.title).not.toBeNull();
                    expect(data.creative).not.toBeNull();
                    expect(data.planname).toMatch(/\w+/);
                }
            }, done);
        }, 6000);
});

