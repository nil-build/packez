import fs from "fs-extra";
import { execSync } from 'child_process';
import dependencies from './config/dependencies.config';
import log from './utils/logger';
import os from 'os';
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

    if (!pkg.browserslist) {
        pkg.browserslist = opts.browserslist;

        fs.writeFileSync(
            pkgFile,
            JSON.stringify(pkg, null, 2) + os.EOL
        );
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