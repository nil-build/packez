
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  const appSrc = Array.isArray(opts.appSrc) ? opts.appSrc : [opts.appSrc];
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
    const exclude = babelOptions.exclude;
    const plugins = babelOptions.plugins || [];
    const presets = babelOptions.presets || [];
    delete babelOptions.exclude;
    return {
      test: /\.(js|mjs|jsx)$/,
      loader: require.resolve("babel-loader"),
      include: includePaths,
      exclude: exclude || /node_modules/,
      options: {
        babelrc: _lodash.default.get(babelOptions, "babelrc", true),
        configFile: _lodash.default.get(babelOptions, "configFile", true),
        compact: _lodash.default.get(babelOptions, "compact", false),
        presets: [[require.resolve("babel-preset-packez"), _lodash.default.defaultsDeep({}, _lodash.default.omit(babelOptions, ["presets", "plugins", "babelrc", "configFile", "compact"]), {
          corejs: 3,
          loose: true,
          strictMode: true,
          modules: "commonjs",
          useBuiltIns: "usage",
          decoratorsBeforeExport: true
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
    options: _objectSpread({}, loaders.html)
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
      return _objectSpread({}, loader, {
        enforce: "pre"
      });
    }), // run the linter.
    loaders.eslint && {
      enforce: "pre",
      test: /\.(js|mjs|jsx)$/,
      include: includePaths,
      exclude: /node_modules/,
      loader: require.resolve("eslint-loader"),
      options: _objectSpread({}, loaders.eslint, {
        baseConfig: require("../config/eslint.config.js"),
        eslintPath: require.resolve("eslint")
      })
    }, {
      oneOf
    }].filter(Boolean)
  };
};