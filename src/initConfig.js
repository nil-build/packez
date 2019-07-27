import path from "path";
import getConfig from "./config";

export default function initConfig(
    entry = "./src/index.js",
    outputDir = "dist",
    opts = {}
) {
    const options = getConfig(opts);
    let entries = entry;
    if (typeof entry === "string" || Array.isArray(entry)) {
        entries = {
            index: entry
        };
    }

    // outputDir = path.resolve(options.cwd, outputDir);
    options.outputDir = outputDir;

    options.entry = {};
    let polyfills = options.polyfills
        ? options.polyfills
        : [require.resolve(`./polyfills`)];

    polyfills = Array.isArray(polyfills) ? polyfills : [polyfills];

    Object.keys(entries).forEach(key => {
        options.entry[key] = [].concat(polyfills, entries[key]);
    });

    return options;
}
