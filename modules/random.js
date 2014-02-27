/**
 * 生成随机数据(时间、文字、数字等)
 */
define(function(require, exports) {
    var ONE_DAY = 86400000; //一天的时间值
    var MAX_NUM = 1609372800000; //2020-12-31 作为默认最大数取值

    // 不要care下面的内容；随便取的啦
    var CNWORDS = '作为和同学们朝夕相处的内网我们始终在默默记录着'
            + '这一切内网的每一篇文字每一张图片每'
            + '一条评论都是百度变得更好的一份记录';
    CNWORDS = CNWORDS.split('');

    /**
     * 获取随机整数
     * @param  {number} min 最小取值
     * @param  {number} max 最大取值
     * @return {number} 随机数值
     */
    exports.number = function(min, max) {
        min || (min = 0);
        max || (max = MAX_NUM);
        var num = min + parseInt(Math.random() * (max - min), 10);
        return num;
    };

    /**
     * 获取随机时间戳
     * @param  {number} pre   当前时间之前多少天
     * @param  {number} after 当前时间之后多少天
     * @return {number}       时间戳值
     */
    exports.timestamp = function(pre, after) {
        var num = this.number(min, max);
        var timestamp = new Date() - ONE_DAY * num;
        return (timestamp).toString(10);
    };

    /**
     * 获得随机格式化时间
     * @param  {number} pre   当前时间之前多少天
     * @param  {number} after 当前时间之后多少天
     * @param  {string} format 时间格式
     * @return {number} 格式化时间
     */
    exports.formatDate = function(pre, after, format) {
        var moment = require('./moment');
        format || (format = 'YYYY-MM-DD');
        var diff = this.number(pre, after) * ONE_DAY;
        var day = (+new Date()) + diff;
        return moment.utc(day).format(format);
    };

    /**
     * 获得随机中文字符
     * @param  {number} num 字符长度
     * @return {string} 随机中文字符串
     */
    exports.chars = function(num) {
        var len = CNWORDS.length;
        num = this.number(1, num);
        var rst = [];
        
        for (var i = 0; i < num && rst.length < num; i++) {
            var idx = this.number(0, len - 4);
            rst = rst.concat(CNWORDS.slice(idx, idx + 3));
        }
        return rst.join('');
    };

});