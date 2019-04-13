
import getWebpackConfig from './webpack/webpack.config';
import checkDeps from "./checkDeps"
import initConfig from "./initConfig"
import start from "./scripts/start";
import build from "./scripts/build";
import analyzer from './scripts/analyzer';
import server from './scripts/server';

export {
    initConfig,
    getWebpackConfig,
    checkDeps,
    start,
    build,
    analyzer,
    server,
}