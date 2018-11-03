
const path = require('path');
const execSync = require('child_process').execSync;
const fs = require("fs-extra");
const dependencies = require('./config/dependencies.config');
const webpackConfig = require('./webpack/webpack.config');
const normalizeConfig = require('./defaultOptions');
const log = require('./logger');

function getWebpackConfig(entry = './src/index.js', outputDir = 'dist', opts = {}) {
    const options = normalizeConfig(opts);
    let entries = entry;
    if (typeof entry === 'string' || Array.isArray(entry)) {
        entries = {
            index: entry
        };
    }

    outputDir = path.resolve(options.cwd, outputDir);

    options.outputDir = outputDir;

    //fs.ensureDirSync(outputDir);

    //installDeps(options);

    options.entry = {};

    Object.keys(entries).forEach(key => {
        options.entry[key] = options.polyfills ? [].concat(options.polyfills, entries[key]) : [].concat(entries[key]);
        if (options.shouldUseFetch) {
            options.entry[key].unshift(require.resolve('./fetchPolyfills.js'));
        }
    });

    return webpackConfig(options);
}

/**
 * 获取未安装依赖
 */
function getDepsFromConfig(cfg) {
    cfg = normalizeConfig(cfg);
    const deps = new Set(dependencies.core);
    const pkgFile = process.cwd() + '/package.json';
    let pkg = {};
    if (fs.existsSync(pkgFile)) {
        pkg = require(pkgFile);
    }

    const pkgDeps = Object.assign({}, pkg.dependencies, pkg.devDependencies);

    Object.keys(cfg.modules).filter(v => cfg.modules[v]).forEach(v => {
        if (dependencies[v]) {
            dependencies[v].forEach(dep => {
                deps.add(dep);
            });
        }
    });

    return [...deps].filter(v => !(v in pkgDeps));
}

function installDeps(options) {
    options = normalizeConfig(options);
    const deps = getDepsFromConfig(options);

    const executor = options.cnpm ? 'cnpm' : 'npm';

    if (!deps.length) return;

    log('开始安装依赖，共计 ' + deps.length + ' 个...');

    const cmd = `${executor} install --save-dev ${deps.join(' ')}`;
    log(cmd);
    execSync(cmd);

    log('依赖安装完成。');
}

module.exports = {
    getWebpackConfig,
    getDepsFromConfig,
    normalizeConfig,
    installDeps
}