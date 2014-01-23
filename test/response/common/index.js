define(function(require, exports, module) {
    exports.GET_auth = function(path, param) {
        return {
            status: 200,
            data: {
                login: true,
                usrname: 'jack'
            }
        };
    };

    exports.GET_group = function(path, param) {
        return {
            status: 200,
            data: [
                {groupid: 111, name: 'cpp'},
                {groupid: 121, name: 'js'}
            ]
        };
    };
});