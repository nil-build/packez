const merge = require('webpack-merge');

module.exports = merge({
    //数组的值直接覆盖，不要追加
    customizeArray(a, b, key) {
        return b;
    }
});