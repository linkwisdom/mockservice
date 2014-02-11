define(function(require, exports, module) {
    module.exports = function(path, param) {
        return {
            status: 200,
            param: param,
            timeout: 1000,
            data: [
                {userid: 150, name: 'jack chen'}
            ]
        };
    };
});