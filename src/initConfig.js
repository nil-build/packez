// import path from "path";
import isObject from "lodash/isObject";
import getConfig from "./config";

export default function initConfig(
    entry = "./src/index.js",
    outputDir = "dist",
    opts = {}
) {
    if (arguments.length === 1 && isObject(entry)) {
        opts = entry;
        entry = "./src/index.js";
        outputDir = "dist";
    }

    const options = getConfig(opts);

    let entries = options.entry || entry;
    if (typeof entry === "string" || Array.isArray(entry)) {
        entries = {
            index: entry
        };
    }

    options.entry = entries;
    options.outputDir = options.outputDir || outputDir;

    let polyfills = options.polyfills;
    if (polyfills) {
        polyfills = Array.isArray(polyfills) ? polyfills : [polyfills];
    } else {
        polyfills = [];
    }

    Object.keys(entries).forEach(key => {
        entries[key] = [].concat(polyfills, entries[key]);
    });

    return options;
}
