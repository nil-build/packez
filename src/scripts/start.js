import webpack from "webpack";
import _ from "lodash";
import fs from "fs-extra";
import log from '../logger';
import initConfig from "../initConfig";
import checkDeps from "../checkDeps";
import getWebpackConfig from '../webpack/webpack.config';

export default function (entry, output, opts = {}) {
    const watch = opts.watch;

    opts = _.omit(opts, ['devServer', 'watch']);

    opts = initConfig(entry, output, opts);

    checkDeps(opts);

    const webpackConfig = getWebpackConfig(opts);

    fs.ensureDirSync(webpackConfig.output.path);

    if (opts.clear) {
        fs.emptyDirSync(webpackConfig.output.path);
    }

    const compiler = webpack(webpackConfig);

    const compilerCb = function (err, stats) {
        if (err) {
            return log(err);
        }

        log(stats.toString({
            chunks: false,
            colors: true,
        }));
    }
    if (watch) {
        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, compilerCb);
    } else {
        compiler.run(compilerCb);
    }

}