
exports = require('./core');

/**
 * 为特定对象增加扩展(或覆盖)
 *
 * @private
 * @param {Object} extension 扩展对象
 * @param {Object} target 目标对象
 */
function addExtension(extension, target) {
    target = target ? target : global;
    for (var item in extension) {
        target[item] = extension[item];
    }
};

/**
 * 加载全局函数的扩展
 */
addExtension(require('./global-extension'), global);

/**
 * 引入默认模块
 */
exports.config(require('./ms-config'));

/**
 * 根据执行环境加载不同扩展
 */
if (process.argv[1].indexOf('edp') > -1) {
    addExtension(require('./edp-extension'), exports);
} else {
    addExtension(require('./server'), exports);
}

/**
 * 增加默认的服务
 * - 主要有异常服务404/505/300
 */
require('./scan').addService(require('./service'));

/**
 * 模块暴露对象
 * @public
 */
module.exports = exports;