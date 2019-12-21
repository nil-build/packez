import path from "path";
import fs from "fs-extra";

const tsConfigPath = "../tsconfig/tsconfig.json";

const tsConfig = require(tsConfigPath);

export function getTSCompilerOptions(options) {
    const config = getTSConfig(options);
    return config.compilerOptions;
}

export function getTSConfigFilePath(options) {
    let filePath = path.resolve(options.cwd, "tsconfig.json");

    if (!fs.existsSync(filePath)) {
        filePath = path.resolve(__dirname, tsConfigPath);
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
