const path = require('path');
import getConfig from './config';

export default function initConfig(entry = './src/index.js', outputDir = 'dist', opts = {}) {
    const options = getConfig(opts);
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
