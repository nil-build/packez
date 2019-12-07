//const browserslist = require('./browserslist.config');
// const autoprefixer = require('autoprefixer');
const postcssNormalize = require("postcss-normalize");

module.exports = function(opts) {
    return {
        ident: "postcss",
        plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
                autoprefixer: {
                    // browsers: opts.browsers || browserslist,
                    flexbox: "no-2009"
                },
                stage: 3
            }),
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            postcssNormalize()
        ]
    };
};
