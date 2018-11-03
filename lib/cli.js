
"use strict";

const program = require('commander');

const path = require('path');

const pkg = require("../package.json");

const start = require("../start");

const fs = require('fs-extra');

program.version(pkg.version).option('-w, --watch', '是否监控文件改变', true).option('-d, --outDir [outDir]', '输出到指定目录，默认为 dist', 'dist').option('-t, --target [target]', '转换目标格式：web | node 默认为 web', /^node|web$/, 'web').option('-c, --clear', '转换前清空输出目录', true).option('-p, --publicPath [publicPath]', 'publicPath', '').option('-m, --module [module]', 'css,babel,jsx').option('--config', '配置文件', 'webpack.config.js').option('--mode [mode]', '转换模式：development（默认值）、production，production模式下minify生效', 'development').option('--banner [banner]', '在每个转换文件顶部添加注释文本', '').option('--strictMode [strictMode]', '参考 babel', /^true|false$/, 'true').option('--cnpm', '使用cnpm安装依赖', true).option('--corejs [corejs]', '参考 babel-runtime', true).option('--helpers [helpers]', '参考 babel-runtime', true).option('--regenerator [regenerator]', '参考 babel-runtime', true).parse(process.argv);
const options = {
  mode: program.mode,
  banner: program.banner,
  watch: !!program.watch,
  target: program.target,
  clear: !!program.clear,
  cnpm: !!program.cnpm,
  publicPath: program.publicPath,
  babelOptions: {
    strictMode: program.strictMode === 'false' ? false : true,
    corejs: program.corejs === 'false' ? false : 2,
    helpers: program.helpers === 'false' ? false : true,
    regenerator: program.regenerator === 'false' ? false : true
  }
};
const enableModule = {
  "babel": false,
  "css": false,
  "less": false,
  "sass": false,
  "eslint": false,
  "json5": false,
  "jsx": false,
  "vue": false
};
program.module = program.module || 'babel,css,jsx';
program.module.split(',').forEach(m => {
  enableModule[m] = true;
});
options.modules = enableModule;
let opts = null;
let entry = './src/index.js';

if (program.config) {
  const configFile = path.resolve(program.config);

  if (!fs.existsSync(configFile)) {
    throw new Error(`${program.config} not exists!`);
  }

  opts = require(configFile);

  if (typeof opts === 'function') {
    opts = opts(program);
  }

  start(opts.entry || './src/index.js', opts.outputDir || 'dist', opts);
} else {
  if (program.args.length) entry = path.resolve(program.args[0]);

  if (!fs.existsSync(entry)) {
    throw new Error(`${entry} not exists!`);
  }

  const stats = fs.statSync(entry);

  if (stats.isDirectory()) {
    const entries = {};
    const results = fs.readdirSync(entry);
    results.forEach(file => {
      if (/\.js$/.test(file)) {
        entries[file.replace(/\.js$/, '')] = path.resolve(entry, file);
      }
    });
    entry = entries;
  }

  start(entry, program.outDir, options);
}