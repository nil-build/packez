
import program from 'commander';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import _ from 'lodash';
import pkg from '../package.json';
import packez from './index';
import log from './utils/logger';

program
    .version(pkg.version)
    .option('-w, --watch', '是否监控文件改变')
    .option('-d, --outDir [outDir]', '输出到指定目录，默认为 dist', 'dist')
    .option('-t, --target [target]', '转换目标格式：web | node 默认为 web', /^node|web$/, 'web')
    .option('-c, --clear', '转换前清空输出目录')
    .option('-p, --publicPath [publicPath]', 'publicPath', '')
    .option('-l, --loaders [loaders]')
    .option('--polyfills [polyfills]', '设置polyfills文件,e.g. Promise,Set,Map,raf,fetch', '')
    .option('--cnpm', '使用cnpm安装依赖')
    .option('--corejs [corejs]', '参考 babel-runtime', true)
    .option('--helpers [helpers]', '参考 babel-runtime', true)
    .option('--regenerator [regenerator]', '参考 babel-runtime', true)
    .parse(process.argv);

const options = {
    watch: _.get(program, 'watch', false),
    target: _.get(program, 'target', 'web'),
    clear: _.get(program, 'clear', true),
    cnpm: _.get(program, 'cnpm', false),
    publicPath: _.get(program, 'publicPath', ''),
    corejs: _.get(program, 'corejs', true),
    helpers: _.get(program, 'helpers', true),
    regenerator: _.get(program, 'regenerator', true),
    loaders: _.get(program, 'loaders', ''),
};

const polyfills = {};
const polyfillsStr = _.get(program, 'polyfills', '');
const validExecuors = ['start', 'build', 'server', 'analyzer'];
const args = program.args;
const outputDir = _.get(program, 'outDir', 'dist');
let entry = './src/index.js';
let executor = 'start';

if (args[0] === 'init') {
    const pkgFile = process.cwd() + '/package.json';
    const scripts = pkg.scripts;
    fs.writeFileSync(path.resolve(process.cwd(), 'packez.config.js'), fs.readFileSync(__dirname + '/packez.config.ejs'));

    if (!scripts.start) {
        scripts.start = "packez start ./src/index.js -w -c";
        log(`add scripts.start = ${scripts.start} successfully.`);
    }

    if (!scripts.build) {
        scripts.build = "packez build ./src/index.js -c";
        log(`add scripts.build = ${scripts.build} successfully.`);
    }

    if (!scripts.server) {
        scripts.server = "packez server ./src/index.js -c";
        log(`add scripts.server = ${scripts.server} successfully.`);
    }

    if (!scripts.analyzer) {
        scripts.analyzer = "packez analyzer ./src/index.js -c";
        log(`add scripts.analyzer = ${scripts.analyzer} successfully.`);
    }

    log(`add packez.config.js successfully.`);

    fs.writeFileSync(
        pkgFile,
        JSON.stringify(pkg, null, 2) + os.EOL
    );

    process.exit(1);
}

if (polyfillsStr) {
    polyfillsStr.split(',').forEach(key => {
        polyfills[key] = true;
    });
}

if (args.length === 1) {
    if (validExecuors.indexOf(args[0]) === -1) {
        entry = args[0];
    }
} else if (args.length > 1) {
    executor = args[0];
    entry = args[1];
}

if (validExecuors.indexOf(executor) === -1) {
    throw new Error(`packez method ${executor} not exists! you may use start,build,server,analyzer`);
}

if (!fs.existsSync(entry)) {
    throw new Error(`entry file [${entry}] not exists!`);
}

const stats = fs.statSync(entry);

if (stats.isDirectory()) {
    const entries = {};
    const results = fs.readdirSync(entry);
    results.forEach(file => {
        if (/\.m?jsx?$/.test(file)) {
            entries[file] = path.resolve(entry, file);
        }
    });

    entry = entries;
}

packez[executor](entry, outputDir, {
    method: executor,
    publicPath: options.publicPath,
    watch: options.watch,
    target: options.target,
    cnpm: options.cnpm,
    clear: options.clear,
    polyfills,
    loaders: {
        babel: {
            runtimeOptions: {
                corejs: options.corejs ? 2 : false,
                helpers: options.helpers,
                regenerator: options.regenerator,
            }
        },
        scss: options.loaders.indexOf('scss') !== -1,
        sass: options.loaders.indexOf('sass') !== -1,
        less: options.loaders.indexOf('less') !== -1,
        vue: options.loaders.indexOf('vue') !== -1,
    },
    program
});

