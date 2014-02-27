define(function(require, exports, module) {
    require(['./mod'], function(mod) {
        console.log(mod);
    });

    module.exports = {
        mod: 'mod',
        name: 'amd'
    };
});