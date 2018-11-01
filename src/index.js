
import path from "path";
const execSync = require('child_process').execSync;
const fs = require("fs-extra");
const dependencies = require('./config/dependencies.config');
const webpackConfig = require('./webpack/webpack.config');
const defaultOptions = require('./defaultOptions');
const log = require('./logger');

const normalizeConfig = defaultOptions;

export default function (entry = './src/index.js', outputDir = 'dist', opts = {}) {
    const options = normalizeConfig(opts);
    let entries = entry;
    if (typeof entry === 'string' || Array.isArray(entry)) {
        entries = {
            index: entry
        };
    }

    outputDir = path.resolve(options.cwd, outputDir);

    fs.ensureDirSync(outputDir);

    options.appOutputDir = outputDir;

    installDeps(options);

    options.entry = {};

    Object.keys(entries).forEach(key => {
        options.entry[key] = options.polyfills ? [].concat(options.polyfills, entries[key]) : [].concat(entries[key])
    });

    return webpackConfig(options);
}

/**
 * 获取未安装依赖
 */
function getDepsFromConfig(cfg) {
    cfg = defaultOptions(cfg);

    const deps = new Set(dependencies.core);
    const pkgFile = process.cwd() + '/package.json';
    let pkg = {};
    if (fs.existsSync(pkgFile)) {
        pkg = require(pkgFile);
    }

    const pkgDeps = Object.assign({}, pkg.dependencies, pkg.devDependencies);

    Object.keys(cfg.module).filter(v => cfg.module[v]).forEach(v => {
        if (dependencies[v]) {
            dependencies[v].forEach(dep => {
                deps.add(dep);
            });
        }
    });

    return [...deps].filter(v => !(v in pkgDeps));
}

function installDeps(cfg) {
    const options = defaultOptions(cfg);
    const deps = getDepsFromConfig(cfg);

    const executor = options.cnpm ? 'cnpm' : 'npm';

    if (!deps.length) return;

    log('开始安装依赖，共计 ' + deps.length + ' 个...');

    const cmd = `${executor} install --save-dev ${deps.join(' ')}`;
    log(cmd);
    execSync(cmd);

    log('依赖安装完成。');
}

// function createWebpackConfig(options = {}) {
//     return webpackConfig(defaultOptions(options));
// }

// module.exports = {
//     installDeps,
//     normalizeConfig,
//     getDepsFromConfig,
//     createWebpackConfig
// };
