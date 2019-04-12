import _ from "lodash";
import fs from "fs-extra";
import initConfig from "../initConfig";
import checkDeps from "../checkDeps";
import getWebpackConfig from '../webpack/webpack.config';
import run from './run';

export default function (entry, output, opts = {}) {
    opts = _.omit(opts, ['devServer']);

    opts = initConfig(entry, output, opts);

    checkDeps(opts);

    const webpackConfig = getWebpackConfig(opts);

    fs.ensureDirSync(webpackConfig.output.path);

    if (opts.clear) {
        fs.emptyDirSync(webpackConfig.output.path);
    }

    run(
        _.defaultsDeep(
            webpackConfig,
            {
                watch: true,
                watchOptions: {
                    aggregateTimeout: 300,
                    poll: undefined
                }
            }
        )
    );

}