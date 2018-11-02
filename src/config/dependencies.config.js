module.exports = {
    "core": [
        "webpack",
        "webpack-merge",
        "file-loader",
        "raw-loader",
        "url-loader",
        "extract-loader",
        "webpack-manifest-plugin",
        "html-webpack-plugin",
        //"clean-webpack-plugin",
        "webpack-dev-server",
        "@babel/runtime",
        "@babel/runtime-corejs2",
        "chalk",
        "object.omit",
        "opn",
        "html-loader",
        "autoprefixer",
        "raf",
        "whatwg-fetch"
    ],
    "babel": [
        "babel-loader", // webpack loader
        "@babel/core",//"babel-core",
        "@babel/preset-env",
        "@babel/preset-flow",
        // "@babel/runtime",
        // "@babel/runtime-corejs2",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-async-generator-functions",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-do-expressions",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-function-bind",
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-logical-assignment-operators",
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-throw-expressions",
        "@babel/plugin-transform-flow-strip-types",
        "@babel/plugin-transform-proto-to-assign",
        "@babel/plugin-proposal-pipeline-operator",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-decorators",
        "@babel/plugin-transform-react-jsx-self",
        '@babel/plugin-transform-modules-amd',
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-transform-modules-systemjs',
        '@babel/plugin-transform-modules-umd',
    ],
    "jsx": [
        "@babel/preset-react",
        "@babel/plugin-transform-react-jsx"
    ],
    "css": [
        "css-loader",
        "postcss-loader",
        "mini-css-extract-plugin",
        "precss",
        "postcss-flexbugs-fixes",
        "autoprefixer",
    ],
    "less": [
        "less",
        "less-loader",
    ],
    "sass": [
        "node-sass",
        "sass-loader"
    ],
    "eslint": [
        "eslint",
        "babel-eslint",
        "eslint-config-alloy",
        // "eslint-config-airbnb",
        // "eslint-plugin-import",
        // "eslint-plugin-react",
        // "eslint-plugin-jsx-a11y",
    ],
    "json5": [
        "json5-loader"
    ],
    "vue": [
        "vue-loader",
        "vue-template-compiler"
    ]
}