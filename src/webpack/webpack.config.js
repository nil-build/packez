import path from "path";
import _ from "lodash";
import getWebpackModules from "./getWebpackModules";
import getWebpackPlugins from "./getWebpackPlugins";
import getWebpackOptimization from "./getWebpackOptimization";

module.exports = function(opts) {
    const assestJs = opts.assest.js;
    const isEnvProduction = opts.mode === "production";
    const isEnvDevelopment = opts.mode === "development";
    const options = {
        context: opts.cwd,
        mode: opts.mode,
        bail: isEnvProduction,
        devtool: isEnvProduction
            ? opts.shouldUseSourceMap
                ? "source-map"
                : false
            : isEnvDevelopment && "cheap-module-source-map",
        entry: opts.entry,
        output: _.defaultsDeep(
            {
                path: path.resolve(opts.cwd, opts.outputDir),
                filename: [assestJs.output || ".", assestJs.name].join("/"),
                chunkFilename: [
                    assestJs.output || ".",
                    assestJs.chunkName
                ].join("/"),
                publicPath: opts.publicPath
            },
            opts.output || {}
        ),

        module: getWebpackModules(opts),
        plugins: getWebpackPlugins(opts),
        optimization: getWebpackOptimization(opts),
        externals: opts.externals,
        resolve: {
            extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx"],
            ...opts.resolve
        },
        performance: opts.performance,
        target: opts.target
    };

    if (opts.node) {
        options.node = opts.node;
    }

    return options;
};
