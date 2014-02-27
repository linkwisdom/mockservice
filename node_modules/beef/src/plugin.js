var fs = require('fs');

exports.text = function (filename) {
    return fs.readFileSync(filename).toString();
};

exports.file = function (filename) {
    return fs.readFileSync(filename);
};

exports.json = function (filename) {
    return require(filename);
};

exports.css = function (filename) {
    var less = require('less');
    var content = fs.readFileSync(filename).toString();

    // 如果是同步处理的返回的是css
    less.render(content, function(err, css) {
        if (!err && css) {
            content = css;
        }
    });

    return content;
};

// 增加对本地module的支持
exports.module = function (name) {
    try {
        return require('paw').require(name);
    } catch(expt) {
        console.log('cannot find modules');
    }
};