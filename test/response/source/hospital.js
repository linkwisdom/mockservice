define(function (require, exports, module) {
    var random = require('random');
    var tpl = require('text!./tpl.html');

    var template = require('template');
    var render = template.compile(tpl);

    exports.title = function (data, target) {
        target || ( target = 'hospital-title');
        return template.getRenderer(target)(data).trim();
    };

    exports.creative = function (data, target) {
        target || ( target = 'hospital-creative');
        return template.getRenderer(target)(data).trim();
    };
});