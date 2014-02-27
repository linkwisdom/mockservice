define(function (require, exports, module) {
    module.exports = function (path, param) {
        return {
            status: 200,
            _status: 300, // http status
            param: param,
            _timeout: 1000, // delay response
            data: [
                {userid: 1510, name: 'jack chen'}
            ]
        };
    };
});