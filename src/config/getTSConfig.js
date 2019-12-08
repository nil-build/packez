import path from "path";
import fs from "fs-extra";
const tsConfig = require("./tsconfig");

export function getTSCompilerOptions(options) {
    const config = getTSConfig(options);
    return config.compilerOptions;
}

export function getTSConfigFilePath(options) {
    const filePath = path.resolve(options.cwd, "tsconfig.json");

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(tsConfig, null, 2));
    }

    return filePath;
}

export default function getTSConfig(options) {
    let customizeConfig = {};
    const configPath = path.join(options.cwd, "tsconfig.json");
    if (fs.existsSync(configPath)) {
        customizeConfig = require(configPath) || {};
    }
    return {
        ...tsConfig,
        ...customizeConfig,
        compilerOptions: {
            ...tsConfig.compilerOptions,
            ...options.tsCompilerOptions,
            ...customizeConfig.compilerOptions
        }
    };
}
