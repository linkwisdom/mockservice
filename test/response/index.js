define(function (require, exports, module) {
    exports.GET_halo = function (path, param) {
        return {
            status: 200,
            data: 'hello ' + param.name + '!'
        };
    };
});