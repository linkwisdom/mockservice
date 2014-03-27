/**
 * @file 测试Ajax请求的返回值
 * 
 * @author Liandong Liu (liuliandong01@baidu.com)
 *
 * 测试方法
 * - 安装依赖组件
 *     npm install
 *     
 * - 安装jasmine-node
 *     npm install jasmine-node -g
 *     
 * - 利用npm 自动测试
 *     npm test
 */

// 测试可能需要单独安装 request
var request = require('request');

// 获得mockservice 模块对象
var ms = require('../../');

// 配置服务
ms.config({
    dir: require('path').resolve(__dirname, '../response')
});

// 启动服务
ms.listen(8848);

// 定时关闭服务
ms.close(4000);

/**
 * 自动测试ajax响应数据是否正确
 * 
 * @param  {Object}   option 测试参数
 * @param  {Function} done   回调函数
 */
function testResponse(option, done) {
    option.params = JSON.stringify(option.params || {});

    var url = 'http://localhost:8848/request.ajax?path=' 
        + option.path + '&params=' + option.params;

    request(url, function (error, response, body) {
        var data = JSON.parse(body).data;
        if (option.validate) {
            // 自定义验证器
            option.validate(data);
        } else {
            // 简单的值匹配
            var exValue = option.key ? data[option.key] : data;
            expect(exValue).toEqual(option.value);
        }
        // 通过done回调测试是否成功
        done && done();
    });
}

// 测试部分
describe('jasmine-node', function () {

    // 测试数据存储、参数获取
    it('test GET_city', function (done) {
        testResponse({
            path: 'GET/city',
            params: {cityName: '北京'},
            key: 'pyName',
            value: 'beijing'
        }, done);
    });

    // 测试物料存储、模板引擎、随机数据生成
    it('test GET_hospital', function (done) {
        testResponse({
                path: 'GET/hospital',
                params: {hospitalId: 1001},
                validate: function (data) {
                    expect(data.visitCount).toBeGreaterThan(50);
                    expect(data.creative).toMatch(/医院/g);
                    expect(data.info.id).toEqual(1001);
                    expect(data.info.cities.length).toEqual(3);
                }
            }, done);
    }, 1000);

    // 测试状态与延迟
    it('test GET_delay', function (done) {
        var count = 0;
        console.time('GET_delay');

        // 前端计数
        var p = setInterval(function () {
            count++;
            if (count > 300) {
                clearInterval(p);
            }
        }, 10);

        testResponse({
                path: 'GET/delay',
                params: {delay: 1000},
                validate: function (data) {
                    // 输出计时时间
                    console.timeEnd('GET_delay');

                    // 在客户端计数；验证延迟效果，是否至少计数40次以上
                    expect(count).toBeGreaterThan(40);

                    // 在服务端计数
                    expect(data.count).toBeGreaterThan(40);
                }
            }, done);
    }, 4000);

    // 测试不存在的模块, 返回状态码为404
    it('test GET_notfound', function (done) {
        var url = 'http://localhost:8848/request.ajax?path=GET/notfound';
        request(url, function (error, response, body) {
            expect(response.statusCode).toEqual(404);
            done();
        });
    }, 1000);

    // 测试含有错误的模块, 返回状态码为500
    // 能够正常打印错误信息，且系统不退出
    it('test GET_Error', function (done) {
        var url = 'http://localhost:8848/request.ajax?path=GET/Error';
        request(url, function (error, response, body) {
            expect(response.statusCode).toEqual(500);
            done();
        });
    }, 1000);
});

