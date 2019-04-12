import _ from "lodash";
import fs from "fs-extra";
import initConfig from "../initConfig";
import checkDeps from "../checkDeps";
import getWebpackConfig from '../webpack/webpack.config';
import run from './run';

export default function (entry, output, opts = {}) {
    opts = _.omit(opts, ['devServer']);

    const config = initConfig(entry, output, opts);

    checkDeps(config);

    const webpackConfig = getWebpackConfig(config);

    fs.ensureDirSync(webpackConfig.output.path);

    if (config.clear) {
        fs.emptyDirSync(webpackConfig.output.path);
    }
    //config.watch
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