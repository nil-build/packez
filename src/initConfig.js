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

    options.outputDir = outputDir;

    options.entry = {};
    let polyfills = options.polyfills;
    if (polyfills) {
        polyfills = Array.isArray(polyfills) ? polyfills : [polyfills];
    } else {
        polyfills = [];
    }

    Object.keys(entries).forEach(key => {
        options.entry[key] = [].concat(polyfills, entries[key]);
    });

    return options;
}
