define(function(require, exports, module) {
    module.exports = function(path, param) {
        return {
            status: 200,
            param: param,
            data: [
                {userid: 153, name: 'jack chen'}
            ]
        };
    };
});