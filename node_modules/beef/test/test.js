// 只有在入口文件才采用侵入方式
var require = require('../src/require');

require.config({
    baseUrl: './source',
    packages: {
        'admin': '../admin'
    }
});

var mod = require('./mod');

require(['./amd'], function(amd) {
    console.log(amd);
});

var text = require('text!./text.txt');

console.log(text);


pow = require('admin/pow');
console.log(pow);

var fcpipe = require('mockservice');
// var css = require('css!./style.less');

// console.log(css);