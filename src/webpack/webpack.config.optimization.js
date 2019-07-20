import { defaultsDeep } from "lodash";
import TerserPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import safePostCssParser from "postcss-safe-parser";

module.exports = function(opts) {
    const shouldUseSourceMap = opts.shouldUseSourceMap;
    const isEnvProduction = opts.mode === "production";

    return defaultsDeep(
        {
            nodeEnv: opts.mode
        },
        opts.optimization || {},
        {
            minimize: isEnvProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        }
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: shouldUseSourceMap
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: shouldUseSourceMap
                            ? {
                                  inline: false,
                                  annotation: true
                              }
                            : false
                    }
                })
            ],
            runtimeChunk: true,
            splitChunks: {
                chunks: "all",
                name: false
            }
        }
    );
};
