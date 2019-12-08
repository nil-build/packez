import _ from "lodash";
export default function getBabelConfig(options) {
    const plugins = options.plugins || [];
    const presets = options.presets || [];

    return {
        babelrc: _.get(options, "babelrc", true),
        configFile: _.get(options, "configFile", true),
        compact: _.get(options, "compact", false),
        presets: [
            [
                require.resolve("babel-preset-packez"),
                _.defaultsDeep(
                    {},
                    _.omit(options, [
                        "presets",
                        "plugins",
                        "babelrc",
                        "configFile",
                        "compact"
                    ]),
                    {
                        corejs: 3,
                        useBuiltIns: "usage", //entry|usage|false
                        loose: true,
                        modules: false,
                        strictMode: true,
                        decoratorsBeforeExport: true
                    }
                )
            ],
            ...presets
        ],
        plugins: [...plugins]
    };
}
