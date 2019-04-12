module.exports = {
    "babel": [
        "babel-loader",
        "babel-preset-packez",
    ],
    "css": [
        "style-loader",
        "css-loader",
        "postcss-loader",
        "mini-css-extract-plugin",
        // "precss",
        "postcss-flexbugs-fixes",
        //"autoprefixer",
        "postcss-preset-env"
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
        "eslint-loader",
        "eslint-config-react-app",
        "eslint-plugin-flowtype",
        "eslint-plugin-import",
        //"eslint-config-alloy",
        // "eslint-config-airbnb",
        // "eslint-plugin-import",
        "eslint-plugin-react",
        "eslint-plugin-jsx-a11y",
    ],
    "json5": [
        "json5-loader"
    ],
    "vue": [
        "vue-loader",
        "vue-template-compiler"
    ]
}