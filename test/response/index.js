define(function(require, exports, module) {
    exports.GET_book = function(path, param) {
        return {
            status: 200,
            data: [
                {bookid: 123, name: 'wind'}
            ]
        };
    };
});