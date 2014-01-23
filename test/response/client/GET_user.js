define(function(require, exports, module) {
    exports = function(path, param) {
        return {
            status: 200,
            data: [
                {userid: 153, name: 'jack chen'}
            ]
        };
    };

    return exports;
});