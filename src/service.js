/**
 * 默认的服务
 * 
 * @type {Object}
 */
module.exports = {
    // 返回内容错误或为空
    'status_300': function(path, param) {
        return {
            path: path,
            _status: 300,
            status: 300,
            data: '[no result defined]'
        };
    },
    // 模块未定义
    'status_404': function (path, param) {
        return {
            path: path,
            msg: 'module not found',
            _status: 404
        };
    },
    // 模块错误
    'status_500': function (path, param) {
        return  {
            path: path,
            msg: param.msg,
            _status: 500
        }
    }
};