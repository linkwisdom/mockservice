/**
 * memset: dataset in memory
 * 
 * @author: Liandong Liu (liu@liandong.org)
 */

/**
 * Memset
 *
 * @constructor
 */
function Memset(data) {
    this.set = [].concat(data);
}

function matchExtact(data, selector) {
    for (var key in selector) {
        if (selector[key] === true && data[key]) {
            continue;
        } else if (data[key] != selector[key]) {
            return false;
        }
    }
    return true;
}

function matchSome(selectors) {
    return function (item, index) {
        item._id = index;
        return selectors.some(function (selector) {
            return matchExtact(item, selector);
        });
    }
}

Memset.prototype = {
    find: function (selector, count) {
        if ('object' !== typeof selector) {
            var idx = +selector;
            count || (count = 1);
            return this.set.slice(idx, idx + count);
        }
        var selectors = [].concat(selector);
        return this.set.filter(matchSome(selectors));
    },
    remove: function (selector) {
        var set = this.set;
        var lst = this.find(selector);
        lst.forEach(function (item) {
            set[item._id] = null;
        });
        this.clear();
        return set.length;
    },
    insert: function (docs) {
        this.set.concat(docs);
    },
    clear: function () {
        this.set = this.set.filter(function(item) {
            return item;
        });
    }
};

Memset.prototype.__defineGetter__('length', function() {
    return this.set.length;
});


module.exports = Memset;