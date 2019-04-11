
const path = require('path');
const getWebpackConfig = require('./webpack/webpack.config');
import normalizeConfig from './config';
const checkDeps = require("./checkDeps")



function initConfig(entry = './src/index.js', outputDir = 'dist', opts = {}) {
    const options = normalizeConfig(opts);
    let entries = entry;
    if (typeof entry === 'string' || Array.isArray(entry)) {
        entries = {
            index: entry
        };
    }

    outputDir = path.resolve(options.cwd, outputDir);

    options.outputDir = outputDir;

    options.entry = {};

    Object.keys(entries).forEach(key => {
        options.entry[key] = options.polyfills ? [].concat(options.polyfills, entries[key]) : [].concat(entries[key]);
        if (options.shouldUseFetch) {
            options.entry[key].unshift(require.resolve('./fetchPolyfills.js'));
        }
    });

    return options;
}

module.exports = {
    initConfig,
    getWebpackConfig,
    checkDeps
}