/**
 * @file 不同类型随机数产生器
 *
 * @author Liandong Liu (liuliandong01@baidu.com)
 */

var ONE_DAY = 86400000; //一天的时间值
var MAX_NUM = 1609372800000; //2020-12-31 作为默认最大数取值

/**
 * 随机中文字符串，建议用户用户自己指定随机数组
 * 
 * @inner
 * @type {Array}
 */
var CN_WORDS = [
    '第一', '权威', '儿童', '成人', '职场',
    '英语', '健康', '幼儿', '中学', '小学'
];

/**
 * 有偏差的随机英文随机字符组合
 * 
 * @type {String}
 */
var CHARS = 'abcdefg-hijklmnopqrstu-vwxyz-'
    + 'ABCDEFGHIG-KLMNOPQRSTU-VWXYZ-0123456789';

/**
 * randInt 随机整数
 * 
 * @param  {number} min 最小取值
 * @param  {number} max 最大取值
 * @return {number}     返回整数
 * @private
 */
function randInt(min, max) {
    min || (min = 0);
    (max === undefined) && (max = MAX_NUM);
    var num = Math.floor(min + Math.random() * (max - min + 1));
    return num;
};

/**
 * 随机整数
 * 
 * @type {Function}
 * @public
 */
exports.int = randInt;

/**
 * getFrom 从数组中随机选择num个元素
 * 
 * @param  {Arrary} source 数据源
 * @param  {number} num 个数
 * @return {Array}  返回数组
 * @public
 */
exports.getFrom = function (source, num) {
    source || (source = CN_WORDS);
    var len = source.length;
    var rst = [];

    for (var i = 0, l = num || 1 ; i < l ; i++) {
        var idx = randInt(0, len - 1);
        rst.push(source[idx]);
    }
    return rst;
};

/**
 * 获取随机整数
 * @param  {number} min 最小取值
 * @param  {number} max 最大取值
 * @return {number} 随机数值
 * @public
 */
exports.number = function (min, max) {
    return randInt(min, max);
};

/**
 * 获取随机浮点数
 * 
 * @param  {number} min 最小取值
 * @param  {number} max 最大取值
 * @param {number} precise 数值精度0-20
 * @return {number} 随机数值
 * @public
 */
exports.float = function (min, max, precise) {
    min || (min = 0);
    (max === undefined) && (max = MAX_NUM);
    var rst = Math.random() * (max - min) + min;
    if (precise !== undefined) {
        rst = +(rst).toFixed(precise);
    }
    return rst;
};

/**
 * 获取随机时间戳
 * @param  {number} pre   当前时间之前多少天
 * @param  {number} after 当前时间之后多少天
 * @return {string}       时间戳值
 * @public
 */
exports.timestamp = function (pre, after) {
    var num = randInt(pre || 0, after || 0);

    var timestamp = +(new Date()) + ONE_DAY * num;

    return (timestamp).toString(10);
};

/**
 * 获得随机格式化时间
 * @param  {number} pre   当前时间之前多少天
 * @param  {number} after 当前时间之后多少天
 * @param  {string} format 时间格式
 * @return {number} 格式化时间
 * @public
 */
exports.formatDate = function (pre, after, format) {
    var moment = require('./moment');
    format || (format = 'YYYY-MM-DD');
    var timestamp = +this.timestamp(pre, after);
    return moment.utc(timestamp).format(format);
};

/**
 * 获得随机字符串
 * - 长度按utf8长度计算，单个中英文字符长度均为1，
 * 
 * @param  {?number} min 字符最小长度
 * @param  {?number} max 字符最大长度
 * @param  {?Arrary|string} source 字符最小长度
 * @return {string} 随机字符串
 * @public
 */
exports.words = function (min, max, source) {
    var arg1 = arguments[0];

    // 如果第一个参数是数组，则视为source
    if (min instanceof Array) {
        source = min;
        min = max = 1;

    // 否则如果第二个参数为数组，则视为source
    } else if (max instanceof Array) {
        source = max;
        max = min;

    // 如果第一个参数未定义，默认返回一个单词
    } else if (arg1 === undefined) {
        min = max = 1 
    };

    source = source || CN_WORDS;
    var len = source.length;
    var num = randInt(min, max || min);
    var rst = [];
    var count = 0;
   
    for (var i = 0; i < num && count < num; i++) {
        var idx = randInt(0, len - 1);
        count += source[idx].length;

        if (count <= num) {
            rst = rst.concat(source[idx]);
        } else if (arg1 instanceof Array) {
            rst = rst.concat(source[idx]);
            break;
        } else {
            rst = rst.concat(source[idx].slice(0, num - count + source[idx].length));
            break;
        }
    }

    // 拼接字符串
    return rst.join('');
};

/**
 * 随机英文字符
 * 
 * @param  {number} min 最小长度取值
 * @param  {number} max 最大长度取值
 * @return {string}     返回英文字符
 * @public
 */
exports.chars = function (min, max) {
    return this.words(min, max, CHARS);
};
