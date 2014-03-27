/**
 * @file template/hospital
 * - 通过模板方式产生物料术语
 *
 * @author Liandong Liu (liuliandong01@baidu.com)
 */
define(function (require, exports, module) {
    var tpl = require('text!./tpl.html');
    var template = include('template');
    template.compile(tpl);

    exports.title = function (data, target) {
        target || ( target = 'hospital-title');
        return template.getRenderer(target)(data).trim();
    };

    exports.creative = function (data, target) {
        target || ( target = 'hospital-creative');
        return template.getRenderer(target)(data).trim();
    };
});