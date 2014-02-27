define(function (require, exports, module) {
    var moment = include('lib/moment');
    var storage = include('storage');
    var rand = include('random');
    
    storage.set('count', (storage.get('count') || 0) + 1);

    module.exports = function (path, param) {
        return {
            data: [123, 122, 135],
            count: storage.get('count'),
            date: rand.formatDate(-50, -20),
            _timeout: 2000
        };
    };
});