
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

const postConfig = require("../config/postcss.config");

module.exports = function (opts) {
  let oneOf = [];
  const isEnvProduction = opts.mode === "production";

  const mediaPublicPath = _lodash.default.get(opts, "assest.media.publicPath", opts.publicPath);

  const assestMedia = opts.assest.media;
  const loaders = opts.loaders || {};
  const preLoaderExtra = opts.preLoaderExtra || [];
  const loaderExtra = opts.loaderExtra || [];
  const cssRegex = /\.css$/;
  const cssModuleRegex = /\.module\.css$/;
  const sassRegex = /\.(scss|sass)$/;
  const sassModuleRegex = /\.module\.(scss|sass)$/;
  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;
  const appSrc = (0, _isArray.default)(opts.appSrc) ? opts.appSrc : [opts.appSrc];
  let includePaths = [...appSrc.filter(Boolean).map(appPath => _path.default.resolve(opts.cwd, appPath))];
  includePaths = includePaths.length ? includePaths : undefined;

  const getStyleLoaders = function (cssOptions, preProcessor) {
    const publicPath = _lodash.default.get(opts, "assest.css.publicPath", opts.publicPath);

    return [{
      test: cssOptions.cssRegex,
      exclude: cssOptions.cssModuleRegex,
      use: [opts.inlineStyle ? require.resolve("style-loader") : {
        loader: require(require.resolve("mini-css-extract-plugin")).loader,
        options: {
          publicPath
        }
      }, {
        loader: require.resolve("css-loader"),
        options: {
          importLoaders: cssOptions.importLoaders,
          sourceMap: isEnvProduction && opts.shouldUseSourceMap
        }
      }, {
        loader: require.resolve("postcss-loader"),
        options: postConfig(opts)
      }, preProcessor && require.resolve(preProcessor)].filter(Boolean)
    }, {
      test: cssOptions.cssModuleRegex,
      use: [opts.inlineStyle ? require.resolve("style-loader") : {
        loader: require(require.resolve("mini-css-extract-plugin")).loader,
        options: {
          publicPath
        }
      }, {
        loader: require.resolve("css-loader"),
        options: {
          importLoaders: cssOptions.importLoaders,
          modules: true,
          sourceMap: isEnvProduction && opts.shouldUseSourceMap
        }
      }, {
        loader: require.resolve("postcss-loader"),
        options: postConfig(opts)
      }, preProcessor && require.resolve(preProcessor)].filter(Boolean)
    }];
  };

  const getBabelLoader = function (babelOptions) {
    babelOptions = _lodash.default.isObject(loaders.babel) ? loaders.babel : {};
    const plugins = babelOptions.plugins || [];
    const presets = babelOptions.presets || [];
    return {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      include: includePaths,
      exclude: /node_modules/,
      options: {
        babelrc: _lodash.default.get(babelOptions, "babelrc", true),
        configFile: _lodash.default.get(babelOptions, "configFile", true),
        compact: _lodash.default.get(babelOptions, "compact", false),
        presets: [[require.resolve("babel-preset-packez"), _lodash.default.defaultsDeep({}, _lodash.default.omit(babelOptions, ["presets", "plugins", "babelrc", "configFile", "compact"]), {
          // runtimeOptions: {
          //     corejs: 3,
          //     helpers: true,
          //     regenerator: true
          // },
          corejs: 3,
          useBuiltIns: "usage",
          modules: "commonjs",
          strictMode: true
        })], ...presets],
        plugins: [...plugins],
        cacheDirectory: true,
        cacheCompression: isEnvProduction,
        compact: isEnvProduction
      }
    };
  };

  oneOf = [//扩展模块
  ...loaderExtra, //自定义匹配规则
  loaders.raw && {
    test: _lodash.default.get(loaders, "raw.test") || /\.txt$/,
    loader: require.resolve("raw-loader")
  }, {
    test: /\.ejs?$/,
    loader: require.resolve("ejs-loader")
  }, //html文件加载
  loaders.html && {
    test: /\.html?$/,
    loader: require.resolve("html-loader"),
    options: { ...loaders.html
    }
  }, // js文件处理
  loaders.babel && getBabelLoader(loaders.babel), //资源文件如图片
  assestMedia.regexp && {
    test: assestMedia.regexp,
    use: [{
      loader: require.resolve("url-loader"),
      options: {
        limit: assestMedia.limit,
        name: assestMedia.name,
        outputPath: assestMedia.output,
        publicPath: mediaPublicPath
      }
    }]
  }, //处理json5
  loaders.json5 && {
    test: /\.json5$/,
    loader: require.resolve("json5-loader")
  }, //处理vue格式文件
  loaders.vue && {
    test: /\.vue$/,
    loader: require.resolve("vue-loader")
  }].filter(Boolean);

  if (loaders.css) {
    oneOf.push(...getStyleLoaders({
      cssRegex,
      cssModuleRegex,
      importLoaders: 1
    }));
  }

  if (loaders.scss || loaders.sass) {
    oneOf.push(...getStyleLoaders({
      cssRegex: sassRegex,
      cssModuleRegex: sassModuleRegex,
      importLoaders: 2
    }, "sass-loader"));
  }

  if (loaders.less) {
    oneOf.push(...getStyleLoaders({
      cssRegex: lessRegex,
      cssModuleRegex: lessModuleRegex,
      importLoaders: 2
    }, "less-loader"));
  } // 使用file-loader处理其他文件


  oneOf.push({
    loader: require.resolve("file-loader"),
    // Exclude `js` files to keep "css" loader working as it injects
    // its runtime that would otherwise be processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.ejs$/, /\.json$/],
    options: {
      name: assestMedia.name,
      outputPath: assestMedia.output,
      publicPath: mediaPublicPath
    }
  });
  return {
    rules: [// Disable require.ensure
    {
      parser: {
        requireEnsure: false
      }
    }, ...preLoaderExtra.map(loader => {
      return { ...loader,
        enforce: "pre"
      };
    }), // run the linter.
    loaders.eslint && {
      enforce: "pre",
      test: /\.(js|mjs|jsx)$/,
      include: includePaths,
      exclude: /node_modules/,
      loader: require.resolve("eslint-loader"),
      options: { ...loaders.eslint,
        baseConfig: require("../config/eslint.config.js"),
        eslintPath: require.resolve("eslint")
      }
    }, {
      oneOf
    }].filter(Boolean)
  };
};