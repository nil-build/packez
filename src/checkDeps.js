import fs from "fs-extra";
const dependencies = require('./config/dependencies.config');
const log = require('./logger');
/**
 * 获取未安装依赖
 */
function getDeps(opts) {
    const deps = new Set();
    const pkgFile = process.cwd() + '/package.json';
    let pkg = {};
    if (fs.existsSync(pkgFile)) {
        pkg = require(pkgFile);
    }

    const pkgDeps = Object.assign({}, pkg.dependencies, pkg.devDependencies);

    Object.keys(opts.loaders)
        .filter(v => opts.loaders[v])
        .forEach(v => {
            if (dependencies[v]) {
                dependencies[v].forEach(dep => {
                    deps.add(dep);
                });
            }
        });

    return [...deps].filter(v => !(v in pkgDeps));
}

export default function (opts) {
    const deps = getDeps(opts);

    const executor = opts.cnpm ? 'cnpm' : 'npm';

    if (!deps.length) return;

    log('开始安装依赖，共计 ' + deps.length + ' 个...');

    const cmd = `${executor} install --save-dev ${deps.join(' ')}`;
    log(cmd);
    execSync(cmd);

    log('依赖安装完成。');
}