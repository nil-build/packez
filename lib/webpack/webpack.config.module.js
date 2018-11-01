
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

const path = require('path');

const fs = require("fs");

const babelConfig = require("../config/babel.config");

const postConfig = require("../config/postcss.config");
/**
 * 常用加载器
 */


function defaultLoaders(cfg) {
  const assestMedia = cfg.assest.media;
  const exclude = [/\.ejs$/, /\.jsx?$/, /\.css$/, /\.scss$/, /\.sass$/, /\.less$/, /\.json5?$/, /\.html?$/, cfg.rawLoaderRegexp, assestMedia.regexp];

  if (cfg.module.vue) {
    exclude.push(/\.vue$/);
  }

  return [//自定义匹配规则
  {
    test: cfg.rawLoaderRegexp,
    loader: require.resolve("raw-loader")
  }, //html文件加载
  {
    test: /\.html?$/,
    loader: require.resolve("html-loader"),
    options: cfg.htmlLoaderOptions
  }, //资源文件如图片
  {
    test: assestMedia.regexp,
    use: [{
      loader: require.resolve('url-loader'),
      options: {
        limit: assestMedia.limit,
        name: path.join(assestMedia.output, assestMedia.name)
      }
    }]
  }, //其他文件
  {
    exclude,
    loader: require.resolve('file-loader'),
    options: {
      name: path.join(assestMedia.output, assestMedia.name)
    }
  }];
}

const loaders = {
  babel(cfg) {
    return {
      test: /\.jsx?$/,
      exclude: cfg.babelOptions.exclude,
      use: [{
        loader: require.resolve('babel-loader'),
        options: babelConfig(cfg)
      }]
    };
  },

  css(cfg) {
    return {
      test: /\.css$/,
      use: [cfg.inlineStyle ? require.resolve("style-loader") : require(require.resolve("mini-css-extract-plugin")).loader, require.resolve('css-loader'), {
        loader: require.resolve("postcss-loader"),
        options: postConfig(cfg)
      }]
    };
  },

  less(cfg) {
    return {
      test: /\.less$/,
      use: [cfg.inlineStyle ? require.resolve("style-loader") : require(require.resolve("mini-css-extract-plugin")).loader, require.resolve('css-loader'), {
        loader: require.resolve("postcss-loader"),
        options: {
          config: {
            path: path.resolve(__dirname, '../config/postcss.config.js')
          }
        }
      }, require.resolve("less-loader")]
    };
  },

  scss(cfg) {
    return {
      test: /\.s(?:a|c)ss$/,
      use: [cfg.inlineStyle ? require.resolve("style-loader") : require(require.resolve("mini-css-extract-plugin")).loader, require.resolve('css-loader'), {
        loader: require.resolve("postcss-loader"),
        options: {
          config: {
            path: path.resolve(__dirname, '../config/postcss.config.js')
          }
        }
      }, require.resolve("sass-loader")]
    };
  },

  sass(cfg) {
    return this.scss(cfg);
  },

  json5(cfg) {
    return {
      test: /\.json5$/,
      loader: require.resolve('json5-loader')
    };
  },

  vue(cfg) {
    return {
      test: /\.vue$/,
      loader: require.resolve("vue-loader")
    };
  }

};

module.exports = function (cfg) {
  const rules = [];
  const oneOf = [];
  const enableModule = cfg.module; // const assestMedia = cfg.assest.media;

  if (cfg.module.eslint) {
    const eslintFile = fs.existsSync(cfg.eslintFile) ? cfg.eslintFile : null;
    rules.push({
      enforce: "pre",
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: require.resolve("eslint-loader"),
      options: {
        baseConfig: require("../config/eslint.config.js"),
        useEslintrc: false,
        configFile: eslintFile
      }
    });
  }

  (0, _keys.default)(enableModule).forEach(module => {
    if (enableModule[module] && loaders[module]) {
      oneOf.push(loaders[module](cfg));
    }
  });
  oneOf.push(...defaultLoaders(cfg));
  rules.push({
    oneOf
  });
  return {
    rules
  };
};