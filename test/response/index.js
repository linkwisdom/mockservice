define(function(require, exports, module) {
    exports.GET_book = function(path, param) {
        module.exports = {
            status: 200,
            data: [
                {bookid: 123, name: 'wind'}
            ]
        };
    };
});