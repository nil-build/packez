const browserslist = require('./browserslist.config');
const autoprefixer = require('autoprefixer');

module.exports = function (cfg) {
    return {
        ident: 'postcss',
        plugins: [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
                browsers: cfg.browsers || browserslist,
                flexbox: 'no-2009',
            }),
        ]
    }
};