import { defaultsDeep } from 'lodash';

module.exports = function (opts) {

    return defaultsDeep(
        {
            nodeEnv: opts.mode,
        },
        opts.optimization || {},
        {
            runtimeChunk: true,
            splitChunks: {
                chunks: 'all',
                name: false,
            }
        }
    );
}