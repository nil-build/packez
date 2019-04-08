const browserslist = require('./browserslist.config');

module.exports = function (cfg) {
    const options = cfg.babelOptions;
    const useJSX = cfg.modules.jsx;
    const modules = options.modules;
    const strictMode = options.strictMode;
    const plugins = options.plugins || [];

    const presets = [
        [
            require.resolve('@babel/preset-env'),
            {
                "targets": {
                    //"ie": 9,
                    "browsers": cfg.browsers || browserslist
                },
                modules,
                useBuiltIns: false,
                exclude: [
                    'transform-typeof-symbol',
                    'transform-unicode-regex',
                    'transform-sticky-regex',
                ],
            }
        ],
        useJSX ? require.resolve('@babel/preset-react') : null,
        require.resolve('@babel/preset-flow')
    ];

    const modulesMap = {
        'commonjs': require.resolve('@babel/plugin-transform-modules-commonjs'),
        'cjs': require.resolve('@babel/plugin-transform-modules-commonjs'),
        'umd': require.resolve('@babel/plugin-transform-modules-umd'),
        'amd': require.resolve('@babel/plugin-transform-modules-amd'),
        'systemjs': require.resolve('@babel/plugin-transform-modules-systemjs'),
    };
    const modulePlugin = modulesMap[modules] ? [
        modulesMap[modules],
        {
            strictMode
        }
    ] : null;

    return {
        "babelrc": false,
        "compact": false,
        "presets": presets.filter(v => v),
        "plugins": [
            ...plugins,
            require.resolve("@babel/plugin-syntax-dynamic-import"),
            require.resolve("@babel/plugin-proposal-async-generator-functions"),
            [
                require.resolve("@babel/plugin-proposal-decorators"), {
                    decoratorsBeforeExport: true,
                    legacy: false,
                    // legacy: true
                }
            ],
            [
                require.resolve("@babel/plugin-proposal-class-properties"),
                {
                    loose: true
                }
            ],
            require.resolve("@babel/plugin-proposal-do-expressions"),
            require.resolve("@babel/plugin-proposal-export-default-from"),
            require.resolve("@babel/plugin-proposal-export-namespace-from"),
            require.resolve("@babel/plugin-proposal-function-bind"),
            require.resolve("@babel/plugin-proposal-logical-assignment-operators"),
            require.resolve("@babel/plugin-proposal-nullish-coalescing-operator"),
            require.resolve("@babel/plugin-proposal-numeric-separator"),
            require.resolve("@babel/plugin-proposal-optional-chaining"),
            require.resolve("@babel/plugin-proposal-throw-expressions"),
            useJSX ? require.resolve("@babel/plugin-transform-react-jsx") : null,
            //"@babel/plugin-transform-react-jsx-self", //self
            require.resolve("@babel/plugin-transform-proto-to-assign"), //Internet Explorer(10 and below)
            [require.resolve("@babel/plugin-proposal-pipeline-operator"), { "proposal": "minimal" }],
            [require.resolve("@babel/plugin-transform-runtime"), {
                corejs: options.corejs ? 2 : false,
                helpers: options.helpers,
                regenerator: options.regenerator,
                //useESModules: false,
            }],
            modulePlugin
        ].filter(v => v)
    };

}