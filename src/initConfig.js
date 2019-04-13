import path from 'path';
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
    const polyfills = [];
    Object.keys(options.polyfills)
        .forEach(name => {
            if (options.polyfills[name]) {
                polyfills.push(require.resolve(`./polyfills/${name}.js`));
            }
        });

    Object.keys(entries).forEach(key => {
        options.entry[key] = polyfills.concat(entries[key]);
    });

    return options;
}
