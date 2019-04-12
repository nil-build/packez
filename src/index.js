
import getWebpackConfig from './webpack/webpack.config';
import checkDeps from "./checkDeps"
import initConfig from "./initConfig"
import start from "./scripts/start";
import build from "./scripts/build"

export {
    initConfig,
    getWebpackConfig,
    checkDeps,
    start,
    build
}